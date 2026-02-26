import { ArtGenerator, fillCanvas, hslToRgb } from "./core";

// Wavelength to RGB conversion for visible spectrum (380-750nm)
function wavelengthToRgb(wavelength: number): { r: number; g: number; b: number } {
  let r = 0, g = 0, b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity correction for edges of visibility
  let intensity = 1;
  if (wavelength >= 380 && wavelength < 420) {
    intensity = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 700 && wavelength <= 750) {
    intensity = 0.3 + 0.7 * (750 - wavelength) / (750 - 700);
  }

  return {
    r: Math.round(r * intensity * 255),
    g: Math.round(g * intensity * 255),
    b: Math.round(b * intensity * 255),
  };
}

// Cauchy's dispersion equation: n(λ) = n0 + A/λ²
function refractiveIndex(wavelength: number, baseIndex: number, dispersionStrength: number): number {
  // Convert wavelength from nm to μm for the formula
  const lambdaUm = wavelength / 1000;
  return baseIndex + dispersionStrength / (lambdaUm * lambdaUm);
}

// Snell's law: n1 * sin(θ1) = n2 * sin(θ2)
function snellLaw(n1: number, theta1: number, n2: number): number {
  const sinTheta2 = (n1 / n2) * Math.sin(theta1);
  // Total internal reflection check
  if (Math.abs(sinTheta2) > 1) return NaN;
  return Math.asin(sinTheta2);
}

