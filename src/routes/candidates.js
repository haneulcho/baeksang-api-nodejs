import candidates from '../controllers/candidate.controller';

import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: 후보자 관련 URI
 * /candidates:
 *   get:
 *     tags: [Candidates]
 *     summary: 전체 후보자 목록 보기
 *     description: 59회 백상예술대상의 전체 후보자 목록을 가져옵니다.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 등록된 후보가 없습니다.
 * /candidates/{division}:
 *   get:
 *     tags: [Candidates]
 *     summary: 특정 부문 후보자 목록 보기
 *     description: 59회 백상예술대상의 특정 부문 후보자 목록을 가져옵니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: division
 *         in: path
 *         description: 가져올 부문 (tv/movie/play)
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 해당 부문 후보를 찾을 수 없습니다.
 */

router.get('/', candidates.findAll);
router.get('/:division', candidates.findByDivision);

export default router;
