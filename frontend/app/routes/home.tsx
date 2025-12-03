import type { Route } from "./+types/home";
import Welcome from "../welcome/welcome";
import { motion } from "framer-motion";
import { div } from "framer-motion/client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "petMatch" },
    { name: "petMatch", content: "Welcome to petMatch" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Welcome />
    </div>
  );
}