export const prismDispersion: ArtGenerator = {
  name: "Prism Dispersion",
  description: "Physics simulation of white light splitting into spectral colors through a glass prism",
  params: {
    prismApexAngle: {
      name: "Prism Apex Angle",
      type: "range",
      min: 30,
      max: 90,
      step: 5,
      default: 60,
    },
    incidentAngle: {
      name: "Incident Angle",
      type: "range",
      min: -30,
      max: 30,
      step: 5,
      default: 15,
    },
    baseRefractiveIndex: {
      name: "Glass Type (Refractive Index)",
      type: "range",
      min: 1.3,
      max: 2.0,
      step: 0.1,
      default: 1.5,
    },
    dispersionStrength: {
      name: "Dispersion Strength",
      type: "range",
      min: 0.001,
      max: 0.02,
      step: 0.001,
      default: 0.008,
    },
    beamWidth: {
      name: "Beam Width",
      type: "range",
      min: 5,
      max: 40,
      step: 5,
      default: 15,
    },
    showIndividualRays: {
      name: "Show Individual Rays",
      type: "select",
      options: ["yes", "no"],
      default: "yes",
    },
    showSpectrum: {
      name: "Show Full Spectrum",
      type: "select",
      options: ["yes", "no"],
      default: "yes",
    },
    glowIntensity: {
      name: "Glow Intensity",
      type: "range",
      min: 0,
      max: 30,
      step: 5,
      default: 15,
    },
    sweepSpeed: {
      name: "Sweep Speed",
      type: "range",
      min: 0,
      max: 2,
      step: 0.25,
      default: 0.5,
    },
  },
  generate: (ctx, params, time = 0) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    const {
      prismApexAngle,
      incidentAngle,
      baseRefractiveIndex,
      dispersionStrength,
      beamWidth,
      showIndividualRays,
      showSpectrum,
      glowIntensity,
      sweepSpeed,
    } = params;

    // Dark background with subtle gradient
    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
    bgGradient.addColorStop(0, "#0a0a15");
    bgGradient.addColorStop(1, "#000000");
    fillCanvas(ctx, bgGradient as unknown as string, width, height);

    // Add subtle starfield effect
    ctx.save();
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % width;
      const y = (i * 89) % height;
      const starSize = (i % 3) + 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + (i % 5) * 0.05})`;
      ctx.beginPath();
      ctx.arc(x, y, starSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Prism dimensions and position
    const prismSize = Math.min(width, height) * 0.25;
    const prismCenterX = width * 0.5;
    const prismCenterY = height * 0.55;
    const apexAngleRad = (prismApexAngle as number) * Math.PI / 180;

    // Calculate prism vertices (equilateral triangle with adjustable apex)
    const prismHeight = prismSize * Math.cos(apexAngleRad / 2);
    const prismHalfBase = prismSize * Math.sin(apexAngleRad / 2);

    const apexX = prismCenterX;
    const apexY = prismCenterY - prismHeight / 2;
    const baseLeftX = prismCenterX - prismHalfBase;
    const baseLeftY = prismCenterY + prismHeight / 2;
    const baseRightX = prismCenterX + prismHalfBase;
    const baseRightY = prismCenterY + prismHeight / 2;

    // Animated incident angle sweep
    const sweep = Math.sin(time * 0.001 * (sweepSpeed as number) * 2) * 10;
    const currentIncidentAngle = (incidentAngle as number) + sweep;
    const incidentAngleRad = currentIncidentAngle * Math.PI / 180;

    // Light source position
    const lightSourceDistance = prismSize * 1.5;
    const lightSourceX = apexX - lightSourceDistance * Math.cos(incidentAngleRad);
    const lightSourceY = apexY + lightSourceDistance * Math.sin(incidentAngleRad);

    // Entry point on left face of prism
    const entryX = apexX + (baseLeftX - apexX) * 0.5;
    const entryY = apexY + (baseLeftY - apexY) * 0.5;

    // Calculate entry face normal (perpendicular to left face, pointing outward)
    const leftFaceAngle = Math.atan2(baseLeftY - apexY, baseLeftX - apexX);
    const entryNormalAngle = leftFaceAngle - Math.PI / 2;

    // Incident ray direction
    const incidentRayAngle = Math.atan2(entryY - lightSourceY, entryX - lightSourceX);

    // Angle of incidence (angle between ray and normal)
    const angleOfIncidence = incidentRayAngle - entryNormalAngle;

    // Wavelength range for visible spectrum
    const minWavelength = 380;
    const maxWavelength = 750;
    const wavelengthStep = 10;
    const wavelengths: number[] = [];
    for (let w = minWavelength; w <= maxWavelength; w += wavelengthStep) {
      wavelengths.push(w);
    }

    // Calculate ray paths for each wavelength
    interface RayPath {
      wavelength: number;
      color: { r: number; g: number; b: number };
      entryAngle: number;
      internalAngle: number;
      exitAngle: number;
      exitX: number;
      exitY: number;
      finalAngle: number;
    }

    const rayPaths: RayPath[] = [];

    for (const wavelength of wavelengths) {
      const nAir = 1.0;
      const nGlass = refractiveIndex(wavelength, baseRefractiveIndex as number, dispersionStrength as number);
      const color = wavelengthToRgb(wavelength);

      // Apply Snell's law at entry (air -> glass)
      const internalAngle = snellLaw(nAir, angleOfIncidence, nGlass);
      if (isNaN(internalAngle)) continue;

      // Internal ray direction
      const internalRayAngle = entryNormalAngle + internalAngle;

      // Trace to exit face (right side of prism)
      // Parametric line intersection with right face
      const rightFaceAngle = Math.atan2(baseRightY - apexY, baseRightX - apexX);
      const exitNormalAngle = rightFaceAngle + Math.PI / 2;

      // Calculate intersection with right face
      const dx = Math.cos(internalRayAngle);
      const dy = Math.sin(internalRayAngle);

      // Line intersection: entry point + t * direction = point on right face
      // Right face: apex + s * (baseRight - apex)
      const rx = baseRightX - apexX;
      const ry = baseRightY - apexY;

      const denom = dx * ry - dy * rx;
      if (Math.abs(denom) < 0.001) continue;

      const t = ((apexX - entryX) * ry - (apexY - entryY) * rx) / denom;
      const s = ((apexX - entryX) * dy - (apexY - entryY) * dx) / denom;

      if (t < 0 || s < 0 || s > 1) continue;

      const exitX = entryX + t * dx;
      const exitY = entryY + t * dy;

      // Angle of incidence at exit face (relative to exit normal)
      const angleAtExit = internalRayAngle - exitNormalAngle;

      // Apply Snell's law at exit (glass -> air)
      const exitAngle = snellLaw(nGlass, angleAtExit, nAir);
      if (isNaN(exitAngle)) continue;

      const finalAngle = exitNormalAngle + exitAngle;

      rayPaths.push({
        wavelength,
        color,
        entryAngle: internalAngle,
        internalAngle: internalRayAngle,
        exitAngle,
        exitX,
        exitY,
        finalAngle,
      });
    }

    // Draw glow effect for light beam
    if ((glowIntensity as number) > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.3;

      const glowGradient = ctx.createRadialGradient(
        lightSourceX, lightSourceY, 0,
        lightSourceX, lightSourceY, beamWidth as number * 3
      );
      glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      glowGradient.addColorStop(0.5, "rgba(200, 220, 255, 0.3)");
      glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(lightSourceX, lightSourceY, (beamWidth as number) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw white incident ray
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = beamWidth as number;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lightSourceX, lightSourceY);
    ctx.lineTo(entryX, entryY);
    ctx.stroke();

    // Incident ray glow
    if ((glowIntensity as number) > 0) {
      ctx.globalCompositeOperation = "screen";
      ctx.strokeStyle = `rgba(255, 255, 255, ${(glowIntensity as number) / 100})`;
      ctx.lineWidth = (beamWidth as number) * 2;
      ctx.beginPath();
      ctx.moveTo(lightSourceX, lightSourceY);
      ctx.lineTo(entryX, entryY);
      ctx.stroke();
    }
    ctx.restore();

    // Draw individual color rays
    if (showIndividualRays === "yes") {
      ctx.save();
      for (const ray of rayPaths) {
        const rayLength = Math.max(width, height) * 0.8;
        const endX = ray.exitX + Math.cos(ray.finalAngle) * rayLength;
        const endY = ray.exitY + Math.sin(ray.finalAngle) * rayLength;

        ctx.strokeStyle = `rgb(${ray.color.r}, ${ray.color.g}, ${ray.color.b})`;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(ray.exitX, ray.exitY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Ray glow
        if ((glowIntensity as number) > 0) {
          ctx.globalCompositeOperation = "screen";
          ctx.globalAlpha = (glowIntensity as number) / 200;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(ray.exitX, ray.exitY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 0.6;
        }
      }
      ctx.restore();
    }

    // Draw full spectrum gradient
    if (showSpectrum === "yes" && rayPaths.length > 1) {
      ctx.save();

      // Create spectrum polygon
      const spectrumLength = Math.max(width, height) * 0.6;
      const spectrumWidth = beamWidth as number * 2;

      // Build gradient from all wavelengths
      const gradient = ctx.createLinearGradient(
        rayPaths[0].exitX, rayPaths[0].exitY,
        rayPaths[rayPaths.length - 1].exitX + Math.cos(rayPaths[rayPaths.length - 1].finalAngle) * spectrumLength,
        rayPaths[rayPaths.length - 1].exitY + Math.sin(rayPaths[rayPaths.length - 1].finalAngle) * spectrumLength
      );

      for (let i = 0; i < rayPaths.length; i++) {
        const ray = rayPaths[i];
        const stop = i / (rayPaths.length - 1);
        gradient.addColorStop(stop, `rgb(${ray.color.r}, ${ray.color.g}, ${ray.color.b})`);
      }

      // Draw spectrum as a fan of rays
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.7;

      for (let i = 0; i < rayPaths.length - 1; i++) {
        const ray1 = rayPaths[i];
        const ray2 = rayPaths[i + 1];

        const len = spectrumLength;
        const x1 = ray1.exitX + Math.cos(ray1.finalAngle) * len;
        const y1 = ray1.exitY + Math.sin(ray1.finalAngle) * len;
        const x2 = ray2.exitX + Math.cos(ray2.finalAngle) * len;
        const y2 = ray2.exitY + Math.sin(ray2.finalAngle) * len;

        ctx.fillStyle = `rgb(${ray1.color.r}, ${ray1.color.g}, ${ray1.color.b})`;
        ctx.beginPath();
        ctx.moveTo(ray1.exitX, ray1.exitY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(ray2.exitX, ray2.exitY);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    // Draw prism
    ctx.save();

    // Glass body
    ctx.fillStyle = "rgba(200, 220, 255, 0.08)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(baseLeftX, baseLeftY);
    ctx.lineTo(baseRightX, baseRightY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal reflection highlight
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(prismCenterX, prismCenterY + prismHeight / 4);
    ctx.stroke();

    // Glass highlights
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(apexX + 5, apexY + 10);
    ctx.lineTo(baseLeftX + (prismCenterX - baseLeftX) * 0.3, baseLeftY - 10);
    ctx.stroke();

    ctx.restore();

    // Draw light source
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(lightSourceX, lightSourceY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Source glow
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(lightSourceX, lightSourceY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw wavelength labels (optional, for educational value)
    if (rayPaths.length > 5) {
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";

      // Label red and violet ends
      const redRay = rayPaths[rayPaths.length - 5];
      const violetRay = rayPaths[4];

      const labelOffset = 60;
      ctx.fillText(
        "Red",
        redRay.exitX + Math.cos(redRay.finalAngle) * labelOffset,
        redRay.exitY + Math.sin(redRay.finalAngle) * labelOffset
      );
      ctx.fillText(
        "Violet",
        violetRay.exitX + Math.cos(violetRay.finalAngle) * labelOffset,
        violetRay.exitY + Math.sin(violetRay.finalAngle) * labelOffset
      );
      ctx.restore();
    }
  },
};

// Export individual functions for advanced usage
export function renderPrismDispersion(
  ctx: CanvasRenderingContext2D,
  params: {
    prismApexAngle?: number;
    incidentAngle?: number;
    baseRefractiveIndex?: number;
    dispersionStrength?: number;
    beamWidth?: number;
    showIndividualRays?: boolean;
    showSpectrum?: boolean;
    glowIntensity?: number;
    sweepSpeed?: number;
  },
  time?: number
): void {
  const defaultParams = {
    prismApexAngle: 60,
    incidentAngle: 15,
    baseRefractiveIndex: 1.5,
    dispersionStrength: 0.008,
    beamWidth: 15,
    showIndividualRays: true,
    showSpectrum: true,
    glowIntensity: 15,
    sweepSpeed: 0.5,
  };

  prismDispersion.generate(ctx, { ...defaultParams, ...params }, time);
}

export const prismDispersionDefaultParams = {
  prismApexAngle: 60,
  incidentAngle: 15,
  baseRefractiveIndex: 1.5,
  dispersionStrength: 0.008,
  beamWidth: 15,
  showIndividualRays: "yes",
  showSpectrum: "yes",
  glowIntensity: 15,
  sweepSpeed: 0.5,
};

export type PrismDispersionParams = typeof prismDispersionDefaultParams;
