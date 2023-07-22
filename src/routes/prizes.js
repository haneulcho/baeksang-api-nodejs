import prizes from '../controllers/prize.controller';

import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Prizes
 *   description: 상 관련 URI
 * /prizes:
 *   get:
 *     tags: [Prizes]
 *     summary: 전체 상 목록 보기
 *     description: 59회 백상예술대상의 전체 상 목록을 가져옵니다.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 등록된 상이 없습니다.
 * /prizes/{division}:
 *   get:
 *     tags: [Prizes]
 *     summary: 특정 부문 상 목록 보기
 *     description: 59회 백상예술대상의 특정 부문 상 목록을 가져옵니다.
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
 *         description: 해당 부문을 찾을 수 없습니다.
 * /prizes/{division}/{code}:
 *   get:
 *     tags: [Prizes]
 *     summary: 특정 부문 상 정보 보기
 *     description: 59회 백상예술대상의 특정 부문 상 정보를 가져옵니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: division
 *         in: path
 *         description: 가져올 부문 (tv/movie/play)
 *         required: true
 *         type: string
 *       - name: code
 *         in: path
 *         description: 상 코드 (ex. t01)
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 해당 상을 찾을 수 없습니다.
 */

router.get('/', prizes.findAll);
router.get('/:division', prizes.findByDivision);
router.get('/:division/:code', prizes.findByPrizeCode);

export default router;
