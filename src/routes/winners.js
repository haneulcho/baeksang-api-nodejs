import winners from '../controllers/winner.controller';

import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Winners
 *   description: 수상자 관련 URI
 * /winners/{id}:
 *   get:
 *     tags: [Winners]
 *     summary: 특정 회차 수상자 목록 보기
 *     description: 54~58회 백상예술대상의 특정 회차 수상자 목록을 가져옵니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 가져올 회차 (54~58)
 *         required: true
 *         type: integer
 *         minimum: 54
 *         maximum: 58
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 해당 회차 결과를 찾을 수 없습니다.
 * /winners/{id}/{division}:
 *   get:
 *     tags: [Winners]
 *     summary: 특정 회차 및 특정 부문 수상자 목록 보기
 *     description: 54~58회 백상예술대상의 특정 회차 및 특정 부문 수상자 목록을 가져옵니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 가져올 회차 (54~58)
 *         required: true
 *         type: integer
 *         minimum: 54
 *         maximum: 58
 *       - name: division
 *         in: path
 *         description: 가져올 부문 (tv/movie/play)
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 해당 회차 부문에 따른 결과를 찾을 수 없습니다.
 */

router.get('/:id', winners.findById);
router.get('/:id/:division', winners.findByDivision);

export default router;
