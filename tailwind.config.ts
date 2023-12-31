/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.tsx"],
	theme: {
		extend: {
			colors: {
				primary: "#215292",
				secondary: "#CF433D",
			},
			screens: { mobile: { max: "1024px" } },
		},
	},
	plugins: [],
}
