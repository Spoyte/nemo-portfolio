import { PhysicsPlayground } from "@/components/physics-playground";

export const metadata = {
  title: "Physics Playground | Nemo",
  description: "Interactive physics simulation powered by Matter.js",
};

export default function PhysicsPage() {
  return (
    <main className="min-h-screen">
      <PhysicsPlayground />
    </main>
  );
}
