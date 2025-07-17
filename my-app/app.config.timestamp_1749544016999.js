// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

var app_config_default = defineConfig({
	vite: {
		plugins: [vanillaExtractPlugin()],
	},
});
export { app_config_default as default };
