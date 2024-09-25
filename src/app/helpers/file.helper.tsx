import CryptoJS from 'crypto-js';
import fs from "react-native-fs";

export const CACHE_MEDIA_HOME_FOLDER = fs.CachesDirectoryPath + "/home/"

function getSha1FromString(stringToHash: string) {
  const _str = CryptoJS.SHA1(stringToHash).toString(CryptoJS.enc.Hex);

  return _str.replace(/%20/g, "_")
}

async function createFolderCache(pathFolder: string): Promise<boolean> {
  try {
    const exists = await fs.exists(pathFolder)
    if (exists) {
      return true
    }

    await fs.mkdir(pathFolder, { NSURLIsExcludedFromBackupKey: true })
    return true
  } catch (error) {
    return false
  }
}

function getFileExtensionViaCode(mime: string): string {
  let allMimes: {
    [key: string]: string[]
  } = {
    "png": ["image\/png", "image\/x-png"],
    "bmp": ["image\/bmp", "image\/x-bmp", "image\/x-bitmap", "image\/x-xbitmap", "image\/x-win-bitmap", "image\/x-windows-bmp", "image\/ms-bmp", "image\/x-ms-bmp", "application\/bmp", "application\/x-bmp", "application\/x-win-bitmap"],
    "gif": ["image\/gif"],
    "jpeg": ["image\/jpeg", "image\/pjpeg"],
    "heic": ["image\/heic"],
    "heif": ["image\/heif"],
    "svg": ["image\/svg+xml"]
  };
  const listKeys = Object.keys(allMimes) as string[]
  const _mimeType = listKeys.find(key => (allMimes?.[key] || [])?.indexOf(mime) !== -1) || ""
  return _mimeType;
}

export async function downloadFileToPath(url: string, path: string): Promise<string> {
  try {
    let typeFile = "";
    await fs.downloadFile({
      fromUrl: url,
      toFile: path,
      background: true,
      begin: (res) => {
        if (res.statusCode === 200) {
          typeFile = getFileExtensionViaCode(res.headers["Content-Type"])
        }
      },
      
    }).promise
    try {
      if (typeFile !== "") {
        typeFile = "." + typeFile;
        await fs.moveFile(path, `${path}${typeFile}`)
      }
    } catch (error) { }

    return `file://${path}${typeFile}`;
  } catch (error) {
    return "";
  }
}

export async function getMediaCachePath(link: string, folder: string): Promise<string> {
  try {
    /**
     * get SHA1 hash for name file
     */
    const nameFile = getSha1FromString(link);
    if (nameFile === "")
      return "";

    let isCreateFolder = await createFolderCache(folder);
    if (!isCreateFolder)
      return ""

    const results = await fs.readDir(folder)
    const path = results.find(p => p.name.split('.').slice(0, -1).join('.') === nameFile)?.path || "";

    if (!path) {
      return await downloadFileToPath(link, folder + nameFile);
    }
    return `file://${path}`;
  } catch (error) {
    return link
  }
}