import { config } from 'dotenv';
import path from 'path';

import User from '../models/user';
import { sign, verify } from 'jsonwebtoken';

if (process.env.NODE_ENV === 'production') {
  config({ path: path.resolve(process.cwd(), '.env.production') });
} else if (process.env.NODE_ENV === 'development') {
  config({ path: path.resolve(process.cwd(), '.env.development') });
}

const secret_key = process.env.SECRET_KEY;

export const signToken = (user) => {
  return new Promise((resolve, reject) => {
    sign(
      { id: user.id, name: user.name, role: user.role, email: user.email },
      secret_key,
      {
        expiresIn: '72h',
      },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      },
    );
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, secret_key, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};

const verifyUser = (email, token) =>
  User.findOne({ email: email })
    .then((user) => {
      let result = { success: false, code: 404, message: '가입된 회원이 아니거나 탈퇴한 회원입니다!' };

      if (user.authToken !== token) {
        result.code = 401;
        result.message = '인증 토큰값이 마지막 발급 인증 토큰값과 일치하지 않습니다!';
      }

      if (user && user.authToken === token) {
        result.success = true;
        result.code = 200;
        result.message = '회원 검증에 성공했습니다!';
        result.user = user;
      }

      return result;
    })
    .catch((err) => {
      return { success: false, code: 401, message: '회원 검증에 실패했습니다!' };
    });
export const isAuthentication = (req, res, next) => {
  req.isLogged = false;
  req.isAdmin = false;

  let token = req.headers['x-access-token'];

  if (!token) {
    console.log('인증 토큰값이 없습니다!');
  }

  if (token === 'guest') {
    console.log('인증 토큰값이 guest입니다. 비회원으로 인식합니다.');
  }

  if (token && token !== 'guest') {
    verifyToken(token)
      .then((decoded) => {
        verifyUser(decoded.email, token)
          .then((result) => {
            if (result.success) {
              req.token = token;
              req.user = decoded;
              req.user._id = result.user._id;
              req.isLogged = true;
              req.isAdmin = result.user.role === 'admin' ? true : false;
            }
            console.log(`code: ${result.code}, message: ${result.message}`);
            next();
          })
          .catch((err) => {
            console.log(`code: ${err.code}, message: ${err.message}`);
            next();
          });
      })
      .catch((err) => {
        console.log('인증 토큰 검증에 실패했습니다!');
        next();
      });
  } else {
    next();
  }
};

export const isMember = (req, res, next) => {
  if (!req.user || !req.isLogged) {
    return res.status(403).json({ message: '접근 권한이 없습니다. 회원만 접근 가능합니다!' });
  }
  if (req.user && req.isLogged) {
    next();
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.isLogged || !req.isAdmin) {
    return res.status(403).json({ message: '접근 권한이 없습니다. 관리자만 접근 가능합니다!' });
  }
  if (req.user && req.isLogged && req.isAdmin) {
    next();
  }
};

export default {
  signToken,
  isAuthentication,
  isMember,
  isAdmin,
};
