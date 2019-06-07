import cpx from "cpx";
import gulp, { parallel, series } from "gulp";
import ts from "gulp-typescript";
import rimraf from "rimraf";
import { Stream } from "stream";
import mocha from "gulp-mocha";
import fs from "fs";

type taskCallback = () => void;

async function copyAsPromised(source: string, target: string): Promise<void> {
  cpx.copy(
    source,
    target,
    async (err: Error | null): ReturnType<typeof copyAsPromised> => {
      if (err) throw err;
    }
  );
}

async function cleanAsPromised(target: string): Promise<void> {
  return new Promise(
    (resolve, reject): void => {
      rimraf(
        target,
        (err: Error): void => {
          if (err) reject(err);
          resolve();
        }
      );
    }
  );
}

function transpile(): Stream {
  const tsProject = ts.createProject("./tsconfig.json");

  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(tsProject.options.outDir || "./dist"));
}

async function deployStatics(cb: taskCallback): Promise<void> {
  await copyAsPromised("./src/app/**/*.{html,css}", "./dist/src/app");

  cb();
}

function runTests(mochaOptionsFilePath: string, testFile: string): Stream {
  const mochaOptions = JSON.parse(
    fs.readFileSync(mochaOptionsFilePath).toString()
  );

  return gulp.src(testFile).pipe(mocha(mochaOptions));
}

function runUnitTests(): Stream {
  return runTests("./tests/.mocharc.json", "./dist/tests/tests.spec.js");
}

function runBehavioralTests(): Stream {
  return runTests("./specs/.mocharc.json", "./dist/specs/tests.spec.js");
}

export async function clean(cb: taskCallback): Promise<void> {
  await Promise.all([
    cleanAsPromised("./dist"),
    cleanAsPromised("./.nyc_output")
  ]);

  cb();
}

export const build = parallel(deployStatics, transpile);
export const rebuild = series(clean, build);
export const utest = series(build, runUnitTests);
export const btest = series(build, runBehavioralTests);
