/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // include all your source files
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    safelist: [
        // Regex patterns for dynamic classes
        {
            pattern: /btn-(primary|secondary|accent|ghost)/, // DaisyUI buttons
        },
        {
            pattern: /text-(primary|secondary|accent|success|warning|error)/, // Text colors
        },
        {
            pattern: /bg-(primary|secondary|accent|success|warning|error)/, // Background colors
        },
        {
            pattern: /alert-(success|error|warning|info)/, // DaisyUI alerts
        },
        {
            pattern: /card/, // Example for card classes
        },
    ],
};
