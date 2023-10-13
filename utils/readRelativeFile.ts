import fs from "fs/promises";
import path from "path";

export async function readRelativeFile(pathParam) {
    // relative path to the file
    var filePath = path.join(process.cwd(), pathParam);
    // read the file
  
    try {
      const data = await fs.readFile(filePath, { encoding: "utf8" });
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  }