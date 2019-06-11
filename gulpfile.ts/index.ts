import cpx from "cpx";
import gulp, { parallel, series } from "gulp";
import sourcemaps from "gulp-sourcemaps";
import ts from "gulp-typescript";
import mkdir from "mkdirp";
import rimraf from "rimraf";
import { Stream } from "stream";

type taskCallback = () => void;

async function copyAsPromised(source: string, target: string): Promise<void> {
  return new Promise<void>(
    (resolve, reject): void => {
      cpx.copy(
        source,
        target,
        (err: Error | null): void => {
          if (err) reject(err);
          else resolve();
        }
      );
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

async function mkdirAsPromised(target: string): Promise<void> {
  return new Promise<void>(
    (resolve, reject): void => {
      mkdir(
        target,
        (err: NodeJS.ErrnoException): void => {
          if (err) reject(err);
          else resolve();
        }
      );
    }
  );
}

function transpile(): Stream {
  const tsProject = ts.createProject("./tsconfig.json");

  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write(".", { sourceRoot: "./", includeContent: false }))
    .pipe(gulp.dest(tsProject.options.outDir || "./dist"));
}

async function deployStatics(cb: taskCallback): Promise<void> {
  await copyAsPromised("./src/app/**/*.{html,css}", "./dist/src/app");

  cb();
}

async function gatherReleaseFiles(cb: taskCallback): Promise<void> {
  await mkdirAsPromised("./dist/release/app");

  await Promise.all([
    copyAsPromised("./dist/src/app/**/*.{js,html,css}", "./dist/release/app"),
    copyAsPromised("./package*.json", "./dist/release"),
    copyAsPromised("./LICENSE", "./dist/release")
  ]);

  cb();
}

function packageApp(cb: taskCallback): void {
  cb();
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
export const release = series(build, gatherReleaseFiles, packageApp);
