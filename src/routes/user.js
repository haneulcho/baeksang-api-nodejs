import users from '../controllers/user.controller';
import authJwt from '../middlewares/authJwt.js';

import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 회원정보 관련 URI
 * /user:
 *   get:
 *     tags: [User]
 *     summary: 모든 회원정보 보기(관리자만)
 *     description: 관리자만 가입된 모든 회원정보를 열람할 수 있습니다. 인증 토큰값이 필요합니다.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 가입된 회원이 없습니다.
 *     security:
 *       - JWT: []
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: 내 회원정보 보기
 *     description: 로그인한 회원이 자신의 회원정보를 열람할 수 있습니다. 인증 토큰값이 필요합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 회원의 고유번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 잘못된 접근입니다.
 *     security:
 *       - JWT: []
 * /user/edit/{id}:
 *   put:
 *     tags: [User]
 *     summary: 내 회원정보 수정하기
 *     description: 로그인 한 회원이 자신의 회원정보를 수정할 수 있습니다. 인증 토큰값이 필요합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 회원의 고유번호
 *         required: true
 *         type: integer
 *       - name: name
 *         in: formData
 *         description: 수정할 닉네임
 *         required: false
 *         type: string
 *       - name: password
 *         in: formData
 *         description: 수정할 비밀번호
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 잘못된 접근입니다.
 *     security:
 *       - JWT: []
 * /user/delete/{id}:
 *   delete:
 *     tags: [User]
 *     summary: 내 회원정보 삭제/탈퇴하기
 *     description: 로그인 한 회원이 자신의 회원정보를 삭제/탈퇴할 수 있습니다. 인증 토큰값이 필요합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 회원의 고유번호
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 잘못된 접근입니다.
 *     security:
 *       - JWT: []
 */

// 모든 회원정보 보기(관리자만)
router.get('/', [authJwt.isAuthentication, authJwt.isAdmin], users.findAll);

// 회원정보 보기
router.get('/:id', [authJwt.isAuthentication, authJwt.isMember], users.findById);

// 회원정보 수정
router.put('/edit/:id', [authJwt.isAuthentication, authJwt.isMember], users.update);

// 회원 탈퇴
router.delete('/delete/:id', [authJwt.isAuthentication, authJwt.isMember], users.remove);

export default router;
