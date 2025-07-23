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
        // Fintar Modern Finance Theme - MVP Color Palette
        primary: {
          50: "#E8EBEE",
          100: "#C1C7CC",
          200: "#9AA3AA",
          300: "#737F88",
          400: "#4C5B66",
          500: "#1C1F2B", // Primary Base
          600: "#2A2E3B", // Primary Dark
          700: "#383C4B", // Primary Light
          800: "#14171F",
          900: "#101217",
        },
        secondary: {
          50: "#CCF2F4",
          100: "#B3ECEF",
          200: "#99E5EA",
          300: "#7FDEE5",
          400: "#66D7E0",
          500: "#005F73", // Strong trust teal
          600: "#0A9396", // Soft supportive teal
          700: "#94D2BD", // Pastel companion
          800: "#004D5C",
          900: "#003A45",
        },
        accent: {
          50: "#FEF5E7",
          100: "#FDE2B3",
          200: "#FCCE7F",
          300: "#FBBA4B",
          400: "#FAA617",
          500: "#EE9B00", // Action accent (CTA buttons)
          600: "#CA6702", // Hover/press accent
          700: "#BB3E03", // Warning/danger
          800: "#A65100",
          900: "#8A4300",
        },
        neutral: {
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#ADB5BD",
          500: "#212121", // Background dark
          600: "#1A1A1A", // Modal/surface
          700: "#121212", // Header/sidebar
          800: "#0D0D0D",
          900: "#080808",
        },
        // Font Colors
        "font-primary": "#FFFFFF", // Main white text
        "font-light": "#FFFFFF", // Main white text
        "font-secondary": "#E0E0E0", // Secondary text
        "font-muted": "#BDBDBD", // Tertiary/muted text

        // Background Colors
        "bg-dark": "#212121",
        "bg-main": "#1A1A1A",
        "bg-darker": "#121212",

        // UI Element Colors - Updated for New Palette
        button: {
          primary: {
            bg: "#EE9B00",
            text: "#1C1F2B",
            hover: "#CA6702",
            disabled: "#383C4B",
          },
          secondary: {
            bg: "#005F73",
            text: "#FFFFFF",
            hover: "#0A9396",
            disabled: "#383C4B",
          },
          accent: {
            bg: "#EE9B00",
            text: "#1C1F2B",
            hover: "#CA6702",
          },
          ghost: {
            bg: "transparent",
            text: "#FFFFFF",
            hover: "#2A2E3B",
          },
          outline: {
            border: "#EE9B00",
            bg: "#1A1A1A",
            text: "#EE9B00",
            hoverBg: "#2A2E3B",
          },
        },
        card: {
          default: {
            bg: "#2A2E3B",
            border: "#383C4B",
            text: "#FFFFFF",
          },
          highlight: {
            bg: "#2A2E3B",
            border: "#EE9B00",
            text: "#FFFFFF",
          },
          info: {
            bg: "#1C1F2B",
            border: "#005F73",
            text: "#FFFFFF",
          },
        },
        nav: {
          bg: "#121212",
          text: "#FFFFFF",
          hover: "#EE9B00",
        },
        footer: {
          bg: "#121212",
          text: "#E0E0E0",
          hover: "#EE9B00",
        },
        modal: {
          bg: "#1A1A1A",
          border: "#383C4B",
          text: "#FFFFFF",
        },
        tooltip: {
          bg: "#2A2E3B",
          border: "#EE9B00",
          text: "#FFFFFF",
        },
        input: {
          bg: "#212121",
          border: "#383C4B",
          placeholder: "#BDBDBD",
          text: "#FFFFFF",
          focus: {
            border: "#EE9B00",
            ring: "#EE9B00",
          },
          error: {
            border: "#BB3E03",
            ring: "#BB3E03",
            text: "#FFBABA",
            placeholder: "#E4AFAF",
          },
        },
        badge: {
          active: {
            bg: "#117A65",
            border: "#1ABC9C",
            text: "#FFFFFF",
          },
          info: {
            bg: "#2C3E50",
            border: "#4B6EF5",
            text: "#F0F0F0",
          },
          warning: {
            bg: "#5E4C25",
            border: "#F39C12",
            text: "#F4B942",
          },
          error: {
            bg: "#3A1E1E",
            border: "#E74C3C",
            text: "#E74C3C",
          },
        },
        error: "#E74C3C",
        warning: "#F39C12",
        success: "#16A085",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "slide-in-up": "slideInUp 0.6s ease-out",
        "slide-in-down": "slideInDown 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "fade-in": "fadeIn 0.8s ease-out",
        "fade-in-scale": "fadeInScale 0.7s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        gradient: "gradient 6s ease infinite",
        progress: "progressBar 1s ease-out",
        shimmer: "shimmer 2s infinite",
        typing:
          "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "scale-in": "scaleIn 0.5s ease-out",
        "rotate-in": "rotateIn 0.6s ease-out",
        "flip-in": "flipIn 0.8s ease-out",
        "zoom-fade": "zoomFade 0.6s ease-out",
        "slide-fade": "slideFade 0.7s ease-out",
        "bounce-in": "bounceIn 0.8s ease-out",
        elastic: "elastic 0.8s ease-out",
        wobble: "wobble 0.8s ease-out",
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
        "neon-pulse": "neonPulse 2s ease-in-out infinite",
        "text-glow": "textGlow 2s ease-in-out infinite",
      },
      keyframes: {
        slideInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceGentle: {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0, -15px, 0)" },
          "70%": { transform: "translate3d(0, -7px, 0)" },
          "90%": { transform: "translate3d(0, -2px, 0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        progressBar: {
          "0%": { width: "0%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        "blink-caret": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#16A085" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(22, 160, 133, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(22, 160, 133, 0.8)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        rotateIn: {
          "0%": { transform: "rotate(-180deg) scale(0)", opacity: "0" },
          "100%": { transform: "rotate(0deg) scale(1)", opacity: "1" },
        },
        flipIn: {
          "0%": { transform: "rotateY(-90deg)", opacity: "0" },
          "100%": { transform: "rotateY(0deg)", opacity: "1" },
        },
        zoomFade: {
          "0%": { transform: "scale(1.1)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideFade: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
          "70%": { transform: "scale(0.9)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        elastic: {
          "0%": { transform: "scale(0)" },
          "55%": { transform: "scale(1.1)" },
          "75%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        wobble: {
          "0%": { transform: "translateX(0%)" },
          "15%": { transform: "translateX(-25%) rotate(-5deg)" },
          "30%": { transform: "translateX(20%) rotate(3deg)" },
          "45%": { transform: "translateX(-15%) rotate(-3deg)" },
          "60%": { transform: "translateX(10%) rotate(2deg)" },
          "75%": { transform: "translateX(-5%) rotate(-1deg)" },
          "100%": { transform: "translateX(0%)" },
        },
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.3)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.3)" },
          "70%": { transform: "scale(1)" },
        },
        neonPulse: {
          "0%, 100%": {
            textShadow: "0 0 5px #16A085, 0 0 10px #16A085, 0 0 15px #16A085",
          },
          "50%": {
            textShadow: "0 0 10px #1ABC9C, 0 0 20px #1ABC9C, 0 0 30px #1ABC9C",
          },
        },
        textGlow: {
          "0%, 100%": {
            textShadow: "0 0 2px rgba(22, 160, 133, 0.5)",
          },
          "50%": {
            textShadow:
              "0 0 8px rgba(26, 188, 156, 0.8), 0 0 12px rgba(26, 188, 156, 0.6)",
          },
        },
      },
      boxShadow: {
        financial:
          "0 4px 6px -1px rgba(22, 160, 133, 0.1), 0 2px 4px -1px rgba(22, 160, 133, 0.06)",
        "financial-hover":
          "0 10px 25px -3px rgba(22, 160, 133, 0.15), 0 8px 10px -2px rgba(22, 160, 133, 0.08)",
        "financial-glow":
          "0 0 20px rgba(22, 160, 133, 0.3), 0 0 40px rgba(22, 160, 133, 0.15)",
        "primary-glow":
          "0 0 20px rgba(26, 188, 156, 0.4), 0 0 40px rgba(26, 188, 156, 0.2)",
        "accent-glow":
          "0 0 20px rgba(243, 156, 18, 0.3), 0 0 40px rgba(243, 156, 18, 0.15)",
        "secondary-glow":
          "0 0 20px rgba(52, 73, 94, 0.3), 0 0 40px rgba(52, 73, 94, 0.15)",
        "dark-card":
          "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        "dark-hover":
          "0 10px 25px -3px rgba(0, 0, 0, 0.4), 0 8px 10px -2px rgba(0, 0, 0, 0.3)",
        "inner-dark": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
        "neon-primary":
          "0 0 10px rgba(22, 160, 133, 0.5), 0 0 20px rgba(22, 160, 133, 0.3)",
        "neon-accent":
          "0 0 10px rgba(243, 156, 18, 0.5), 0 0 20px rgba(243, 156, 18, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
