import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          bg: {
            primary: { value: "var(--colors-bg-primary)" },
            secondary: { value: "var(--colors-bg-secondary)" },
            tertiary: { value: "var(--colors-bg-tertiary)" },
          },
          text: {
            primary: { value: "var(--colors-text-primary)" },
            secondary: { value: "var(--colors-text-secondary)" },
            tertiary: { value: "var(--colors-text-tertiary)" },
          },
          border: {
            default: { value: "var(--colors-border-default)" },
          },
          primary: { value: "var(--colors-primary)" },
        },
      },
      tokens: {
        fonts: {
          body: { value: "var(--font-inter), sans-serif" },
          heading: { value: "var(--font-inter), sans-serif" },
        }
      }
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
