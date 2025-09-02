/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Paleta oficial SUSTENTA
        sustenta: {
          blue: "#007fd1", // Azul principal
          purple: "#443f9a", // Morado corporativo
          gray: "#f1f2f2", // Gris claro
          "light-blue": "#b7ddff", // Azul claro
          "dark-blue": "#005a9c", // Azul oscuro (derivado)
          "light-purple": "#6b5bb3", // Morado claro (derivado)
        },

        // Colores personalizados para modo oscuro
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      backgroundColor: {
        "dark-primary": "#0f172a",
        "dark-secondary": "#1e293b",
        "dark-tertiary": "#334155",
      },
      textColor: {
        "dark-primary": "#f8fafc",
        "dark-secondary": "#e2e8f0",
        "dark-muted": "#94a3b8",
      },
      borderColor: {
        "dark-border": "#334155",
        "dark-border-light": "#475569",
      },
    },
  },
  plugins: [],
};
