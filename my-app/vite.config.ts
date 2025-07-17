import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [solidPlugin(), vanillaExtractPlugin()],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
});
