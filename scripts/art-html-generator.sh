#!/bin/bash
# art-html-generator — Generate standalone HTML for art algorithms
# Usage: art-html-generator <algorithm-name>

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${SCRIPT_DIR}/.."
ALGO_NAME="$1"

if [ -z "$ALGO_NAME" ]; then
    echo "Usage: art-html-generator <algorithm-name>"
    echo ""
    echo "Available algorithms without HTML:"
    cd "$APP_DIR"
    for ts in lib/art/*.ts; do
        name=$(basename "$ts" .ts)
        if [ "$name" = "index" ] || [ "$name" = "types" ]; then continue; fi
        if [[ "$name" == *"-thumb" ]]; then continue; fi
        if [[ "$name" == *"-generator" ]]; then continue; fi
        if [ -f "public/art/${name}.html" ]; then continue; fi
        # Skip non-art files
        if grep -q "export.*ArtGenerator\|render.*CanvasRenderingContext2D" "$ts" 2>/dev/null; then
            echo "  - $name"
        fi
    done
    exit 1
fi

TS_FILE="$APP_DIR/lib/art/${ALGO_NAME}.ts"
HTML_FILE="$APP_DIR/public/art/${ALGO_NAME}.html"

if [ ! -f "$TS_FILE" ]; then
    echo "Error: Algorithm '$ALGO_NAME' not found at $TS_FILE"
    exit 1
fi

if [ -f "$HTML_FILE" ]; then
    echo "Error: HTML already exists at $HTML_FILE"
    exit 1
fi

# Extract algorithm metadata
ALGO_TITLE=$(echo "$ALGO_NAME" | sed 's/-/ /g' | sed 's/\b\w/\u&/g')
ALGO_DESC="Generative art algorithm"

# Try to extract description from the file
if grep -q "name:" "$TS_FILE"; then
    ALGO_TITLE=$(grep -o 'name: "[^"]*"' "$TS_FILE" | head -1 | sed 's/name: "//;s/"$//')
fi

# Extract default parameters
PARAMS=$(grep -A 20 "export.*defaultParams" "$TS_FILE" | grep -E "^\s+\w+:" | sed 's/:.*//' | sed 's/ //g')

# Extract color schemes if present
COLOR_SCHEMES=$(grep -o '"[^"]*": \[' "$TS_FILE" | sed 's/":.*//' | sed 's/"//g' | head -5)

# Extract render function name
RENDER_FUNC=$(grep -oE "export function render[A-Za-z]+" "$TS_FILE" | head -1 | sed 's/export function //')
if [ -z "$RENDER_FUNC" ]; then
    RENDER_FUNC=$(grep -oE "function render[A-Za-z]+" "$TS_FILE" | head -1 | sed 's/function //')
fi
if [ -z "$RENDER_FUNC" ]; then
    RENDER_FUNC="render${ALGO_TITLE// /}"
fi

echo "Generating HTML for: $ALGO_TITLE"
echo "  Render function: $RENDER_FUNC"

