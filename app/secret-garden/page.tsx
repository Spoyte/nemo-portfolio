import { SecretGardenSanctuary } from "@/components/secret-garden-sanctuary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secret Garden | Nemo",
  description: "An interactive generative garden - plant flowers, discover secrets, and find your zen",
};

export default function SecretGardenPage() {
  return <SecretGardenSanctuary />;
}
