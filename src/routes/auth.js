import user from '../controllers/user.controller';
import { Router } from 'express';
import { isAuthentication } from '../middlewares/authJwt.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증, 로그인 관련 URI
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: 회원가입 하기
 *     description: 신규 회원정보를 생성합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         description: 가입할 이메일
 *         required: true
 *         type: string
 *       - name: name
 *         in: formData
 *         description: 가입할 닉네임
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         description: 가입할 비밀번호
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       400:
 *         description: 이메일/닉네임/비밀번호를 입력해 주세요.
 * /auth/signin:
 *   post:
 *     tags: [Auth]
 *     summary: 로그인 하기
 *     description: 회원정보를 바탕으로 로그인합니다. 로그인에 성공하면 JWT 인증 토큰값을 반환합니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         description: 로그인할 이메일
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         description: 로그인할 비밀번호
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       400:
 *         description: 이메일/비밀번호를 입력해 주세요.
 *       401:
 *         description: 비밀번호가 맞지 않습니다!
 *       404:
 *         description: 해당 회원을 찾을 수 없습니다.
 * /auth/check:
 *   get:
 *     tags: [Auth]
 *     summary: 토큰 검증하기
 *     description: JWT 인증 토큰값을 검증하고 검증에 성공하면 회원 기본 정보를 반환합니다.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 토큰 검증에 따른 JSON 데이터 요청 성공
 *     security:
 *       - JWT: []
 */

// 회원가입
router.post('/signup', user.signup);

// 로그인
router.post('/signin', user.signin);

// Front-End에서 받은 토큰이 올바른지 체크
router.get('/check', [isAuthentication], user.checkToken);

// swagger용 토큰 발급
router.get('/swagger', user.generateSwaggerToken);

export default router;
