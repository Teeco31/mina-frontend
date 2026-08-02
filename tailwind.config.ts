import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        gold: '#C9A84C',
        'gold-light': '#D9C070',
        cream: '#F5F0E8',
        'warm-white': '#FAFAFA',
        // keep legacy tokens so existing class names don't break
        ink: '#0A1628',
        muted: '#6B7280',
        border: '#E5E7EB',
        'dark-section': '#0A1628',
        'footer-bg': '#060E1C',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        // keep old tokens pointing to new fonts
        cormorant: ['Playfair Display', 'serif'],
        dm: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
        widest3: '0.3em',
      },
      screens: {
        xs: '400px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
export default config
