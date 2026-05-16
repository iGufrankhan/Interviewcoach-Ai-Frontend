'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function StarBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1
      }}
      options={{
        background: {
          color: "#000"
        },
        particles: {
          number: { value: 100 },
          color: { value: "#ff2a2a" },
          size: { value: { min: 1, max: 2 } },
          move: { enable: true, speed: 1},
          opacity: { value: 0.5 },
          links: { enable: false }
        }
      }}
    />
  );
}