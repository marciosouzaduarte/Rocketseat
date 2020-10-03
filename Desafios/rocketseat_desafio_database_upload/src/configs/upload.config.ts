import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const locationPath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  locationPath,

  storage: multer.diskStorage({
    destination: locationPath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
