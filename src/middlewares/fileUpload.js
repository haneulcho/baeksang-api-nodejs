import { access } from 'fs';
import mkdirp from 'mkdirp';
import multer, { diskStorage } from 'multer';
import { uuid } from 'uuidv4';

const UPLOAD_PATH = 'uploads/images/';
const UPLOAD_FIELD = 'images';
const ALLOW_FILE_TYPES = /png|jpeg|jpg|gif/;
const ALLOW_FILE_REQUEST = 3;
const ALLOW_FILE_SIZE = 10 * 1024 * 1024;

const getFileName = (fileName) => {
  return fileName.toLowerCase().split(' ').join('-');
};

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    console.log(req);
    access(UPLOAD_PATH, (err) => {
      if (err && err.code === 'ENOENT') {
        mkdirp(`./${UPLOAD_PATH}`).then((made) => {
          console.log(`업로드 폴더가 존재하지 않아 ${UPLOAD_PATH} 폴더를 생성했습니다!`);
          cb(null, UPLOAD_PATH);
        });
      } else {
        cb(null, UPLOAD_PATH);
      }
    });
  },
  filename: (req, file, cb) => {
    let fileName = getFileName(file.originalname);
    cb(null, `${uuid()}-${fileName}`);
  },
});

let upload = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    let fileName = getFileName(file.originalname);
    let filetypes = ALLOW_FILE_TYPES;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(fileName);

    if (!mimetype && !extname) {
      return cb(new Error(`업로드를 지원하지 않는 파일입니다. 지원 가능 확장자 - ${filetypes}`), false);
    }

    cb(null, true);
  },
  limits: {
    files: ALLOW_FILE_REQUEST,
    fieldSize: ALLOW_FILE_SIZE,
  },
});

export const uploadImage = upload.array(UPLOAD_FIELD);

export default {
  uploadImage,
};