# Create HTML file
cat > "$HTML_FILE" << 'HTMLHEAD'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ALGO_TITLE — Generative Art</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #05050a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
    }
    canvas {
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .controls {
      margin-top: 20px;
      color: #888;
      font-size: 14px;
    }
    .param-controls {
      margin-top: 16px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      color: #666;
      font-size: 12px;
    }
    .param-controls label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .param-controls input[type="range"] {
      width: 80px;
    }
    .param-controls select {
      background: #1a1a1a;
      color: #888;
      border: 1px solid #333;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .buttons {
      margin-top: 16px;
      display: flex;
      gap: 12px;
    }
    button {
      background: #1a1a1a;
      color: #888;
      border: 1px solid #333;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    button:hover {
      background: #2a2a2a;
      color: #aaa;
    }
  </style>
</head>
<body>
  <canvas id="art" width="600" height="600"></canvas>
  <div class="controls">ALGO_TITLE — ALGO_DESC</div>
HTMLHEAD

# Replace placeholders
sed -i "s/ALGO_TITLE/$ALGO_TITLE/g" "$HTML_FILE"
sed -i "s/ALGO_DESC/$ALGO_DESC/g" "$HTML_FILE"

# Add parameter controls based on extracted params
echo '  <div class="param-controls">' >> "$HTML_FILE"

# Add color scheme selector if schemes found
if [ -n "$COLOR_SCHEMES" ]; then
    echo '    <label>' >> "$HTML_FILE"
    echo '      Color Scheme:' >> "$HTML_FILE"
    echo '      <select id="colorScheme">' >> "$HTML_FILE"
    for scheme in $COLOR_SCHEMES; do
        echo "        <option value=\"$scheme\">$scheme</option>" >> "$HTML_FILE"
    done
    echo '      </select>' >> "$HTML_FILE"
    echo '    </label>' >> "$HTML_FILE"
fi

# Add common parameter controls
echo '    <label>' >> "$HTML_FILE"
echo '      Animation:' >> "$HTML_FILE"
echo '      <input type="checkbox" id="animated" checked>' >> "$HTML_FILE"
echo '    </label>' >> "$HTML_FILE"

echo '  </div>' >> "$HTML_FILE"

# Add buttons
cat >> "$HTML_FILE" << 'BUTTONS'
  <div class="buttons">
    <button id="regenerate">Regenerate</button>
    <button id="download">Download</button>
  </div>
BUTTONS

# Start script section
cat >> "$HTML_FILE" << 'SCRIPTSTART'

  <script>
    const canvas = document.getElementById('art');
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    let params = {};
SCRIPTSTART

# Extract and inline the algorithm code
# This is a simplified approach - copy the core algorithm functions
echo "" >> "$HTML_FILE"
echo "    // === Algorithm: $ALGO_TITLE ===" >> "$HTML_FILE"
echo "" >> "$HTML_FILE"

# Copy the algorithm code (excluding imports and exports)
grep -v "^import\|^export.*from\|^export interface\|^export const.*:" "$TS_FILE" | \
grep -v "^export default\|^export {" >> "$HTML_FILE" || true

# Add the render loop
cat >> "$HTML_FILE" << 'RENDERLOOP'

    // === Render Loop ===
    function render() {
      time += 0.016;
      
      // Get current parameter values
      const animated = document.getElementById('animated')?.checked ?? true;
      const colorScheme = document.getElementById('colorScheme')?.value ?? 'default';
      
      params = {
        ...params,
        animated,
        colorScheme,
      };
      
      // Call the render function
      try {
        if (typeof renderToCanvas === 'function') {
          renderToCanvas(ctx, params, time);
        } else if (typeof generate === 'function') {
          generate(ctx, params, time);
        } else {
          // Fallback: clear and draw placeholder
          ctx.fillStyle = '#0a0a0f';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#888';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Algorithm loaded', canvas.width/2, canvas.height/2);
        }
      } catch (e) {
        console.error('Render error:', e);
      }
      
      if (animated) {
        animationId = requestAnimationFrame(render);
      }
    }
    
    // Start rendering
    render();
    
    // Regenerate button
    document.getElementById('regenerate').addEventListener('click', () => {
      time = 0;
      if (typeof reset === 'function') reset();
      if (animationId) cancelAnimationFrame(animationId);
      render();
    });
    
    // Download button
    document.getElementById('download').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'ALGO_NAME.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
    
    // Parameter change handlers
    document.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('change', () => {
        if (animationId) cancelAnimationFrame(animationId);
        render();
      });
    });
  </script>
</body>
</html>
RENDERLOOP

# Replace algorithm name in download
sed -i "s/ALGO_NAME/$ALGO_NAME/g" "$HTML_FILE"

echo ""
echo "✓ Generated: $HTML_FILE"
echo ""
echo "Next steps:"
echo "  1. Customize the parameter controls"
echo "  2. Test: open $HTML_FILE"
echo "  3. Commit: git add $HTML_FILE"
