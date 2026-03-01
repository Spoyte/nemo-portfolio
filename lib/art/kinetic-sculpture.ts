import { ArtGenerator, ParamConfig } from "./core";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  char: string;
  color: string;
  size: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  life: number;
  maxLife: number;
}

interface Camera {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
}

export const kineticSculpture: ArtGenerator = {
  name: "Kinetic Sculpture",
  description: "Interactive 3D text sculpture — words float in space, responding to your touch, forming ephemeral poetry structures",
  params: {
    text: {
      name: "Text Source",
      type: "select",
      options: ["haiku", "code", "chaos", "dreams", "cosmos", "silence"],
      default: "haiku",
    },
    formation: {
      name: "Formation",
      type: "select",
      options: ["sphere", "helix", "cloud", "wave", "spiral", "random"],
      default: "helix",
    },
    particleCount: {
      name: "Particle Count",
      type: "range",
      min: 50,
      max: 400,
      step: 50,
      default: 200,
    },
    rotationSpeed: {
      name: "Rotation Speed",
      type: "range",
      min: 0,
      max: 2,
      step: 0.1,
      default: 0.5,
    },
    colorScheme: {
      name: "Color Scheme",
      type: "select",
      options: ["neon", "gold", "ocean", "fire", "monochrome", "rainbow"],
      default: "neon",
    },
    interactionRadius: {
      name: "Interaction Radius",
      type: "range",
      min: 50,
      max: 300,
      step: 25,
      default: 150,
    },
    turbulence: {
      name: "Turbulence",
      type: "range",
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.3,
    },
  },

  meta: {
    category: "interactive",
    complexity: "complex",
    tags: ["animated", "colorful", "futuristic", "interactive"],
    created: "2026-03-01",
  },

  generate: (ctx, params, time = 0) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const textSource = params.text as string;
    const formation = params.formation as string;
    const particleCount = params.particleCount as number;
    const rotationSpeed = params.rotationSpeed as number;
    const colorScheme = params.colorScheme as string;
    const interactionRadius = params.interactionRadius as number;
    const turbulence = params.turbulence as number;

    // Text banks for different themes
    const textBanks: Record<string, string> = {
      haiku: "old silent pond frog jumps into water splash silence again autumn moonlight worm digs silently into the chestnut",
      code: "function dream() { return infinity; } const soul = await universe.listen(); if (beauty) { create(art); }",
      chaos: "entropy butterfly storm edge fractal spiral turbulence cascade dissolve emerge transform",
      dreams: "sleep drift float wander imagine create remember forget whisper shadow light",
      cosmos: "star nebula galaxy void lightyear gravity orbit stellar cosmic infinite eternal",
      silence: "... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...",
    };

    const text = textBanks[textSource] || textBanks.haiku;
    const chars = text.split("").filter((c) => c !== " ");

    // Color schemes
    const colorSchemes: Record<string, string[]> = {
      neon: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00"],
      gold: ["#ffd700", "#ffb700", "#ff8c00", "#daa520", "#b8860b"],
      ocean: ["#0066cc", "#0099ff", "#00ccff", "#66e0ff", "#004080"],
      fire: ["#ff4500", "#ff6b35", "#ff8c00", "#ffd700", "#ff1493"],
      monochrome: ["#ffffff", "#cccccc", "#999999", "#666666", "#333333"],
      rainbow: ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#8b00ff"],
    };

    const colors = colorSchemes[colorScheme] || colorSchemes.neon;

    // Initialize particles on first frame
    if (!(ctx.canvas as unknown as { _particles?: Particle[] })._particles) {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const char = chars[i % chars.length];
        const color = colors[i % colors.length];
        
        let x = 0, y = 0, z = 0;
        const t = (i / particleCount) * Math.PI * 2;
        const r = 100 + Math.random() * 100;

        switch (formation) {
          case "sphere":
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            x = r * Math.cos(theta) * Math.sin(phi);
            y = r * Math.sin(theta) * Math.sin(phi);
            z = r * Math.cos(phi);
            break;
          case "helix":
            x = r * Math.cos(t * 3);
            y = (i - particleCount / 2) * 0.8;
            z = r * Math.sin(t * 3);
            break;
          case "cloud":
            x = (Math.random() - 0.5) * 300;
            y = (Math.random() - 0.5) * 300;
            z = (Math.random() - 0.5) * 300;
            break;
          case "wave":
            x = (i - particleCount / 2) * 1.5;
            y = Math.sin(t * 4) * 80;
            z = Math.cos(t * 2) * 50;
            break;
          case "spiral":
            const spiralR = (i / particleCount) * 200;
            x = spiralR * Math.cos(t * 8);
            y = (i - particleCount / 2) * 0.5;
            z = spiralR * Math.sin(t * 8);
            break;
          default:
            x = (Math.random() - 0.5) * 250;
            y = (Math.random() - 0.5) * 250;
            z = (Math.random() - 0.5) * 250;
        }

        particles.push({
          x, y, z,
          vx: 0, vy: 0, vz: 0,
          char,
          color,
          size: 12 + Math.random() * 16,
          targetX: x,
          targetY: y,
          targetZ: z,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 100,
        });
      }
      (ctx.canvas as unknown as { _particles: Particle[] })._particles = particles;
      (ctx.canvas as unknown as { _camera?: Camera })._camera = {
        x: 0, y: 0, z: 400,
        rotX: 0.3,
        rotY: time * rotationSpeed * 0.01,
      };
    }

    const particles = (ctx.canvas as unknown as { _particles: Particle[] })._particles;
    let camera = (ctx.canvas as unknown as { _camera: Camera })._camera;

    // Update camera rotation
    camera.rotY += rotationSpeed * 0.01;

    // Clear with fade effect
    ctx.fillStyle = "rgba(10, 10, 20, 0.3)";
    ctx.fillRect(0, 0, width, height);

    // Simulate mouse interaction (in real app, this would come from mouse events)
    // Using time-based "virtual mouse" for animation
    const mouseX = centerX + Math.sin(time * 0.001) * 200;
    const mouseY = centerY + Math.cos(time * 0.0013) * 150;

    // Update particles
    particles.forEach((p, i) => {
      // Age the particle
      p.life++;
      if (p.life > p.maxLife) {
        p.life = 0;
        p.char = chars[Math.floor(Math.random() * chars.length)];
        p.color = colors[Math.floor(Math.random() * colors.length)];
      }

      // Turbulence
      p.vx += (Math.random() - 0.5) * turbulence;
      p.vy += (Math.random() - 0.5) * turbulence;
      p.vz += (Math.random() - 0.5) * turbulence;

      // Return to formation force
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dz = p.targetZ - p.z;
      p.vx += dx * 0.001;
      p.vy += dy * 0.001;
      p.vz += dz * 0.001;

      // Mouse interaction (repulsion)
      const screenPos = project3D(p.x, p.y, p.z, camera, centerX, centerY);
      const distMouse = Math.hypot(screenPos.x - mouseX, screenPos.y - mouseY);
      if (distMouse < interactionRadius) {
        const force = (1 - distMouse / interactionRadius) * 2;
        p.vx += (screenPos.x - mouseX) * force * 0.01;
        p.vy += (screenPos.y - mouseY) * force * 0.01;
        p.vz += force * 10;
      }

      // Apply velocity with damping
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.vz *= 0.95;
    });

    // Sort by Z for proper depth rendering
    const sortedParticles = [...particles].sort((a, b) => {
      const projA = project3D(a.x, a.y, a.z, camera, centerX, centerY);
      const projB = project3D(b.x, b.y, b.z, camera, centerX, centerY);
      return projB.z - projA.z;
    });

    // Render particles
    sortedParticles.forEach((p) => {
      const proj = project3D(p.x, p.y, p.z, camera, centerX, centerY);
      
      // Skip if behind camera
      if (proj.z <= 0) return;

      const scale = 400 / (400 + proj.z);
      const alpha = Math.max(0.1, Math.min(1, scale));
      const size = p.size * scale;

      // Glow effect
      ctx.shadowBlur = 15 * scale;
      ctx.shadowColor = p.color;
      
      ctx.font = `${Math.floor(size)}px monospace`;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.sin((p.life / p.maxLife) * Math.PI));
      ctx.fillText(p.char, proj.x, proj.y);
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    });

    // Draw connection lines between nearby particles
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < Math.min(particles.length, 50); i++) {
      const p1 = particles[i];
      const proj1 = project3D(p1.x, p1.y, p1.z, camera, centerX, centerY);
      
      if (proj1.z <= 0) continue;

      for (let j = i + 1; j < Math.min(particles.length, 50); j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 80) {
          const proj2 = project3D(p2.x, p2.y, p2.z, camera, centerX, centerY);
          if (proj2.z <= 0) continue;

          const scale1 = 400 / (400 + proj1.z);
          const scale2 = 400 / (400 + proj2.z);
          const alpha = (1 - dist / 80) * 0.3 * Math.min(scale1, scale2);

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(proj1.x, proj1.y);
          ctx.lineTo(proj2.x, proj2.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Draw interaction cursor
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, interactionRadius, 0, Math.PI * 2);
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    ctx.stroke();
    ctx.globalAlpha = 1;
  },
};

// 3D projection function
function project3D(
  x: number,
  y: number,
  z: number,
  camera: Camera,
  centerX: number,
  centerY: number
): { x: number; y: number; z: number } {
  // Rotate around Y axis
  const cosY = Math.cos(camera.rotY);
  const sinY = Math.sin(camera.rotY);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;

  // Rotate around X axis
  const cosX = Math.cos(camera.rotX);
  const sinX = Math.sin(camera.rotX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  // Translate by camera position
  const x3 = x1 - camera.x;
  const y3 = y2 - camera.y;
  const z3 = z2 - camera.z;

  // Project to 2D
  const distance = 400;
  const scale = distance / (distance + z3);

  return {
    x: centerX + x3 * scale,
    y: centerY + y3 * scale,
    z: z3,
  };
}

export function renderKineticSculpture(
  ctx: CanvasRenderingContext2D,
  params: Record<string, unknown>,
  time?: number
): void {
  kineticSculpture.generate(ctx, params, time);
}
