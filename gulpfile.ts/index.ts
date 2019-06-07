import cpx from "cpx";
import gulp, { parallel, series } from "gulp";
import ts from "gulp-typescript";
import rimraf from "rimraf";
import { Stream } from "stream";

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

export async function clean(cb: taskCallback): Promise<void> {
  await Promise.all([
    cleanAsPromised("./dist"),
    cleanAsPromised("./.nyc_output")
  ]);

  cb();
}

export const build = parallel(deployStatics, transpile);
export const rebuild = series(clean, build);
