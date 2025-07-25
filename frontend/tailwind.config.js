/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Colors
        background: {
          DEFAULT: "#FFFFFF",
          light: "#FAFBFC",
          soft: "#F5F7FA",
          neutral: "#F8F9FA",
        },

        // Border Colors - Fixed
        border: {
          DEFAULT: "#E9ECEF",
          light: "#F8F9FA",
          dark: "#DEE2E6",
        },

        // Primary Colors
        primary: {
          DEFAULT: "#0052CC",
          25: "#F0F7FF",
          50: "#E3F2FD",
          100: "#BBDEFB",
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#42A5F5",
          500: "#0052CC",
          600: "#0066FF",
          700: "#003D82",
          800: "#002855",
          900: "#001733",
        },

        // Secondary Colors
        secondary: {
          DEFAULT: "#4A90E2",
          50: "#E8F4FD",
          100: "#C2E2FA",
          200: "#9DD0F7",
          300: "#77BEF4",
          400: "#52ACF1",
          500: "#4A90E2",
          600: "#2196F3",
          700: "#1976D2",
          800: "#1565C0",
          900: "#0D47A1",
        },

        // Accent Colors
        accent: {
          DEFAULT: "#FFB800",
          25: "#FFFBF0",
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#FFB800",
          600: "#F5A623",
          700: "#FF8F00",
          800: "#FF6F00",
          900: "#E65100",
        },

        // Success Colors
        success: {
          DEFAULT: "#00C853",
          25: "#F0FDF4",
          50: "#E8F5E9",
          100: "#C8E6C9",
          200: "#A5D6A7",
          300: "#81C784",
          400: "#66BB6A",
          500: "#4CAF50",
          600: "#43A047",
          700: "#388E3C",
          800: "#2E7D32",
          900: "#1B5E20",
        },

        // Danger Colors
        danger: {
          DEFAULT: "#D32F2F",
          25: "#FFFBFA",
          50: "#FFEBEE",
          100: "#FFCDD2",
          200: "#EF9A9A",
          300: "#E57373",
          400: "#EF5350",
          500: "#F44336",
          600: "#E53935",
          700: "#D32F2F",
          800: "#C62828",
          900: "#B71C1C",
        },

        // Warning Colors
        warning: {
          DEFAULT: "#FF9800",
          25: "#FFFCF0",
          50: "#FFF3E0",
          100: "#FFE0B2",
          200: "#FFCC80",
          300: "#FFB74D",
          400: "#FFA726",
          500: "#FF9800",
          600: "#FB8C00",
          700: "#F57C00",
          800: "#EF6C00",
          900: "#E65100",
        },

        // Info Colors
        info: {
          DEFAULT: "#2196F3",
          25: "#F0F9FF",
          50: "#E3F2FD",
          100: "#BBDEFB",
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#42A5F5",
          500: "#2196F3",
          600: "#1E88E5",
          700: "#1976D2",
          800: "#1565C0",
          900: "#0D47A1",
        },

        // Neutral Colors
        neutral: {
          DEFAULT: "#78909C",
          25: "#FCFCFD",
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#ADB5BD",
          500: "#6C757D",
          600: "#495057",
          700: "#343A40",
          800: "#212529",
          900: "#000000",
        },

        // Text Colors
        text: {
          primary: "#0A1628",
          secondary: "#1A237E",
          body: "#283593",
          paragraph: "#37474F",
          subtitle: "#455A64",
          description: "#546E7A",
          caption: "#607D8B",
          metadata: "#78909C",
          placeholder: "#90A4AE",
          disabled: "#B0BEC5",
          hint: "#CFD8DC",
          helper: "#ECEFF1",
          financial: "#003D82",
          numbers: "#0052CC",
          positive: "#00C853",
          negative: "#D32F2F",
        },

        // Link Colors
        link: {
          DEFAULT: "#0052CC",
          hover: "#003D82",
          visited: "#4A90E2",
          active: "#FFB800",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      fontSize: {
        display: ["3.75rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        heading: ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        subheading: ["1.5rem", { lineHeight: "1.3" }],
        "body-large": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.5" }],
        caption: ["0.875rem", { lineHeight: "1.4" }],
      },

      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        hover: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
        "glow-accent": "0 0 20px 0 rgba(255, 183, 0, 0.3)",
        "glow-success": "0 0 20px 0 rgba(0, 200, 83, 0.3)",
        "glow-danger": "0 0 20px 0 rgba(211, 47, 47, 0.3)",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
