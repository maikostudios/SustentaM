/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Fuentes del design system
      fontFamily: {
        sans: ["Inter", "Roboto", "system-ui", "sans-serif"],
      },

      // Escala de tipografía según directrices
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px - texto base
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px - h3
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px - h2
        "3xl": ["2rem", { lineHeight: "2.5rem" }], // 32px - h1
      },

      colors: {
        // Nueva paleta según directrices del design system
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0A3D62", // Color primario principal
          600: "#083049",
          700: "#062338",
          800: "#041829",
          900: "#020f1a",
          950: "#010a12",
        },

        secondary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#4CAF50", // Verde para éxito/aprobados
          600: "#3d8b40",
          700: "#2e6930",
          800: "#1f4922",
          900: "#123016",
          950: "#0a1a0c",
        },

        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#F57C00", // Naranja para advertencias
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },

        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#D32F2F", // Rojo para errores
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#6b1d1d",
          950: "#450a0a",
        },

        // Fondos y superficies
        background: {
          primary: "#F9FAFB", // Fondo principal claro
          secondary: "#FFFFFF", // Fondo de cards/modales
          tertiary: "#F3F4F6", // Fondo alternativo
        },

        // Textos con jerarquía
        text: {
          primary: "#111827", // Texto principal
          secondary: "#6B7280", // Texto secundario
          muted: "#9CA3AF", // Texto deshabilitado
          inverse: "#FFFFFF", // Texto sobre fondos oscuros
        },

        // Bordes
        border: {
          light: "#E5E7EB",
          DEFAULT: "#D1D5DB",
          dark: "#9CA3AF",
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

      // Espaciado basado en escala de 4px
      spacing: {
        0.5: "0.125rem", // 2px
        1: "0.25rem", // 4px
        2: "0.5rem", // 8px
        3: "0.75rem", // 12px
        4: "1rem", // 16px
        5: "1.25rem", // 20px
        6: "1.5rem", // 24px
        8: "2rem", // 32px
        10: "2.5rem", // 40px
        12: "3rem", // 48px
        16: "4rem", // 64px
        20: "5rem", // 80px
        24: "6rem", // 96px
      },

      // Bordes redondeados de 4px
      borderRadius: {
        none: "0",
        sm: "0.125rem", // 2px
        DEFAULT: "0.25rem", // 4px - estándar
        md: "0.375rem", // 6px
        lg: "0.5rem", // 8px
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
        full: "9999px",
      },

      // Sombras sutiles (niveles 1-3)
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
