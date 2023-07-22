import Notice from '../models/notice';
import fs from 'fs';

const myCustomLabels = {
  docs: 'itemsList',
  limit: 'itemPerPage',
  totalDocs: 'totalItemCount',
  totalPages: 'totalPageCount',
  page: 'currentPage',
};

const deleteFile = (files) => {
  files.map((file) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
};

export const create = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).json({ message: '글 제목을 입력해 주세요.' });
  }
  if (!req.body.contents) {
    return res.status(400).json({ message: '글 내용을 입력해 주세요.' });
  }

  let url = req.protocol + '://' + req.get('host') + '/';
  req.body.files = [];
  if (req.files.length) {
    req.files.map((file, index) => {
      req.body.files[index] = {
        name: file.originalname,
        url: url + file.destination + file.filename,
        type: file.mimetype,
        size: file.size,
        path: file.path,
      };
    });
  }

  const notice = new Notice({
    title: req.body.title,
    contents: req.body.contents,
    author: req.user._id,
    tags: req.body.tags ? req.body.tags : [],
    files: req.body.files,
  });

  notice
    .save()
    .then((result) => {
      return res.status(201).json({ message: `공지사항 게시판 글 작성 완료! (${result})`, id: result.id });
    })
    .catch((err) => {});
};

export const findAll = (req, res, next) => {
  const options = {
    populate: {
      path: 'author',
      options: {
        select: 'name',
      },
    },
    page: req.query.page || 1,
    limit: req.query.size || 10,
    sort: { id: -1 },
    select: '-_id -ip -files -tags -contents -comments -updated_at -__v',
    customLabels: myCustomLabels,
  };
  Notice.paginate({}, options)
    .then((result) => {
      if (!result || !result.itemsList.length) {
        return res.status(404).json({ message: '등록된 게시글이 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {});
};

export const findById = (req, res, next) => {
  const options = {
    populate: [
      {
        path: 'comments',
        options: {
          sort: { id: 1 },
          select: 'id author display_name contents created_at cnt',
        },
      },
      {
        path: 'author',
        options: {
          select: 'name',
        },
      },
    ],
    lean: true,
    page: req.query.page || 1,
    limit: req.query.size || 10,
    select: '-__v',
    customLabels: myCustomLabels,
  };
  Notice.paginate({ id: req.params.id }, options)
    .then((result) => {
      if (!result || !result.itemsList.length) {
        return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
      } else {
        result.itemsList[0].id = req.params.id;
        Notice.find({ _id: { $lt: result.itemsList[0]._id } })
          .lean()
          .select('id title cnt -_id')
          .limit(1)
          .then((result_prev) => {
            result.itemsList[0].prevItem = result_prev[0] ? result_prev[0] : null;
            Notice.find({ _id: { $gt: result.itemsList[0]._id } })
              .lean()
              .select('id title cnt -_id')
              .limit(1)
              .then((result_next) => {
                result.itemsList[0].nextItem = result_next[0] ? result_next[0] : null;
                return res.status(200).json(result);
              })
              .catch((err) => {});
          })
          .catch((err) => {});
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
      } else {
      }
    });
};

export const update = (req, res, next) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ message: '입력 필드에 내용을 입력해 주세요.' });
  }

  let url = req.protocol + '://' + req.get('host') + '/';
  if (req.files.length) {
    req.body.files = [];
    req.files.map((file, index) => {
      req.body.files[index] = {
        name: file.originalname,
        url: url + file.destination + file.filename,
        type: file.mimetype,
        size: file.size,
        path: file.path,
      };
    });
  }

  req.body.delete_files = [];

  // 글 수정 시, Front에서 넘어온 delete_files 체크박스 있으면 해당 파일 삭제
  if (req.body.delete_files.length) {
    deleteFile(req.body.delete_files);
  }

  Notice.findOneAndUpdate({ id: req.params.id }, { $set: req.body })
    .then((result) => {
      if (!result) {
        if (req.body.files.length) {
          deleteFile(req.body.files);
        }
        return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
      } else {
        return res.status(200).json({ message: `공지사항 게시판 글 수정 완료! (${result})` });
      }
    })
    .catch((err) => {
      if (req.body.files.length) {
        deleteFile(req.body.files);
      }
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
      } else {
      }
    });
};

export const like = (req, res, next) => {
  if (!req.params.id) {
    return res.status(404).json({ message: `추천할 게시글 번호가 없습니다. (${req.params.id}번)` });
  }
  if (!req.isLogged) {
    return res.status(403).json({ message: `추천 기능은 회원만 사용가능 합니다.` });
  }

  Notice.findOne({ id: req.params.id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
      }
      if (result.author && result.author.equals(req.user._id)) {
        return res.status(400).json({ message: `내가 쓴 게시글은 추천할 수 없습니다.` });
      }
      if (result.likes.includes(req.user._id)) {
        return res.status(400).json({ message: `이미 추천한 게시글입니다.` });
      }
      if (result.dislikes.includes(req.user._id)) {
        return res.status(400).json({ message: `이미 비추천한 게시글입니다. 추천할 수 없습니다.` });
      }
      Notice.findOneAndUpdate(
        { id: req.params.id },
        { $push: { likes: req.user._id }, $inc: { 'cnt.like': 1 } },
        { returnOriginal: false },
      )
        .then((result) => {
          if (!result) {
            return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
          } else {
            return res.status(200).json({ message: `공지사항 게시판 글 추천 완료!` });
          }
        })
        .catch((err) => {});
    })
    .catch((err) => {});
};

export const dislike = (req, res, next) => {
  if (!req.params.id) {
    return res.status(404).json({ message: `비추천할 게시글 번호가 없습니다. (${req.params.id}번)` });
  }
  if (!req.isLogged) {
    return res.status(403).json({ message: `비추천 기능은 회원만 사용가능 합니다.` });
  }

  Notice.findOne({ id: req.params.id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
      }
      if (result.author && result.author.equals(req.user._id)) {
        return res.status(400).json({ message: `내가 쓴 게시글은 비추천할 수 없습니다.` });
      }
      if (result.dislikes.includes(req.user._id)) {
        return res.status(400).json({ message: `이미 비추천한 게시글입니다.` });
      }
      if (result.likes.includes(req.user._id)) {
        return res.status(400).json({ message: `이미 추천한 게시글입니다. 비추천할 수 없습니다.` });
      }
      Notice.findOneAndUpdate(
        { id: req.params.id },
        { $push: { dislikes: req.user._id }, $inc: { 'cnt.dislike': 1 } },
        { returnOriginal: false },
      )
        .then((result) => {
          if (!result) {
            return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
          } else {
            return res.status(200).json({ message: `공지사항 게시판 글 비추천 완료!` });
          }
        })
        .catch((err) => {});
    })
    .catch((err) => {});
};

export const remove = (req, res, next) => {
  Notice.findOneAndDelete({ id: req.params.id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: `해당 게시글을 찾을 수 없습니다. (${req.params.id}번)` });
      } else {
        if (result.files.length) {
          deleteFile(result.files);
        }
        return res.status(200).json({ message: `공지사항 게시판 글 삭제 완료! (${result})` });
      }
    })
    .catch((err) => {});
};

export default {
  findAll,
  findById,
  create,
  update,
  like,
  dislike,
  remove,
};
