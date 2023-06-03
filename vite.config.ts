import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
	return {
		// https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
		define: {
			"process.env": {},
		},
		server: {
			open: true,
		},
		build: {
			outDir: "build",
		},
		plugins: [
			react(),
			// svgr options: https://react-svgr.com/docs/options/
			svgr({ svgrOptions: { icon: true } }),
			viteTsconfigPaths(),
		],
		resolve: {
			alias: [{ find: "@", replacement: "/src" }],
		},
	};
});
