import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	server: {
		open: true,
		port: 3000,
	},
	resolve: {
		alias: {
			'@/components': path.resolve(__dirname, './src/components'),
			'@/lib': path.resolve(__dirname, './src/lib'),
			'@/hooks': path.resolve(__dirname, './src/hooks'),
			'@/types': path.resolve(__dirname, './src/types'),
			'@/styles': path.resolve(__dirname, './src/styles'),
			'@/assets': path.resolve(__dirname, './src/assets'),
			'@/stores': path.resolve(__dirname, './src/stores'),
		},
	},
});
