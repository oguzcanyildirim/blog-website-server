import fs from 'fs';
import path from 'path';

export const readMultipleFiles = (filePaths: string[]): Promise<string[]> => {
  const readFilePromises = filePaths.map(filePath => {
    const absoluteFilePath = path.resolve(__dirname, filePath);
    return new Promise<string>((resolve, reject) => {
      fs.readFile(absoluteFilePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  });

  return Promise.all(readFilePromises);
};

export const readFileContent = (relativePath: string): Promise<any> => {
  const filePath = path.resolve(__dirname, relativePath);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const parsedData = JSON.parse(data);
        resolve(parsedData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};


export async function getAllFilesFromDirectory(directoryPath: string) {
  try {
    const resolvedPath = path.resolve(__dirname, directoryPath);
    const files = await fs.promises.readdir(resolvedPath, 'utf8');
    return files;
  } catch (error: any) {
    console.error(`Error reading directory: ${error.message}`);
    throw error;
  }
}

