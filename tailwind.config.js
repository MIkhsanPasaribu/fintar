/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Fintar Financial Theme Colors - Updated Palette
        primary: {
          50: "#e6ffff",
          100: "#ccffff",
          200: "#99ffff",
          300: "#66f2f2",
          400: "#33cccc",
          500: "#00a8a8", // Base Turquoise
          600: "#009999",
          700: "#007777", // Dark
          800: "#006666",
          900: "#004d4d",
          950: "#003333",
        },
        secondary: {
          50: "#eaf4ff",
          100: "#d9efff",
          200: "#b3d4ff",
          300: "#80bfff", // Light
          400: "#66aaff",
          500: "#4c9aff", // Base Soft Blue
          600: "#1a80ff",
          700: "#005fcc", // Dark
          800: "#0044cc",
          900: "#003399",
          950: "#001a66",
        },
        accent: {
          50: "#f0fdfa",
          100: "#d2f8d2",
          200: "#a5d6a7",
          300: "#6fd6a6", // Light
          400: "#4dc490",
          500: "#3cb371", // Base Smart Green
          600: "#2e9960",
          700: "#1e7d49", // Dark
          800: "#196540",
          900: "#144d30",
          950: "#0c2b1b",
        },
        neutral: {
          50: "#fafafa", // Light
          100: "#f7f7f8",
          200: "#f4f5f7", // Base Light Grey
          300: "#e6e8ec",
          400: "#d1d5db", // Dark
          500: "#9ca3af",
          600: "#6b7280", // Font Secondary Base
          700: "#4b5563", // Font Secondary Dark
          800: "#374151", // Font Primary Light
          900: "#111827", // Font Primary Base
          950: "#030712",
        },
        font: {
          primary: "#111827", // Charcoal (Base)
          primaryLight: "#374151", // Charcoal Light
          primaryDark: "#000000", // Charcoal Dark
          secondary: "#6B7280", // Muted Gray (Base)
          secondaryLight: "#9CA3AF", // Muted Gray Light
          secondaryDark: "#4B5563", // Muted Gray Dark
        },
        success: "#3CB371", // Smart Green
        error: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "slide-in-up": "slideInUp 0.3s ease-out",
        progress: "progressBar 1s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        slideInUp: {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        progressBar: {
          "0%": {
            width: "0%",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      boxShadow: {
        financial:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "financial-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
