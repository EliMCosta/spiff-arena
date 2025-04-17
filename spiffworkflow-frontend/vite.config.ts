import preact from '@preact/preset-vite';
import { defineConfig, loadEnv } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 7001;

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/',
    plugins: [
      preact({ devToolsEnabled: mode === 'development' }),
      viteTsconfigPaths(),
      svgr({
        svgrOptions: {
          exportType: 'default',
          ref: true,
          svgo: mode === 'production', // Only optimize SVGs in production
          titleProp: true,
        },
        include: '**/*.svg',
      }),
      // Add bundle analyzer in analyze mode
      mode === 'analyze' && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    server: {
      open: false,
      host,
      port,
    },
    preview: {
      host,
      port,
    },
    resolve: {
      alias: {
        inferno:
          mode !== 'production'
            ? 'inferno/dist/index.dev.esm.js'
            : 'inferno/dist/index.esm.js',
      },
      preserveSymlinks: true,
    },
    build: {
      // Optimize build by splitting code into chunks
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'mui-vendor': ['@mui/material', '@mui/icons-material', '@mui/x-data-grid', '@mui/x-tree-view'],
            'bpmn-vendor': ['bpmn-js', 'diagram-js', 'dmn-js', 'bpmn-js-properties-panel', 'dmn-js-properties-panel'],
            'carbon-vendor': ['@carbon/react', '@carbon/icons-react']
          }
        }
      },
      // Improve sourcemap generation in dev mode only
      sourcemap: mode !== 'production',
      // Minify in production mode only
      minify: mode === 'production',
    },
  };
});
