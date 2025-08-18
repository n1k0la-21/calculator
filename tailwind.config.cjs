import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: { extend: {} },
    plugins: [daisyui],
    safelist: [
        { pattern: /btn(-primary|-secondary|-accent|-ghost)?/ },
        { pattern: /text-(primary|secondary|accent|success|warning|error)/ },
        { pattern: /bg-(primary|secondary|accent|success|warning|error)/ },
        { pattern: /alert(-success|-error|-warning|-info)?/ },
        { pattern: /card/ },
        { pattern: /input/ },
        { pattern: /badge/ },
        { pattern: /navbar/ },
        { pattern: /dropdown/ },
        { pattern: /tooltip/ },
    ],
    daisyui: { themes: ["light", "dark"], styled: true },
};
