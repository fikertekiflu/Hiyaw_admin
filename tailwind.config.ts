// tailwind.config.js
// This configuration should remain the same as it references CSS variables from globals.css

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Hiyaw brand colors (referencing CSS variables from globals.css)
        hiyaw: {
          primary: 'hsl(var(--primary-hue) var(--primary-saturation) var(--primary-lightness))',
          secondary: 'hsl(var(--secondary-hue) var(--secondary-saturation) var(--secondary-lightness))',
          dark: 'hsl(var(--foreground-hue) var(--foreground-saturation) var(--foreground-lightness))',
          light: 'hsl(var(--background-hue) var(--background-saturation) var(--background-lightness))',
        },
        // shadcn/ui compatible color names, referencing CSS variables
        border: 'hsl(var(--border-hue) var(--border-saturation) var(--border-lightness))',
        input: 'hsl(var(--input-hue) var(--input-saturation) var(--input-lightness))',
        ring: 'hsl(var(--ring-hue) var(--ring-saturation) var(--ring-lightness))',
        background: 'hsl(var(--background-hue) var(--background-saturation) var(--background-lightness))',
        foreground: 'hsl(var(--foreground-hue) var(--foreground-saturation) var(--foreground-lightness))',
        primary: {
          DEFAULT: 'hsl(var(--primary-hue) var(--primary-saturation) var(--primary-lightness))',
          foreground: 'hsl(var(--primary-foreground-hue) var(--primary-foreground-saturation) var(--primary-foreground-lightness))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary-hue) var(--secondary-saturation) var(--secondary-lightness))',
          foreground: 'hsl(var(--secondary-foreground-hue) var(--secondary-foreground-saturation) var(--secondary-foreground-lightness))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive-hue) var(--destructive-saturation) var(--destructive-lightness))',
          foreground: 'hsl(var(--destructive-foreground-hue) var(--destructive-foreground-saturation) var(--destructive-foreground-lightness))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted-hue) var(--muted-saturation) var(--muted-lightness))',
          foreground: 'hsl(var(--muted-foreground-hue) var(--muted-foreground-saturation) var(--muted-foreground-lightness))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent-hue) var(--accent-saturation) var(--accent-lightness))',
          foreground: 'hsl(var(--accent-foreground-hue) var(--accent-foreground-saturation) var(--accent-foreground-lightness))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover-hue) var(--popover-saturation) var(--popover-lightness))',
          foreground: 'hsl(var(--popover-foreground-hue) var(--popover-foreground-saturation) var(--popover-foreground-lightness))',
        },
        card: {
          DEFAULT: 'hsl(var(--card-hue) var(--card-saturation) var(--card-lightness))',
          foreground: 'hsl(var(--card-foreground-hue) var(--card-foreground-saturation) var(--card-foreground-lightness))',
        },
        sidebar: { // For utility classes like bg-sidebar, text-sidebar-foreground etc.
          DEFAULT: 'hsl(var(--sidebar-hue) var(--sidebar-saturation) var(--sidebar-lightness))',
          foreground: 'hsl(var(--sidebar-foreground-hue) var(--sidebar-foreground-saturation) var(--sidebar-foreground-lightness))',
          primary: 'hsl(var(--sidebar-primary-hue) var(--sidebar-primary-saturation) var(--sidebar-primary-lightness))',
          accent: 'hsl(var(--sidebar-accent-hue) var(--sidebar-accent-saturation) var(--sidebar-accent-lightness))',
          accent_foreground: 'hsl(var(--sidebar-accent-foreground-hue) var(--sidebar-accent-foreground-saturation) var(--sidebar-accent-foreground-lightness))',
          border: 'hsl(var(--sidebar-border-hue) var(--sidebar-border-saturation) var(--sidebar-border-lightness))',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        'brand-accent': ['var(--font-brand-accent)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 16px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 6px 18px rgba(0, 0, 0, 0.1)',
        'inner-light': 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.05)', // For dark sidebar elements
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};