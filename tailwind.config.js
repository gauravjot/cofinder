/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				accent: {
					100: "#e9f0eb",
					200: "#d7e4db",
					300: "#b0cab7",
					400: "#8ab095",
					500: "#649775",
					600: "#3c7e55",
					700: "#026537",
					800: "#014726",
					900: "#01321b",
				},
				laccent: {
					50: "#f3f8e7",
					100: "#ebf4d8",
					200: "#e2f0c9",
					300: "#daecb9",
					400: "#cae39a",
					500: "#badb7c",
					600: "#aad25d",
					700: "#9aca3e",
					800: "#84b030",
					900: "#6d9228",
				},
				slate: {
					1000: "#0a0f1c",
				},
			},
			screens: {
				"3xl": "1836px",
				"4xl": "2222px",
			},
		},
	},
	plugins: [],
};
