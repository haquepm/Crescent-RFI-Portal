import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink: "#17243A", brand: "#1E4D72", accent: "#D7A95B" }, boxShadow: { soft: "0 18px 50px rgba(23,36,58,.08)" } } }, plugins: [] } satisfies Config;
