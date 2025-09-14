// src/theme.ts
import { defineConfig, createSystem } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f5faff" },
          100: { value: "#d6e4ff" },
          200: { value: "#adc8ff" },
          300: { value: "#84a9ff" },
          400: { value: "#6690ff" },
          500: { value: "#3366ff" },
          600: { value: "#254eda" },
          700: { value: "#1939b7" },
          800: { value: "#102693" },
          900: { value: "#091a7a" },
        },
      },
      fonts: {
        heading: { value: `"Poppins", sans-serif` },
        body: { value: `"Inter", sans-serif` },
      },
    },
  },
});

export const system = createSystem(config);
