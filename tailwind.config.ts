import type { Config } from "tailwindcss";

/**
 * Noian Bags tasarım sistemi.
 * Sıcak, sade, el emeği / butik tonları.
 * Renkleri burada değiştirerek tüm sitenin görünümünü güncelleyebilirsiniz.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Sıcak krem zemin
        cream: {
          50: "#FDFBF7",
          100: "#FAF6EF",
          200: "#F3EBDD",
          300: "#E8DAC4",
        },
        // Toprak / kil aksan rengi (marka rengi)
        clay: {
          50: "#F8EDE6",
          100: "#EBD2C3",
          200: "#D9AE96",
          300: "#C68A6B",
          400: "#B5654A",
          500: "#9E5239",
          600: "#84422D",
        },
        // Sıcak kahve metin tonu
        cocoa: {
          400: "#6B5B4D",
          500: "#4A3F35",
          600: "#3A312A",
          700: "#2A231D",
        },
        // Yumuşak adaçayı yeşili (ikincil)
        sage: {
          200: "#D7DBCB",
          300: "#B7BFA3",
          400: "#94A07B",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Nunito Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(74, 63, 53, 0.18)",
        card: "0 2px 14px -6px rgba(74, 63, 53, 0.16)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
