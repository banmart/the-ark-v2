import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				// Mythic Brutalism Typography System
				display: ['Bebas Neue', 'system-ui', 'sans-serif'],
				serif: ['Libre Baskerville', 'Georgia', 'serif'],
				accent: ['Cormorant Garamond', 'serif'],
				mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
				// Legacy support
				sans: ['Libre Baskerville', 'Georgia', 'serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.6' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '0.9' }],
				'9xl': ['8rem', { lineHeight: '0.85' }],
				'10xl': ['10rem', { lineHeight: '0.8' }],
				'11xl': ['12rem', { lineHeight: '0.8' }],
			},
			letterSpacing: {
				'tightest': '-0.05em',
				'display': '0.05em',
				'widest': '0.25em',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Mythic Brutalism Palette
				ark: {
					obsidian: 'hsl(var(--ark-obsidian))',
					charcoal: 'hsl(var(--ark-charcoal))',
					stone: 'hsl(var(--ark-stone))',
					gold: 'hsl(var(--ark-gold))',
					copper: 'hsl(var(--ark-copper))',
					blood: 'hsl(var(--ark-blood))',
					ivory: 'hsl(var(--ark-ivory))',
					pulse: 'hsl(var(--ark-pulse))',
				},
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'4xl': '2rem',
			},
			boxShadow: {
				'brutal': '8px 8px 0 hsl(var(--ark-obsidian))',
				'brutal-gold': '6px 6px 0 hsl(var(--ark-gold))',
				'brutal-sm': '4px 4px 0 hsl(var(--ark-obsidian))',
				'inner-gold': 'inset 0 0 30px hsl(var(--ark-gold) / 0.15)',
				'glow-gold': '0 0 40px hsl(var(--ark-gold) / 0.3)',
				'deep': '0 25px 50px -12px hsl(var(--ark-obsidian) / 0.8)',
			},
			backdropBlur: {
				xs: '2px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(40px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-40px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-right': {
					'0%': { opacity: '0', transform: 'translateX(40px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'gold-pulse': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '0.8' }
				},
				'reveal-text': {
					'0%': { clipPath: 'inset(0 100% 0 0)' },
					'100%': { clipPath: 'inset(0 0 0 0)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'grain': {
					'0%, 100%': { transform: 'translate(0, 0)' },
					'10%': { transform: 'translate(-5%, -10%)' },
					'30%': { transform: 'translate(3%, -15%)' },
					'50%': { transform: 'translate(12%, 9%)' },
					'70%': { transform: 'translate(9%, 4%)' },
					'90%': { transform: 'translate(-1%, 7%)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
				'gold-pulse': 'gold-pulse 3s ease-in-out infinite',
				'reveal-text': 'reveal-text 1s ease-out forwards',
				'float-slow': 'float-slow 6s ease-in-out infinite',
				'grain': 'grain 8s steps(10) infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-diagonal': 'linear-gradient(135deg, var(--tw-gradient-stops))',
				'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'dramatic': 'cubic-bezier(0.22, 1, 0.36, 1)',
			},
			transitionDuration: {
				'400': '400ms',
				'600': '600ms',
				'800': '800ms',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Plugin to apply Bebas Neue to all headings
		function({ addBase }) {
			addBase({
				'h1, h2, h3, h4, h5, h6': {
					fontFamily: 'Bebas Neue, system-ui, sans-serif',
					letterSpacing: '0.05em',
				},
			})
		}
	],
} satisfies Config;
