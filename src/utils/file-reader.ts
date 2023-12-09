import { promises as fsp } from "fs";

const dir = "./dist/blog-client/app/pages";

async function fileReader(fileNames: string[]): Promise<string[]> {
  return Promise.all(
    fileNames.map(async (file: string) => {
      return await fsp.readFile(`${dir}/${file}`, "utf8");
    })
  );
}

export = fileReader;
