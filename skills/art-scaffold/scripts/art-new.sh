#!/bin/bash
#
# art-new — Scaffold a new generative art piece
# Usage: art-new <kebab-name> "Descriptive Name"
#
# Example: art-new flowing-lines "Flowing Lines"

set -e

# Validate args
if [ $# -lt 2 ]; then
    echo "Usage: art-new <kebab-name> \"Descriptive Name\""
    echo "Example: art-new flowing-lines \"Flowing Lines\""
    exit 1
fi

KEBAB_NAME="$1"
DISPLAY_NAME="$2"
# Convert kebab-case to PascalCase (e.g., flowing-lines -> FlowingLines)
CAMEL_NAME=$(echo "$KEBAB_NAME" | sed -E 's/-([a-z])/\U\1/g; s/^([a-z])/\u\1/')
# Convert PascalCase to camelCase (e.g., FlowingLines -> flowingLines)  
FUNC_NAME=$(echo "$CAMEL_NAME" | sed -E 's/^([A-Z])/\L\1/')
UPPER_NAME=$(echo "$CAMEL_NAME" | tr '[:lower:]' '[:upper:]')

PORTFOLIO_DIR="/root/.openclaw/workspace/nemo-portfolio/my-app"

if [ ! -d "$PORTFOLIO_DIR" ]; then
    echo "Error: Portfolio not found at $PORTFOLIO_DIR"
    exit 1
fi

echo "🎨 Scaffolding: $DISPLAY_NAME ($KEBAB_NAME)"

# 1. Create core algorithm file
cat > "$PORTFOLIO_DIR/lib/art/$KEBAB_NAME.ts" << 'EOF'
export interface {CAMEL}Params {
  speed: number;
  density: number;
  colorScheme: 'ocean' | 'sunset' | 'forest' | 'neon';
}

export const {FUNC}DefaultParams: {CAMEL}Params = {
  speed: 50,
  density: 50,
  colorScheme: 'ocean',
};

export function render{CAMEL}(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  params: {CAMEL}Params
): void {
  const { speed, density, colorScheme } = params;
  const t = time * speed * 0.001;
  
  // Clear canvas
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);
  
  // Get pixel data for direct manipulation
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  // Color palettes
  const palettes: Record<string, Array<[number, number, number]>> = {
    ocean: [[0, 20, 40], [0, 60, 120], [0, 150, 200], [100, 200, 255]],
    sunset: [[40, 0, 40], [120, 20, 60], [255, 100, 50], [255, 200, 100]],
    forest: [[10, 30, 10], [30, 80, 30], [60, 160, 60], [150, 220, 100]],
    neon: [[20, 0, 40], [80, 0, 120], [200, 50, 255], [255, 150, 255]],
  };
  
  const palette = palettes[colorScheme];
  
  // Sample every 2x2 pixels for performance
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      // TODO: Implement your algorithm here
      // Example: distance from center with time offset
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const value = Math.sin(dist * 0.05 - t) * 0.5 + 0.5;
      const colorIndex = Math.floor(value * (palette.length - 1));
      const [r, g, b] = palette[colorIndex];
      
      // Fill 2x2 block
      for (let dy = 0; dy < 2 && y + dy < height; dy++) {
        for (let dx = 0; dx < 2 && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          pixels[idx] = r;
          pixels[idx + 1] = g;
          pixels[idx + 2] = b;
          pixels[idx + 3] = 255;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}
EOF

# Replace placeholders
sed -i "s/{CAMEL}/$CAMEL_NAME/g" "$PORTFOLIO_DIR/lib/art/$KEBAB_NAME.ts"
sed -i "s/{FUNC}/$FUNC_NAME/g" "$PORTFOLIO_DIR/lib/art/$KEBAB_NAME.ts"

# 2. Create React component
cat > "$PORTFOLIO_DIR/components/$KEBAB_NAME.tsx" << 'EOF'
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { render{CAMEL}, {CAMEL}Params, {FUNC}DefaultParams } from '@/lib/art/{KEBAB}';

interface {CAMEL}Props {
  width?: number;
  height?: number;
  params?: Partial<{CAMEL}Params>;
}

export function {CAMEL}({ width = 400, height = 400, params = {} }: {CAMEL}Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mergedParams = { ...{FUNC}DefaultParams, ...params };

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    render{CAMEL}(ctx, width, height, time, mergedParams);
    animationRef.current = requestAnimationFrame(animate);
  }, [width, height, mergedParams]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}

// Static params for gallery integration
export function getStaticParams(): {CAMEL}Params {
  return { ...{FUNC}DefaultParams };
}
EOF

sed -i "s/{CAMEL}/$CAMEL_NAME/g" "$PORTFOLIO_DIR/components/$KEBAB_NAME.tsx"
sed -i "s/{FUNC}/$FUNC_NAME/g" "$PORTFOLIO_DIR/components/$KEBAB_NAME.tsx"
sed -i "s/{KEBAB}/$KEBAB_NAME/g" "$PORTFOLIO_DIR/components/$KEBAB_NAME.tsx"

# 3. Create standalone HTML
mkdir -p "$PORTFOLIO_DIR/public/art"

cat > "$PORTFOLIO_DIR/public/art/$KEBAB_NAME.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{DISPLAY} — Generative Art</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0a;
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
  </style>
</head>
<body>
  <canvas id="art" width="400" height="400"></canvas>
  <div class="controls">{DISPLAY} — Generative Art</div>
  <script>
    const canvas = document.getElementById('art');
    const ctx = canvas.getContext('2d');
    
    const params = {
      speed: 50,
      density: 50,
      colorScheme: 'ocean'
    };
    
    const palettes = {
      ocean: [[0, 20, 40], [0, 60, 120], [0, 150, 200], [100, 200, 255]],
      sunset: [[40, 0, 40], [120, 20, 60], [255, 100, 50], [255, 200, 100]],
      forest: [[10, 30, 10], [30, 80, 30], [60, 160, 60], [150, 220, 100]],
      neon: [[20, 0, 40], [80, 0, 120], [200, 50, 255], [255, 150, 255]],
    };
    
    function render(time) {
      const t = time * params.speed * 0.001;
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const palette = palettes[params.colorScheme];
      
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          const dx = x - width / 2;
          const dy = y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const value = Math.sin(dist * 0.05 - t) * 0.5 + 0.5;
          const colorIndex = Math.floor(value * (palette.length - 1));
          const [r, g, b] = palette[colorIndex];
          
          for (let dy = 0; dy < 2 && y + dy < height; dy++) {
            for (let dx = 0; dx < 2 && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              pixels[idx] = r;
              pixels[idx + 1] = g;
              pixels[idx + 2] = b;
              pixels[idx + 3] = 255;
            }
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
  </script>
</body>
</html>
EOF

sed -i "s/{DISPLAY}/$DISPLAY_NAME/g" "$PORTFOLIO_DIR/public/art/$KEBAB_NAME.html"

# 4. Update lib/art/index.ts
INDEX_FILE="$PORTFOLIO_DIR/lib/art/index.ts"

# Check if export already exists
if ! grep -q "from './$KEBAB_NAME'" "$INDEX_FILE" 2>/dev/null; then
    echo "" >> "$INDEX_FILE"
    echo "// {DISPLAY}" >> "$INDEX_FILE"
    echo "export { render{CAMEL}, {FUNC}DefaultParams } from './{KEBAB}';" >> "$INDEX_FILE"
    echo "export type { {CAMEL}Params } from './{KEBAB}';" >> "$INDEX_FILE"
    
    sed -i "s/{DISPLAY}/$DISPLAY_NAME/g" "$INDEX_FILE"
    sed -i "s/{CAMEL}/$CAMEL_NAME/g" "$INDEX_FILE"
    sed -i "s/{FUNC}/$FUNC_NAME/g" "$INDEX_FILE"
    sed -i "s/{KEBAB}/$KEBAB_NAME/g" "$INDEX_FILE"
    
    echo "✓ Updated lib/art/index.ts"
fi

# Summary
echo ""
echo "✅ Scaffolded: $DISPLAY_NAME"
echo ""
echo "Files created:"
echo "  lib/art/$KEBAB_NAME.ts"
echo "  components/$KEBAB_NAME.tsx"
echo "  public/art/$KEBAB_NAME.html"
echo "  lib/art/index.ts (updated)"
echo ""
echo "Next steps:"
echo "  1. Implement algorithm in lib/art/$KEBAB_NAME.ts"
echo "  2. Add to gallery in app/art/page.tsx"
echo "  3. Test: open public/art/$KEBAB_NAME.html"
echo "  4. Commit: git add . && git commit -m \"feat: add $KEBAB_NAME generative art\""
