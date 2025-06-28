#!/usr/bin/env node
const fs = require("node:fs/promises");
const { existsSync } = require("node:fs");
const path = require("node:path");
const { setTimeout } = require("node:timers/promises");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

const dtsFilePath = path.resolve(process.cwd(), "dist/index.d.ts");

async function genDts() {
  const content = await fs.readFile("src/index.d.ts");
  if (!existsSync(path.dirname(dtsFilePath))) {
    await fs.mkdir(path.dirname(dtsFilePath));
  }

  await fs.writeFile(dtsFilePath, content);
}

async function cleanDir(directory) {
  if (existsSync(directory)) {
    for (const file of await fs.readdir(directory)) {
      await fs.unlink(path.join(directory, file));
    }
  }
}

async function build() {
  const outDir = path.resolve(process.cwd(), "dist");
  await cleanDir(outDir);
  await setTimeout(1000);
  await exec("npx webpack --config ./webpack.config-esm.js");
  await setTimeout(1000);
  await exec("npx webpack --config ./webpack.config-cjs.js");
  await setTimeout(1000);
  await genDts();
}

build();
