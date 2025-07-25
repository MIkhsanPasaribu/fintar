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
        // Modern Finance Theme - Cream, Teal Blue, Gold & Black
        // Primary Colors - Cream Backgrounds
        primary: {
          50: "#FCF8DD", // main cream background
          100: "#F9F2C7", // medium cream
          200: "#F6EBB1", // deep cream
          300: "#F5E6D3", // light tan
          400: "#E8D5C4", // warm gray
          500: "#D4C5B9", // taupe
          600: "#C8B8A6", // mushroom
          700: "#A0522D", // sienna brown
          800: "#8B4513", // saddle brown
          900: "#704214", // darker brown
        },

        // Secondary Colors - Teal Blues
        secondary: {
          50: "#E6F7FB", // lightest teal
          100: "#CCF2F8", // very light teal
          200: "#7EC8E3", // sky teal
          300: "#4FA3B8", // light teal
          400: "#00809D", // primary teal blue
          500: "#006B84", // deep teal
          600: "#005A70", // darker teal
          700: "#00485C", // deepest teal
          800: "#003648", // navy teal
          900: "#002934", // darkest teal
        },

        // Accent Colors - Gold & Orange
        accent: {
          50: "#FFFEF7", // lightest gold
          100: "#FFFCEB", // very light gold
          200: "#FEF3C7", // light gold
          300: "#FDE68A", // medium light gold
          400: "#FFD700", // bright gold (primary CTA)
          500: "#D3AF37", // antique gold
          600: "#FFA500", // orange gold
          700: "#FF8C00", // dark orange
          800: "#E67E00", // darker orange
          900: "#CC7000", // darkest orange
        },

        // Supporting Colors - Greens & Browns
        supporting: {
          50: "#F0FDF4", // lightest green
          100: "#DCFCE7", // very light green
          200: "#BBF7D0", // light green
          300: "#86EFAC", // medium green
          400: "#2E8B57", // sea green (success)
          500: "#3CB371", // medium sea green
          600: "#22C55E", // success green
          700: "#16A34A", // darker green
          800: "#15803D", // deep green
          900: "#14532D", // darkest green
        },

        // Alert Colors
        danger: {
          50: "#FEF2F2", // lightest red
          100: "#FEE2E2", // very light red
          200: "#FECACA", // light red
          300: "#FCA5A5", // medium red
          400: "#DC143C", // crimson (danger)
          500: "#FF6347", // tomato (warning)
          600: "#DC2626", // red 600
          700: "#B91C1C", // darker red
          800: "#991B1B", // deep red
          900: "#7F1D1D", // darkest red
        },

        // Success Colors
        success: {
          50: "#F0FDF4", // lightest green
          100: "#E8F5E9", // very light green (card bg)
          200: "#DCFCE7", // light green
          300: "#32CD32", // lime green (success)
          400: "#2E8B57", // sea green (main success)
          500: "#16A34A", // success 500
          600: "#15803D", // success 600
          700: "#14532D", // success 700
          800: "#166534", // darker green
          900: "#14532D", // darkest green
        },

        // Info Colors
        info: {
          50: "#EFF6FF", // lightest blue
          100: "#DBEAFE", // very light blue
          200: "#BFDBFE", // light blue
          300: "#7EC8E3", // sky teal (info bg)
          400: "#4169E1", // royal blue (info)
          500: "#3B82F6", // blue 500
          600: "#2563EB", // blue 600
          700: "#1D4ED8", // blue 700
          800: "#1E40AF", // darker blue
          900: "#1E3A8A", // darkest blue
        },

        // Text Colors
        text: {
          primary: "#0D0D0D", // main heading (h1, h2)
          secondary: "#1A1A1A", // sub heading (h3, h4)
          body: "#262626", // body text
          paragraph: "#333333", // paragraph text
          subtitle: "#404040", // subtitle
          description: "#4D4D4D", // description
          caption: "#595959", // caption
          metadata: "#666666", // metadata
          placeholder: "#737373", // placeholder
          disabled: "#808080", // disabled text
          hint: "#8C8C8C", // hint text
          helper: "#999999", // helper text
          financial: "#2F4F4F", // financial data
          important: "#1C3A3A", // important numbers
          positive: "#556B2F", // positive values
          negative: "#8B0000", // negative values
          currency: "#8B4513", // currency symbol
          percentage: "#006B84", // percentage
          datetime: "#2F4F4F", // date/time
          featured: "#D3AF37", // highlighted/featured
          table: {
            header: "#1C1C1C", // table header
            content: "#333333", // table content
            secondary: "#666666", // table secondary
            tertiary: "#999999", // table tertiary
          },
        },

        // Link Colors
        link: {
          default: "#00809D", // link default
          hover: "#006B84", // link hover
          visited: "#4FA3B8", // link visited
          active: "#D3AF37", // link active
        },

        // Status Text
        status: {
          success: "#2E8B57", // success message
          error: "#DC143C", // error message
          warning: "#FF8C00", // warning message
          info: "#4169E1", // info message
        },

        // Neutral Grays
        neutral: {
          50: "#FFFFFF", // background white
          100: "#FCF8DD", // main cream background
          200: "#F9F2C7", // medium cream
          300: "#F5E6D3", // light tan
          400: "#E8D5C4", // warm gray
          500: "#D4C5B9", // taupe
          600: "#C8B8A6", // mushroom
          700: "#999999", // helper text
          800: "#666666", // secondary text
          900: "#333333", // main text
        },
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
        keyframes: {
          slideInUp: {
            "0%": {
              transform: "translateY(100px)",
              opacity: "0",
            },
            "100%": {
              transform: "translateY(0)",
              opacity: "1",
            },
          },
          slideInDown: {
            "0%": {
              transform: "translateY(-100px)",
              opacity: "0",
            },
            "100%": {
              transform: "translateY(0)",
              opacity: "1",
            },
          },
          slideInLeft: {
            "0%": {
              transform: "translateX(-100px)",
              opacity: "0",
            },
            "100%": {
              transform: "translateX(0)",
              opacity: "1",
            },
          },
          slideInRight: {
            "0%": {
              transform: "translateX(100px)",
              opacity: "0",
            },
            "100%": {
              transform: "translateX(0)",
              opacity: "1",
            },
          },
          fadeIn: {
            "0%": {
              opacity: "0",
            },
            "100%": {
              opacity: "1",
            },
          },
          fadeInScale: {
            "0%": {
              opacity: "0",
              transform: "scale(0.9)",
            },
            "100%": {
              opacity: "1",
              transform: "scale(1)",
            },
          },
          bounceGentle: {
            "0%, 100%": {
              transform: "translateY(0)",
            },
            "50%": {
              transform: "translateY(-10px)",
            },
          },
          pulseSoft: {
            "0%, 100%": {
              opacity: "1",
            },
            "50%": {
              opacity: "0.7",
            },
          },
          float: {
            "0%, 100%": {
              transform: "translateY(0px)",
            },
            "50%": {
              transform: "translateY(-20px)",
            },
          },
          gradient: {
            "0%, 100%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: "100% 50%",
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
          typing: {
            "0%": {
              width: "0",
            },
            "100%": {
              width: "100%",
            },
          },
          "blink-caret": {
            "0%, 50%": {
              borderColor: "transparent",
            },
            "51%, 100%": {
              borderColor: "#3b82f6",
            },
          },
          glow: {
            "0%, 100%": {
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            },
            "50%": {
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
            },
          },
        },
        boxShadow: {
          modern:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "modern-hover":
            "0 10px 25px -3px rgba(0, 0, 0, 0.15), 0 8px 10px -2px rgba(0, 0, 0, 0.1)",
          "modern-glow": "0 0 20px rgba(59, 130, 246, 0.3)",
          "orange-glow": "0 0 20px rgba(247, 127, 0, 0.3)",
        },
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
          "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        },
      },
    },
    plugins: [],
  },
};
