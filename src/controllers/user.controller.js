import User from '../models/user';
import bcrypt from 'bcryptjs';
import authJwt from '../middlewares/authJwt.js';

const Roles = ['user', 'admin'];

export const signup = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ message: '이메일을 입력해 주세요.' });
  }
  if (!req.body.name) {
    return res.status(400).json({ message: '닉네임을 입력해 주세요.' });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: '비밀번호를 입력해 주세요.' });
  }
  if (req.body.roles) {
    return req.body.roles.map((role) => {
      if (!Roles.includes(role)) {
        return res.status(400).json({ message: `'${role}'는 존재하지 않는 권한 입니다!` });
      }
    });
  }

  User.findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        return res.status(400).json({ message: '이미 존재하는 이메일 입니다!' });
      }
    })
    .catch((err) => {});

  User.findOne({ name: req.body.name })
    .then((result) => {
      if (result) {
        return res.status(400).json({ message: '이미 존재하는 닉네임 입니다!' });
      }
    })
    .catch((err) => {});

  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: password,
  });

  user
    .save()
    .then((result) => {
      return res.status(201).json({ message: `회원가입 완료! (${result})` });
    })
    .catch((err) => {});
};

export const signin = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ message: '이메일을 입력해 주세요.' });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: '비밀번호를 입력해 주세요.' });
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: `해당 회원을 찾을 수 없습니다. (${req.body.email})` });
      }

      let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).json({ token: null, message: '비밀번호가 맞지 않습니다!' });
      }

      return Promise.resolve(user);
    })
    .then((user) => {
      return authJwt.signToken(user);
    })
    .then((token) => {
      return User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { authToken: token } },
        { returnOriginal: false },
      );
    })
    .then((result) => {
      return res.status(200).json({
        success: true,
        token: result.authToken,
        user: { id: result.id, name: result.name, role: result.role, email: result.email },
      });
    })
    .catch((err) => {});
};

export const generateSwaggerToken = (req, res, next) => {
  User.findOne({ email: 'test@test.com' })
    .then((user) => {
      return authJwt.signToken(user);
    })
    .then((token) => {
      return User.findOneAndUpdate(
        { email: 'test@test.com' },
        { $set: { authToken: token } },
        { returnOriginal: false },
      );
    })
    .then((result) => {
      return res.status(200).json({
        success: true,
        token: result.authToken,
        user: { id: result.id, name: result.name, role: result.role, email: result.email },
      });
    })
    .catch((err) => {});
};

export const checkToken = (req, res, next) => {
  if (!req.user || !req.isLogged) {
    return res.status(200).json({ success: false });
  }
  if (req.user && req.isLogged) {
    return res.status(200).json({
      success: true,
      token: req.token,
      user: { id: req.user.id, name: req.user.name, role: req.user.role, email: req.user.email },
    });
  }
};

export const findAll = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: '관리자 페이지 접근 권한이 없습니다!' });
  }
  if (req.isAdmin) {
    User.find()
      .sort({ id: -1 })
      .then((result) => {
        if (!result) {
          return res.status(404).json({ message: `가입된 회원이 없습니다.` });
        } else {
          return res.status(200).json(result);
        }
      })
      .catch((err) => {});
  }
};

export const findById = (req, res, next) => {
  if (!req.isLogged) {
    return res.status(403).json({ message: '회원만 접근할 수 있습니다. 로그인 해 주세요.' });
  }
  if (req.isLogged) {
    let findCondition = !req.isAdmin ? { id: req.params.id, email: req.user.email } : { id: req.params.id };
    User.findOne(findCondition)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ message: `잘못된 접근입니다! (${req.params.id})` });
        } else {
          return res.status(200).json(result);
        }
      })
      .catch((err) => {});
  }
};

export const update = (req, res, next) => {
  if (!req.isLogged) {
    return res.status(403).json({ message: '회원만 접근할 수 있습니다. 로그인 해 주세요.' });
  }
  if (req.isLogged) {
    let findCondition = !req.isAdmin ? { id: req.params.id, email: req.user.email } : { id: req.params.id };

    User.findOne(findCondition)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ message: `잘못된 접근입니다! (${req.params.id})` });
        } else {
          if (req.body.password) {
            var salt = bcrypt.genSaltSync(10);
            var password = bcrypt.hashSync(req.body.password, salt);
          } else {
            var password = result.password;
          }
          if (req.body.name) {
            var username = req.body.name;
          } else {
            var username = result.name;
          }
          User.findOneAndUpdate(
            findCondition,
            { $set: { name: username, password: password } },
            { returnOriginal: false },
          )
            .then((result) => {
              if (!result) {
                return res.status(404).json({ message: `잘못된 접근입니다! (${req.params.id})` });
              } else {
                return res.status(200).json(result);
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  }
};

export const remove = (req, res, next) => {
  if (!req.isLogged) {
    return res.status(403).json({ message: '회원만 접근할 수 있습니다. 로그인 해 주세요.' });
  }
  if (req.isLogged) {
    let findCondition = !req.isAdmin ? { id: req.params.id, email: req.user.email } : { id: req.params.id };
    User.findOneAndDelete(findCondition)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ message: `잘못된 접근입니다! (${req.params.id})` });
        } else {
          return res.status(200).json(result);
        }
      })
      .catch((err) => {});
  }
};

export default {
  signin,
  signup,
  generateSwaggerToken,
  checkToken,
  findAll,
  findById,
  update,
  remove,
};
