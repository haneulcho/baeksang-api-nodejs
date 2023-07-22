import notices from '../controllers/notice.controller';
import noticesComments from '../controllers/notice_comment.controller';
import { Router } from 'express';

import authJwt from '../middlewares/authJwt.js';
import fileUpload from '../middlewares/fileUpload.js';

import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notice
 *   description: 공지사항 게시판 관련 URI
 * /notice:
 *   get:
 *     tags: [Notice]
 *     summary: 모든 공지사항 게시글 보기
 *     description: 저장된 모든 공지사항 게시글을 열람할 수 있습니다.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 등록된 게시글이 없습니다.
 * /notice?page=n&size=n:
 *   get:
 *     tags: [Notice]
 *     summary: 페이징 처리한 공지사항 게시글 보기
 *     description: query에 전달한 page값, size값을 바탕으로 공지사항 게시글 중 페이징 처리된 목록을 반환합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: page
 *         description: 게시글 페이징 처리 시 가져올 페이지 번호 (최소 1부터)
 *         type: integer
 *         minimum: 1
 *         default: 1
 *         required: true
 *       - in: query
 *         name: size
 *         description: 게시글 페이징 처리 시 한 번에 불러 올 게시글 수 (최소 2부터)
 *         type: integer
 *         minimum: 2
 *         default: 10
 *         required: true
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 등록된 게시글이 없습니다.
 * /notice/{id}:
 *   get:
 *     tags: [Notice]
 *     summary: 특정 공지사항 게시글 보기
 *     description: 특정 공지사항 게시글을 열람할 수 있습니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 공지사항 게시글 고유번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 해당 게시글을 찾을 수 없습니다.
 * /notice/add:
 *   post:
 *     tags: [Notice]
 *     summary: 공지사항 새 게시글 작성하기
 *     description: 공지사항 게시판에 새로운 게시글을 작성합니다. 회원만 작성 가능하므로 인증 토큰값이 필요합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: title
 *         in: formData
 *         description: 게시글 제목
 *         required: true
 *         type: string
 *       - name: contents
 *         in: formData
 *         description: 게시글 내용
 *         required: true
 *         type: string
 *       - name: images
 *         in: formData
 *         description: 게시글에 삽입할 첨부파일 (jpg, jpeg, png, gif)
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       400:
 *         description: 글 제목/글 내용을 입력해 주세요.
 *       404:
 *         description: 잘못된 접근입니다.
 *     security:
 *       - JWT: []
 * /notice/update/{id}:
 *   put:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 수정하기
 *     description: 공지사항 게시판에 작성된 게시글을 수정할 수 있습니다. 자신의 게시글일 경우 또는 관리자만 수정 가능하므로 인증 토큰값이 필요합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 공지사항 게시글 고유번호
 *         required: true
 *         type: integer
 *       - name: title
 *         in: formData
 *         description: 수정할 게시글 제목
 *         required: false
 *         type: string
 *       - name: contents
 *         in: formData
 *         description: 수정할 게시글 내용
 *         required: false
 *         type: string
 *       - name: images
 *         in: formData
 *         description: 수정/삭제할 첨부파일 (jpg, jpeg, png, gif)
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       400:
 *         description: 입력 필드에 내용을 입력해 주세요.
 *       404:
 *         description: 해당 게시글을 찾을 수 없습니다.
 *     security:
 *       - JWT: []
 * /notice/delete/{id}:
 *   delete:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 삭제하기
 *     description: 공지사항 게시판에 작성된 게시글을 삭제할 수 있습니다. 자신의 게시글일 경우 또는 관리자만 삭제 가능하므로 인증 토큰값이 필요합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 공지사항 게시글 고유번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 해당 게시글을 찾을 수 없습니다.
 *     security:
 *       - JWT: []
 * /notice/like/{id}:
 *   put:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 좋아요(추천)하기
 *     description: 공지사항 게시판에 작성된 게시글을 좋아요(추천)할 수 있습니다. 좋아요(추천)/싫어요(비추천)는 게시글 당 1회, 회원만 사용 가능합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 공지사항 게시글 고유번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       400:
 *         description: 내가 쓴 게시글은 추천할 수 없습니다. / 이미 추천한 게시글입니다. / 이미 비추천한 게시글입니다. 추천할 수 없습니다.
 *       403:
 *         description: 추천 기능은 회원만 사용가능 합니다.
 *       404:
 *         description: 해당 게시글을 찾을 수 없습니다.
 *     security:
 *       - JWT: []
 * /notice/dislike/{id}:
 *   put:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 싫어요(비추천)하기
 *     description: 공지사항 게시판에 작성된 게시글을 싫어요(비추천)할 수 있습니다. 좋아요(추천)/싫어요(비추천)는 게시글 당 1회, 회원만 사용 가능합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 공지사항 게시글 고유번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       400:
 *         description: 내가 쓴 게시글은 비추천할 수 없습니다. / 이미 비추천한 게시글입니다. / 이미 추천한 게시글입니다. 비추천할 수 없습니다.
 *       403:
 *         description: 비추천 기능은 회원만 사용가능 합니다.
 *       404:
 *         description: 해당 게시글을 찾을 수 없습니다.
 *     security:
 *       - JWT: []
 * /notice/{pr_id}/comment?page=n&size=n:
 *   get:
 *     tags: [Notice]
 *     summary: 페이징 처리한 특정 공지사항 게시글 댓글 보기
 *     description: query에 전달한 page값, size값을 바탕으로 특정 공지사항 게시글의 페이징 처리된 댓글을 반환합니다. page값, size값이 없으면 한 번에 200개의 댓글을 불러옵니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pr_id
 *         in: path
 *         description: 공지사항 댓글의 부모 게시글 고유번호
 *         required: true
 *         type: integer
 *       - in: query
 *         name: page
 *         description: 댓글 페이징 처리 시 가져올 페이지 번호 (최소 1부터)
 *         type: integer
 *         minimum: 1
 *         default: 1
 *         required: false
 *       - in: query
 *         name: size
 *         description: 댓글 페이징 처리 시 한 번에 불러 올 게시글 수 (최소 2부터)
 *         type: integer
 *         minimum: 2
 *         default: 200
 *         required: false
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 댓글을 불러 올 게시글 번호가 없습니다. | 등록된 댓글이 없습니다.
 * /notice/{pr_id}/comment/add:
 *   post:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 새 댓글 작성하기
 *     description: 공지사항 게시판 게시글에 새로운 댓글을 작성합니다. 비회원도 댓글을 작성할 수 있습니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pr_id
 *         in: path
 *         description: 공지사항 댓글의 부모 게시글 고유번호
 *         required: true
 *         type: integer
 *       - name: name
 *         in: formData
 *         description: 닉네임
 *         required: false
 *         type: string
 *       - name: password
 *         in: formData
 *         description: 비밀번호
 *         required: false
 *         type: string
 *       - name: contents
 *         in: formData
 *         description: 댓글 내용
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       201:
 *         description: 공지사항 게시판 댓글 작성 완료!
 *       400:
 *         description: 댓글 내용/닉네임/비밀번호를 입력해 주세요.
 *       404:
 *         description: 댓글을 작성할 게시글 번호가 없습니다.
 *     security:
 *       - JWT: []
 * /notice/{pr_id}/comment/update/{id}:
 *   put:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 댓글 수정하기
 *     description: 공지사항 게시판에 작성된 댓글을 수정할 수 있습니다. 비회원도 댓글을 작성할 수 있습니다. 회원의 댓글일 경우 작성자 또는 관리자만 수정 가능하므로 인증 토큰값이 필요합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pr_id
 *         in: path
 *         description: 공지사항 댓글의 부모 게시글 고유번호
 *         required: true
 *         type: integer
 *       - name: id
 *         in: path
 *         description: 공지사항 댓글 고유번호
 *         required: true
 *         type: integer
 *       - name: name
 *         in: formData
 *         description: 수정할 닉네임
 *         required: false
 *         type: string
 *       - name: password
 *         in: formData
 *         description: 원래 댓글 비밀번호
 *         required: false
 *         type: string
 *       - name: contents
 *         in: formData
 *         description: 수정할 댓글 내용
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       201:
 *         description: 공지사항 게시판 댓글 수정 완료!
 *       400:
 *         description: 댓글 내용/닉네임/비밀번호를 입력해 주세요.
 *       404:
 *         description: 댓글을 수정할 게시글 번호가 없습니다.
 *     security:
 *       - JWT: []
 * /notice/{pr_id}/comment/delete/{id}:
 *   delete:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 댓글 삭제하기
 *     description: 공지사항 게시판 게시글에 작성된 댓글을 삭제합니다. 비밀번호가 일치해야 댓글을 삭제할 수 있습니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pr_id
 *         in: path
 *         description: 공지사항 댓글의 부모 게시글 고유번호
 *         required: true
 *         type: integer
 *       - name: id
 *         in: path
 *         description: 공지사항 댓글 고유번호
 *         required: true
 *         type: integer
 *       - name: password
 *         in: formData
 *         description: 비밀번호
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       201:
 *         description: 공지사항 게시판 댓글 삭제 완료!
 *       400:
 *         description: 댓글 삭제 권한이 없습니다. / 내가 쓴 댓글만 삭제할 수 있습니다.
 *       401:
 *         description: 비밀번호가 맞지 않습니다!
 *       404:
 *         description: 댓글을 삭제할 게시글 번호가 없습니다. | 해당 댓글을 찾을 수 없습니다.
 *     security:
 *       - JWT: []
 * /notice/{pr_id}/comment/like/{id}:
 *   put:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 댓글 좋아요(추천)하기
 *     description: 공지사항 게시판에 작성된 댓글을 좋아요(추천)할 수 있습니다. 좋아요(추천)/싫어요(비추천)는 댓글 당 1회, 회원만 사용 가능합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pr_id
 *         in: path
 *         description: 공지사항 댓글의 부모 게시글 고유번호
 *         required: true
 *         type: integer
 *       - name: id
 *         in: path
 *         description: 공지사항 댓글 고유번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       400:
 *         description: 내가 쓴 댓글은 추천할 수 없습니다. / 이미 추천한 댓글입니다. / 이미 비추천한 댓글입니다. 추천할 수 없습니다.
 *       403:
 *         description: 추천 기능은 회원만 사용가능 합니다.
 *       404:
 *         description: 댓글의 부모 게시글 번호가 없습니다. | 해당 댓글을 찾을 수 없습니다.
 *     security:
 *       - JWT: []
 * /notice/{pr_id}/comment/dislike/{id}:
 *   put:
 *     tags: [Notice]
 *     summary: 공지사항 게시글 댓글 싫어요(비추천)하기
 *     description: 공지사항 게시판에 작성된 댓글을 싫어요(비추천)할 수 있습니다. 좋아요(추천)/싫어요(비추천)는 댓글 당 1회, 회원만 사용 가능합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: pr_id
 *         in: path
 *         description: 공지사항 댓글의 부모 게시글 고유번호
 *         required: true
 *         type: integer
 *       - name: id
 *         in: path
 *         description: 공지사항 댓글 고유번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       400:
 *         description: 내가 쓴 댓글은 비추천할 수 없습니다. / 이미 비추천한 댓글입니다. / 이미 추천한 댓글입니다. 비추천할 수 없습니다.
 *       403:
 *         description: 비추천 기능은 회원만 사용가능 합니다.
 *       404:
 *         description: 댓글의 부모 게시글 번호가 없습니다. | 해당 댓글을 찾을 수 없습니다.
 *     security:
 *       - JWT: []
 */

