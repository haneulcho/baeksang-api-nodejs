import Notice from '../models/notice';
import NoticeComment from '../models/notice_comment';
import bcrypt from 'bcryptjs';

const myCustomLabels = {
  docs: 'itemsList',
  limit: 'itemPerPage',
  totalDocs: 'totalItemCount',
  totalPages: 'totalPageCount',
  page: 'currentPage',
};

export const create = (req, res, next) => {
  if (!req.params.pr_id) {
    return res.status(404).json({ message: `댓글을 작성할 게시글 번호가 없습니다. (${req.params.pr_id}번)` });
  }
  if (!req.body.contents) {
    return res.status(400).json({ message: '댓글 내용을 입력해 주세요.' });
  }
  if (!req.isLogged) {
    if (!req.body.name) {
      return res.status(400).json({ message: '닉네임을 입력해 주세요.' });
    }
    if (!req.body.password) {
      return res.status(400).json({ message: '비밀번호를 입력해 주세요.' });
    }
  }
  Notice.findOne({ id: req.params.pr_id })
    .then((parent_doc) => {
      if (!parent_doc) {
        return res.status(404).json({ message: `댓글을 작성할 게시글 번호가 없습니다. (${req.params.pr_id}번)` });
      }
      let password = null;

      if (!req.isLogged) {
        const salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(req.body.password, salt);
      }

      const noticeComment = new NoticeComment({
        pr_id: req.params.pr_id,
        author: req.isLogged ? req.user._id : null,
        display_name: req.isLogged ? req.user.name : req.body.name,
        contents: req.body.contents,
        password: req.isLogged ? null : password,
      });

      noticeComment
        .save()
        .then((comment) => {
          Notice.findOneAndUpdate(
            { id: req.params.pr_id },
            { $push: { comments: comment._id }, $inc: { 'cnt.comment': 1 } },
            { returnOriginal: false },
          )
            .then((result) => {
              console.log(`공지사항 게시판 게시글 코멘트 수 증가 완료!`);
              return res.status(201).json({ message: `공지사항 게시판 댓글 작성 완료! (${result})` });
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    })
    .catch((err) => {});
};

export const findAllByParentId = (req, res, next) => {
  if (!req.params.pr_id) {
    return res.status(404).json({ message: `댓글을 불러 올 게시글 번호가 없습니다. (${req.params.pr_id}번)` });
  }
  Notice.findOne({ id: req.params.pr_id })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: `댓글을 불러 올 게시글 번호가 없습니다. (${req.params.pr_id}번)` });
      } else {
        const options = {
          populate: {
            path: 'author',
            options: {
              select: 'name',
            },
          },
          page: req.query.page || 1,
          limit: req.query.size || 200,
          sort: { id: 1 },
          select: '-_id pr_id id author display_name contents created_at cnt',
          customLabels: myCustomLabels,
        };

        return NoticeComment.paginate({ pr_id: req.params.pr_id }, options);
      }
    })
    .then((result) => {
      if (!result || !result.itemsList.length) {
        return res.status(404).json({ message: '등록된 댓글이 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {});
};

export const update = (req, res, next) => {
  if (!req.body.contents) {
    return res.status(400).json({ message: '입력 필드에 내용을 입력해 주세요.' });
  }
  if (!req.params.pr_id) {
    return res.status(404).json({ message: `댓글을 수정할 부모 게시글 번호가 없습니다. (${req.params.pr_id}번)` });
  }
  if (!req.params.id) {
    return res.status(404).json({ message: `수정할 댓글 번호가 없습니다. (${req.params.id}번)` });
  }
  if (!req.isLogged) {
    if (!req.body.name) {
      return res.status(400).json({ message: '닉네임을 입력해 주세요.' });
    }
    if (!req.body.password) {
      return res.status(400).json({ message: '비밀번호를 입력해 주세요.' });
    }
  }
  Notice.findOne({ id: req.params.pr_id })
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ message: `댓글을 수정할 부모 게시글을 찾을 수 없습니다. (${req.params.pr_id}번)` });
      }
      NoticeComment.findOne({ pr_id: req.params.pr_id, id: req.params.id })
        .then((result) => {
          if (!result) {
            return res.status(404).json({ message: `수정할 댓글을 찾을 수 없습니다. (${req.params.id}번)` });
          }
          // 관리자가 아닐 때만 수정 권한 확인
          if (!req.isAdmin) {
            // 회원이 작성한 댓글이면,
            if (result.author) {
              if (!req.isLogged) {
                return res.status(400).json({ message: '댓글 수정 권한이 없습니다.' });
              } else if (!result.author.equals(req.user._id)) {
                return res.status(400).json({ message: '내가 쓴 댓글만 수정할 수 있습니다.' });
              }
            }
            // 비회원이 작성한 댓글이면,
            if (!result.author) {
              if (!req.body.password) {
                return res.status(400).json({ message: '비밀번호를 입력해 주세요.' });
              }
              if (!bcrypt.compareSync(req.body.password, result.password)) {
                return res.status(400).json({ message: '비밀번호가 맞지 않습니다!' });
              } else {
                req.body.password = result.password;
              }
            }
          }
          NoticeComment.findOneAndUpdate(
            { pr_id: req.params.pr_id, id: req.params.id },
            { $set: req.body },
            { returnOriginal: false },
          )
            .then((result) => {
              if (!result) {
                return res.status(404).json({ message: `수정할 댓글을 찾을 수 없습니다. (${req.params.id}번)` });
              } else {
                return res.status(200).json({ message: `공지사항 게시판 댓글 수정 완료!` });
              }
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    })
    .catch((err) => {});
};

export const like = (req, res, next) => {
  if (!req.params.pr_id) {
    return res.status(404).json({ message: `댓글을 추천할 부모 게시글 번호가 없습니다. (${req.params.pr_id}번)` });
  }
  if (!req.params.id) {
    return res.status(404).json({ message: `추천할 댓글 번호가 없습니다. (${req.params.id}번)` });
  }
  if (!req.isLogged) {
    return res.status(403).json({ message: `추천 기능은 회원만 사용가능 합니다.` });
  }
  Notice.findOne({ id: req.params.pr_id })
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ message: `댓글을 추천할 부모 게시글을 찾을 수 없습니다. (${req.params.pr_id}번)` });
      }
      NoticeComment.findOne({ pr_id: req.params.pr_id, id: req.params.id })
        .then((result) => {
          if (!result) {
            return res.status(404).json({ message: `해당 댓글을 찾을 수 없습니다. (${req.params.id}번)` });
          }
          if (result.author && result.author.equals(req.user._id)) {
            return res.status(400).json({ message: `내가 쓴 댓글은 추천할 수 없습니다.` });
          }
          if (result.likes.includes(req.user._id)) {
            return res.status(400).json({ message: `이미 추천한 댓글입니다.` });
          }
          if (result.dislikes.includes(req.user._id)) {
            return res.status(400).json({ message: `이미 비추천한 댓글입니다. 추천할 수 없습니다.` });
          }
          NoticeComment.findOneAndUpdate(
            { pr_id: req.params.pr_id, id: req.params.id },
            { $push: { likes: req.user._id }, $inc: { 'cnt.like': 1 } },
            { returnOriginal: false },
          )
            .then((result) => {
              if (!result) {
                return res.status(404).json({ message: `해당 댓글을 찾을 수 없습니다. (${req.params.id}번)` });
              } else {
                return res.status(200).json({ message: `공지사항 게시판 댓글 추천 완료!` });
              }
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    })
    .catch((err) => {});
};

export const dislike = (req, res, next) => {
  if (!req.params.pr_id) {
    return res.status(404).json({ message: `댓글을 비추천할 부모 게시글 번호가 없습니다. (${req.params.pr_id}번)` });
  }
  if (!req.params.id) {
    return res.status(404).json({ message: `비추천할 댓글 번호가 없습니다. (${req.params.id}번)` });
  }
  if (!req.isLogged) {
    return res.status(403).json({ message: `비추천 기능은 회원만 사용가능 합니다.` });
  }
  Notice.findOne({ id: req.params.pr_id })
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ message: `댓글을 비추천할 부모 게시글을 찾을 수 없습니다. (${req.params.pr_id}번)` });
      }
      NoticeComment.findOne({ pr_id: req.params.pr_id, id: req.params.id })
        .then((result) => {
          if (!result) {
            return res.status(404).json({ message: `해당 댓글을 찾을 수 없습니다. (${req.params.id}번)` });
          }
          if (result.author && result.author.equals(req.user._id)) {
            return res.status(400).json({ message: `내가 쓴 댓글은 비추천할 수 없습니다.` });
          }
          if (result.dislikes.includes(req.user._id)) {
            return res.status(400).json({ message: `이미 비추천한 댓글입니다.` });
          }
          if (result.likes.includes(req.user._id)) {
            return res.status(400).json({ message: `이미 추천한 댓글입니다. 비추천할 수 없습니다.` });
          }
          NoticeComment.findOneAndUpdate(
            { pr_id: req.params.pr_id, id: req.params.id },
            { $push: { dislikes: req.user._id }, $inc: { 'cnt.dislike': 1 } },
            { returnOriginal: false },
          )
            .then((result) => {
              if (!result) {
                return res.status(404).json({ message: `해당 댓글을 찾을 수 없습니다. (${req.params.id}번)` });
              } else {
                return res.status(200).json({ message: `공지사항 게시판 댓글 비추천 완료!` });
              }
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    })
    .catch((err) => {});
};

export const remove = (req, res, next) => {
  if (!req.params.pr_id) {
    return res.status(404).json({ message: `댓글을 삭제할 부모 게시글 번호가 없습니다. (${req.params.pr_id}번)` });
  }
  if (!req.isLogged && !req.body.password) {
    return res.status(400).json({ message: '비밀번호를 입력해 주세요.' });
  }
  Notice.findOne({ id: req.params.pr_id })
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ message: `댓글을 삭제할 부모 게시글을 찾을 수 없습니다. (${req.params.pr_id}번)` });
      }
      NoticeComment.findOne({ pr_id: req.params.pr_id, id: req.params.id })
        .then((result) => {
          if (!result) {
            return res.status(404).json({ message: `삭제할 댓글을 찾을 수 없습니다. (${req.params.id}번)` });
          }
          // 관리자가 아닐 때만 삭제 권한 확인
          if (!req.isAdmin) {
            // 회원이 작성한 댓글이면,
            if (result.author) {
              if (!req.isLogged) {
                return res.status(400).json({ message: '댓글 삭제 권한이 없습니다.' });
              } else if (!result.author.equals(req.user._id)) {
                return res.status(400).json({ message: '내가 쓴 댓글만 삭제할 수 있습니다.' });
              }
            }
            // 비회원이 작성한 댓글이면,
            if (!result.author) {
              if (!req.body.password) {
                return res.status(400).json({ message: '비밀번호를 입력해 주세요.' });
              }
              if (!bcrypt.compareSync(req.body.password, result.password)) {
                return res.status(400).json({ message: '비밀번호가 맞지 않습니다!' });
              }
            }
          }
          NoticeComment.findOneAndDelete({ pr_id: req.params.pr_id, id: req.params.id })
            .then((comment) => {
              Notice.findOneAndUpdate(
                { id: req.params.pr_id },
                { $pull: { comments: comment._id }, $inc: { 'cnt.comment': -1 } },
                { returnOriginal: false },
              )
                .then((result) => {
                  console.log(`공지사항 게시판 게시글 코멘트 수 감소 완료!`);
                  return res.status(200).json({ message: `공지사항 게시판 댓글 삭제 완료! (${result})` });
                })
                .catch((err) => {});
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    })
    .catch((err) => {});
};

export default {
  findAllByParentId,
  create,
  update,
  like,
  dislike,
  remove,
};
