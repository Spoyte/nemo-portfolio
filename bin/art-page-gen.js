#!/usr/bin/env node
/**
 * Art Page Generator - Smart template generator for interactive art pages
 * 
 * Analyzes art generator files and creates complete interactive pages with
 * appropriate controls based on the algorithm's parameters.
 * 
 * Supports two patterns:
 * 1. New pattern: export interface *Params + export const *DefaultParams
 * 2. Legacy pattern: ArtGenerator with params: { [key]: ParamConfig }
 * 
 * Usage: node art-page-gen.js <algorithm-name>
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const APP_DIR = path.join(PROJECT_ROOT, 'my-app');

// Color schemes for different art types
const THEME_COLORS = {
  nature: { primary: 'emerald', accent: '#3CD070', bg: 'from-slate-950 via-slate-900 to-slate-950' },
  cosmic: { primary: 'violet', accent: '#8B5CF6', bg: 'from-slate-950 via-indigo-950 to-slate-950' },
  ocean: { primary: 'cyan', accent: '#06B6D4', bg: 'from-slate-950 via-cyan-950 to-slate-950' },
  fire: { primary: 'orange', accent: '#F97316', bg: 'from-slate-950 via-orange-950 to-slate-950' },
  default: { primary: 'slate', accent: '#94A3B8', bg: 'from-slate-950 via-slate-900 to-slate-950' },
};

function findGeneratorFile(algorithmName) {
  const candidates = [
    path.join(APP_DIR, 'lib/art', `${algorithmName}.ts`),
    path.join(APP_DIR, 'lib/art', `${algorithmName}-generator.ts`),
  ];
  
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function analyzeGenerator(content, fileName) {
  const analysis = {
    pattern: 'unknown',
    hasInterface: false,
    interfaceName: null,
    hasDefaults: false,
    defaultsName: null,
    params: [],
    functionName: null,
    hasAnimate: false,
    importPath: path.basename(fileName, '.ts'),
  };
  
  // Check for new pattern: export interface *Params
  const interfaceMatch = content.match(/export interface (\w+Params)/);
  if (interfaceMatch) {
    analysis.pattern = 'new';
    analysis.hasInterface = true;
    analysis.interfaceName = interfaceMatch[1];
    
    // Extract interface properties
    const interfaceStart = content.indexOf(`export interface ${analysis.interfaceName}`);
    const interfaceEnd = content.indexOf('}', interfaceStart) + 1;
    const interfaceBlock = content.slice(interfaceStart, interfaceEnd);
    
    // Parse properties
    const propMatches = interfaceBlock.matchAll(/(\w+)\??\s*:\s*(number|string|boolean|'[^']+'|\[[^\]]+\])/g);
    for (const match of propMatches) {
      const [_, name, type] = match;
      analysis.params.push({
        name,
        type: type.replace(/'/g, ''),
        isOptional: match[0].includes('?'),
        config: inferParamConfig({ name, type: type.replace(/'/g, '') }, fileName),
      });
    }
    
    // Find default params
    const defaultsMatch = content.match(/export const (\w+DefaultParams)/);
    if (defaultsMatch) {
      analysis.hasDefaults = true;
      analysis.defaultsName = defaultsMatch[1];
    }
    
    // Find main function
    const funcMatch = content.match(/export (?:function|const) (\w+)\s*[\(:]/);
    if (funcMatch) {
      analysis.functionName = funcMatch[1];
    }
  }
  // Check for legacy pattern: ArtGenerator with params
  else if (content.includes('ArtGenerator') && content.includes('params:')) {
    analysis.pattern = 'legacy';
    
    // Extract params object
    const paramsMatch = content.match(/params:\s*\{([\s\S]*?)\},\s*meta:/);
    if (paramsMatch) {
      const paramsBlock = paramsMatch[1];
      
      // Parse each param definition
      const paramRegex = /(\w+):\s*\{[\s\S]*?default:\s*([^,\n]+)/g;
      let match;
      while ((match = paramRegex.exec(paramsBlock)) !== null) {
        const paramName = match[1];
        const defaultValue = match[2].trim();
        
        // Extract type from the param config
        const typeMatch = paramsBlock.match(new RegExp(`${paramName}:\s*\{[\s\S]*?type:\s*"([^"]+)"`));
        const type = typeMatch ? typeMatch[1] : 'range';
        
        // Extract min/max for ranges
        let min, max, step;
        if (type === 'range') {
          const minMatch = paramsBlock.match(new RegExp(`${paramName}:\s*\{[\s\S]*?min:\s*([\d.]+)`));
          const maxMatch = paramsBlock.match(new RegExp(`${paramName}:\s*\{[\s\S]*?max:\s*([\d.]+)`));
          const stepMatch = paramsBlock.match(new RegExp(`${paramName}:\s*\{[\s\S]*?step:\s*([\d.]+)`));
          min = minMatch ? parseFloat(minMatch[1]) : 0;
          max = maxMatch ? parseFloat(maxMatch[1]) : 100;
          step = stepMatch ? parseFloat(stepMatch[1]) : 1;
        }
        
        analysis.params.push({
          name: paramName,
          type,
          defaultValue,
          min,
          max,
          step,
          config: inferParamConfig({ name: paramName, type }, fileName),
        });
      }
    }
    
    // Find generate function or ArtGenerator name
    const nameMatch = content.match(/name:\s*"([^"]+)"/);
    if (nameMatch) {
      analysis.functionName = nameMatch[1].toLowerCase().replace(/\s+/g, '');
    }
    
    // For legacy, we'll need to create a wrapper
    analysis.needsWrapper = true;
  }
  
  // Check for animate method
  analysis.hasAnimate = content.includes('animate') || content.includes('generate');
  
  return analysis;
}

function inferParamConfig(param, algorithmName) {
  const name = param.name.toLowerCase();
  
  // Common parameter patterns
  const patterns = {
    count: { min: 1, max: 100, step: 1, icon: 'Layers', label: 'Count' },
    particle: { min: 10, max: 2000, step: 10, icon: 'Circle', label: 'Particles' },
    speed: { min: 0.1, max: 5, step: 0.1, icon: 'Zap', label: 'Speed' },
    intensity: { min: 0.1, max: 2, step: 0.1, icon: 'Sun', label: 'Intensity' },
    size: { min: 1, max: 100, step: 1, icon: 'Maximize', label: 'Size' },
    scale: { min: 0.001, max: 0.1, step: 0.001, icon: 'Maximize', label: 'Scale' },
    opacity: { min: 0, max: 1, step: 0.05, icon: 'Eye', label: 'Opacity' },
    alpha: { min: 0, max: 1, step: 0.05, icon: 'Eye', label: 'Alpha' },
    radius: { min: 1, max: 200, step: 1, icon: 'Circle', label: 'Radius' },
    width: { min: 1, max: 50, step: 1, icon: 'MoveHorizontal', label: 'Width' },
    height: { min: 1, max: 50, step: 1, icon: 'MoveVertical', label: 'Height' },
    density: { min: 1, max: 100, step: 1, icon: 'Grid3X3', label: 'Density' },
    complexity: { min: 1, max: 10, step: 1, icon: 'GitBranch', label: 'Complexity' },
    iterations: { min: 1, max: 1000, step: 10, icon: 'Repeat', label: 'Iterations' },
    angle: { min: 0, max: 360, step: 5, icon: 'RotateCw', label: 'Angle' },
    rotation: { min: 0, max: 360, step: 5, icon: 'RotateCw', label: 'Rotation' },
    hue: { min: 0, max: 360, step: 10, icon: 'Palette', label: 'Hue' },
    seed: { min: 1, max: 10000, step: 1, icon: 'Shuffle', label: 'Seed' },
    color: { type: 'select', icon: 'Palette', label: 'Color Scheme' },
    mode: { type: 'select', icon: 'Settings', label: 'Mode' },
    type: { type: 'select', icon: 'Settings', label: 'Type' },
    scheme: { type: 'select', icon: 'Palette', label: 'Scheme' },
  };
  
  for (const [pattern, config] of Object.entries(patterns)) {
    if (name.includes(pattern)) {
      return { ...config, param };
    }
  }
  
  // Default based on type
  if (param.type === 'range' || param.type === 'number') {
    return { min: 0, max: 100, step: 1, icon: 'SlidersHorizontal', label: param.name, param };
  }
  
  if (param.type === 'select' || param.type === 'string') {
    return { type: 'select', icon: 'List', label: param.name, param };
  }
  
  if (param.type === 'boolean') {
    return { type: 'checkbox', icon: 'ToggleLeft', label: param.name, param };
  }
  
  return { min: 0, max: 100, step: 1, icon: 'SlidersHorizontal', label: param.name, param };
}

function detectTheme(algorithmName, params) {
  const name = algorithmName.toLowerCase();
  const paramNames = params.map(p => p.name.toLowerCase()).join(' ');
  
  if (name.includes('tree') || name.includes('leaf') || name.includes('plant') || name.includes('nature') || paramNames.includes('organic')) {
    return THEME_COLORS.nature;
  }
  if (name.includes('star') || name.includes('space') || name.includes('cosmos') || name.includes('galaxy') || name.includes('nebula')) {
    return THEME_COLORS.cosmic;
  }
  if (name.includes('water') || name.includes('ocean') || name.includes('wave') || name.includes('flow') || name.includes('fluid')) {
    return THEME_COLORS.ocean;
  }
  if (name.includes('fire') || name.includes('flame') || name.includes('heat') || name.includes('sun') || name.includes('lava')) {
    return THEME_COLORS.fire;
  }
  return THEME_COLORS.default;
}

function generatePage(algorithmName, analysis) {
  const theme = detectTheme(algorithmName, analysis.params);
  const componentName = algorithmName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  const title = algorithmName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  
  // Generate imports
  const usedIcons = new Set(['Play', 'Pause', 'Sparkles', 'RotateCcw', 'SlidersHorizontal']);
  analysis.params.forEach(p => usedIcons.add(p.config.icon));
  
  const hasSelect = analysis.params.some(p => p.config.type === 'select');
  const hasCheckbox = analysis.params.some(p => p.config.type === 'checkbox');
  
  const extraImports = [];
  if (hasSelect) extraImports.push('Select', 'SelectContent', 'SelectItem', 'SelectTrigger', 'SelectValue');
  if (hasCheckbox) extraImports.push('Switch');
  
  const extraImportLine = extraImports.length > 0 
    ? `import { ${extraImports.join(', ')} } from "@/components/ui/${extraImports[0].toLowerCase()}";`
    : '';
  
  // Generate initial params based on pattern
  let initialParams, updateParamType;
  if (analysis.pattern === 'new') {
    initialParams = analysis.defaultsName;
    updateParamType = `keyof typeof ${analysis.defaultsName}`;
  } else {
    // Legacy: build params object from defaults
    const defaultEntries = analysis.params.map(p => {
      const val = p.defaultValue || (p.type === 'select' ? '"option1"' : '50');
      return `    ${p.name}: ${val},`;
    }).join('\n');
    initialParams = `{\n${defaultEntries}\n  }`;
    updateParamType = 'string';
  }
  
  // Generate control components
  const controls = analysis.params.map((p, i) => {
    const config = p.config;
    const name = p.name;
    
    if (config.type === 'select') {
      return `            {/* ${config.label} */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <${config.icon} className="w-4 h-4" />
                ${config.label}
              </label>
              <Select
                value={String(params.${name})}
                onValueChange={(v) => updateParam("${name}", v)}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Add options based on your ${name} values */}
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </div>`;
    }
    
    if (config.type === 'checkbox') {
      return `            {/* ${config.label} */}
            <div className="mb-5 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <${config.icon} className="w-4 h-4" />
                ${config.label}
              </label>
              <Switch
                checked={!!params.${name}}
                onCheckedChange={(v) => updateParam("${name}", v)}
              />
            </div>`;
    }
    
    // Use param-specific min/max/step if available (legacy pattern)
    const min = p.min !== undefined ? p.min : config.min;
    const max = p.max !== undefined ? p.max : config.max;
    const step = p.step !== undefined ? p.step : config.step;
    const decimals = String(step).split('.')[1]?.length || 0;
    
    // Slider (default)
    return `            {/* ${config.label} */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <${config.icon} className="w-4 h-4" />
                ${config.label}: {typeof params.${name} === 'number' ? params.${name}.toFixed(${decimals}) : params.${name}}
              </label>
              <Slider
                value={[params.${name}]}
                onValueChange={([v]) => updateParam("${name}", v)}
                min={${min}}
                max={${max}}
                step={${step}}
                className="w-full"
              />
            </div>`;
  }).join('\n\n');
  
  // Generate randomize logic
  const randomizeLogic = analysis.params.map(p => {
    const config = p.config;
    if (config.type === 'select') {
      return `      // ${p.name}: Add random selection from your options`;
    }
    if (config.type === 'checkbox') {
      return `      ${p.name}: Math.random() > 0.5,`;
    }
    const min = p.min !== undefined ? p.min : config.min;
    const max = p.max !== undefined ? p.max : config.max;
    const step = p.step !== undefined ? p.step : config.step;
    const range = max - min;
    const steps = Math.max(1, Math.floor(range / step));
    return `      ${p.name}: ${min} + Math.floor(Math.random() * ${steps}) * ${step},`;
  }).join('\n');
  
  // Generate the render call based on pattern
  let renderCall;
  if (analysis.pattern === 'new') {
    renderCall = `${analysis.functionName}(ctx, canvas.width, canvas.height, time, params)`;
  } else {
    // Legacy: use the ArtGenerator.generate pattern
    renderCall = `// TODO: Call your generator's render method
        // Example: artGenerator.generate(ctx, params, time)`;
  }
  
  return `"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ${Array.from(usedIcons).join(', ')} } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
${extraImportLine}

// TODO: Import your art generator
// import { yourGenerator } from "@/lib/art/${analysis.importPath}";

export default function ${componentName}Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [params, setParams] = useState(${initialParams});

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      if (isPlaying) {
        time += 16;
        ${renderCall}
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, params]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const width = Math.min(rect.width, 900);
        const height = Math.min(window.innerHeight * 0.65, 650);
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = \`\${width}px\`;
        canvas.style.height = \`\${height}px\`;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const randomize = useCallback(() => {
    setParams({
${randomizeLogic}
    });
  }, []);

  const reset = useCallback(() => {
    setParams(${initialParams});
  }, []);

  const updateParam = useCallback(<K extends ${updateParamType}>(
    key: K,
    value: any
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b ${theme.bg} text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">${title}</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Interactive generative art visualization. Adjust parameters to explore
            different variations of the algorithm.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,340px] gap-8 items-start">
          {/* Canvas Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800/50"
                style={{ boxShadow: \`0 25px 50px -12px ${theme.accent}20\` }}
              >
                <canvas ref={canvasRef} className="block" />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                className="w-12 h-12 rounded-full border-slate-700 hover:bg-slate-800"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="outline"
                onClick={randomize}
                className="rounded-full border-slate-700 hover:bg-slate-800"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Randomize
              </Button>
              <Button
                variant="ghost"
                onClick={reset}
                className="rounded-full text-slate-500 hover:text-slate-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" style={{ color: '${theme.accent}' }} />
              Parameters
            </h2>

${controls}

            {/* Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-2">
              <p>
                This visualization uses mathematical algorithms to generate
                unique patterns. Each parameter affects different aspects of
                the visual output.
              </p>
              <p className="text-slate-600">
                Try randomizing to discover unexpected variations, or fine-tune
                individual parameters for precise control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

function main() {
  const algorithmName = process.argv[2];
  
  if (!algorithmName) {
    console.error('Usage: node art-page-gen.js <algorithm-name>');
    console.error('');
    console.error('Examples:');
    console.error('  node art-page-gen.js flow-field');
    console.error('  node art-page-gen.js particle-network');
    process.exit(1);
  }
  
  const generatorPath = findGeneratorFile(algorithmName);
  
  if (!generatorPath) {
    console.error(`❌ Generator not found for '${algorithmName}'`);
    console.error('');
    console.error('Available algorithms:');
    
    const artDir = path.join(APP_DIR, 'lib/art');
    if (fs.existsSync(artDir)) {
      const files = fs.readdirSync(artDir)
        .filter(f => f.endsWith('.ts'))
        .map(f => f.replace('.ts', ''))
        .slice(0, 20);
      files.forEach(f => console.error(`  - ${f}`));
    }
    process.exit(1);
  }
  
  console.log(`🔧 Analyzing: ${algorithmName}`);
  
  const content = fs.readFileSync(generatorPath, 'utf-8');
  const analysis = analyzeGenerator(content, generatorPath);
  
  if (analysis.pattern === 'unknown') {
    console.error('❌ Could not detect generator pattern');
    console.error('   Expected one of:');
    console.error('   - export interface *Params + export const *DefaultParams');
    console.error('   - ArtGenerator object with params');
    process.exit(1);
  }
  
  console.log(`  Pattern:   ${analysis.pattern}`);
  if (analysis.interfaceName) console.log(`  Interface: ${analysis.interfaceName}`);
  if (analysis.defaultsName) console.log(`  Defaults:  ${analysis.defaultsName}`);
  if (analysis.functionName) console.log(`  Function:  ${analysis.functionName}`);
  console.log(`  Params:    ${analysis.params.length} detected`);
  analysis.params.forEach(p => {
    console.log(`    - ${p.name}: ${p.type} (${p.config.label})`);
  });
  
  const pageContent = generatePage(algorithmName, analysis);
  const pageDir = path.join(APP_DIR, 'app/art', algorithmName);
  const pagePath = path.join(pageDir, 'page.tsx');
  
  // Create directory
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  // Write file
  fs.writeFileSync(pagePath, pageContent);
  
  console.log('');
  console.log(`✅ Created: ${pagePath}`);
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Review and customize the generated controls`);
  console.log(`  2. Update the import statement for your generator`);
  console.log(`  3. Update the render call in the animation loop`);
  console.log(`  4. Add educational content about the algorithm`);
  console.log(`  5. Test: http://localhost:3000/art/${algorithmName}`);
}

main();