router.get('/', notices.findAll);
router.get('/:id', notices.findById);

// 글작성, 글수정 관리자만
router.post('/add', [authJwt.isAuthentication, authJwt.isAdmin, fileUpload.uploadImage], notices.create);
router.put('/update/:id', [authJwt.isAuthentication, authJwt.isAdmin, fileUpload.uploadImage], notices.update);

// 글추천/비추천
router.put('/like/:id', [authJwt.isAuthentication, authJwt.isMember], notices.like);
router.put('/dislike/:id', [authJwt.isAuthentication, authJwt.isMember], notices.dislike);

// 글삭제 관리자만
router.delete('/delete/:id', [authJwt.isAuthentication, authJwt.isAdmin], notices.remove);

// 댓글 가져오기
router.get('/:pr_id/comment', noticesComments.findAllByParentId);

// 댓글작성, 댓글수정
router.post('/:pr_id/comment/add', [authJwt.isAuthentication], noticesComments.create);
router.put('/:pr_id/comment/update/:id', [authJwt.isAuthentication], noticesComments.update);

// 댓글추천/비추천
router.put('/:pr_id/comment/like/:id', [authJwt.isAuthentication, authJwt.isMember], noticesComments.like);
router.put('/:pr_id/comment/dislike/:id', [authJwt.isAuthentication, authJwt.isMember], noticesComments.dislike);

// 댓글삭제
router.delete('/:pr_id/comment/delete/:id', [authJwt.isAuthentication], noticesComments.remove);

export default router;
