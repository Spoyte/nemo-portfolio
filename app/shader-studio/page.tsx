import { ShaderStudio } from "@/components/shader-studio";

export const metadata = {
  title: "Shader Studio | Nemo",
  description: "Real-time WebGL fragment shader editor",
};

export default function ShaderPage() {
  return (
    <main className="min-h-screen">
      <ShaderStudio />
    </main>
  );
}
