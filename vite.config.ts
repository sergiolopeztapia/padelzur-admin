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
			'@/assets': path.resolve(__dirname, './src/assets'),
			'@/components': path.resolve(__dirname, './src/components'),
			'@/features': path.resolve(__dirname, './src/features'),
			'@/hooks': path.resolve(__dirname, './src/hooks'),
			'@/lib': path.resolve(__dirname, './src/lib'),
			'@/stores': path.resolve(__dirname, './src/stores'),
			'@/styles': path.resolve(__dirname, './src/styles'),
			'@/types': path.resolve(__dirname, './src/types'),
		},
	},
});
