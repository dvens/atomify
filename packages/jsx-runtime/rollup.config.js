import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
    input: './dist/esm/index.js',
    output: {
        file: './dist/index.bundled.js',
        format: 'esm',
    },
    onwarn(warning) {
        if (warning.code !== 'CIRCULAR_DEPENDENCY') {
            console.error(`(!) ${warning.message}`);
        }
    },
    plugins: [
        resolve(),
        terser({
            warnings: true,
            mangle: {
                module: true,
            },
        }),
        filesize({
            showBrotliSize: true,
        }),
    ],
};
