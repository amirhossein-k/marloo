import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate" // 👈 به جای require

const config: Config = {
    darkMode: "class", // 👈 درست شد
    content: [
        "./pages/**/*.{ts,tsx,js,jsx}",
        "./components/**/*.{ts,tsx,js,jsx}",
        "./app/**/*.{ts,tsx,js,jsx}",
        "./src/**/*.{ts,tsx,js,jsx}",
        "./node_modules/swiper/**/*.js", // 🔹 اضافه کن

    ],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [animate], // 👈 اینم درست شد
}

export default config
