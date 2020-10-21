import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tempFolder = path.resolve(__dirname, '..', '..', 'temp');
const uploadsFolder = path.resolve(tempFolder, 'arquivos');

interface IUploadConfig {
  driver: 'disk';

  tempFolder: string;
  uploadsFolder: string;

  config: {
    disk: {
      storage: StorageEngine;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tempFolder,
  uploadsFolder,

  config: {
    disk: {
      storage: multer.diskStorage({
        destination: tempFolder,
        filename(request, file, callback) {
          const fileHash = crypto.randomBytes(10).toString('hex');
          const filename = `${fileHash}-${file.originalname}`;

          return callback(null, filename);
        },
      }),
    },
  },
} as IUploadConfig;
