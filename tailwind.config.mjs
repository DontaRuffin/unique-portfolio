/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalist Palette
        'brutal-black': '#000000',
        'brutal-white': '#FFFFFF',
        'brutal-cream': '#F5F0E8',
        'brutal-orange': '#FF6B35',
        'brutal-violet': '#7C3AED',
        'brutal-cyan': '#06B6D4',
        'brutal-lime': '#A3E635',
        'brutal-pink': '#F472B6',
      },
      fontFamily: {
        'display': ['"Space Mono"', 'monospace'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'body': ['"Instrument Sans"', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-hover': '0px 0px 0px 0px #000000',
        'brutal-inset': 'inset 4px 4px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
