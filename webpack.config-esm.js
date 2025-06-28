import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('webpack').Configuration} */

const webpackConfig = {
  mode: "production",
  entry: "./src/index.mjs",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.mjs",
    library: {
      type: "module",
    },
    environment: {
      module: true,
    },
    clean: true,
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                  targets: {
                    esmodules: true,
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".mts", ".mjs", ".ts", ".js"], // .mts and .mjs first
    extensionAlias: {
      ".js": [".mjs", ".js"],
      ".ts": [".mts", ".ts"],
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  externals: {
    htmlparser2: "htmlparser2", // Example external dependency
  },
};

export default webpackConfig;
