import replays from '../controllers/replay.controller';

import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Replays
 *   description: 다시보기(vod) 관련 URI
 * /replays:
 *   get:
 *     tags: [Replays]
 *     summary: 전체 다시보기(vod) 목록 보기
 *     description: 58~59회 백상예술대상의 전체 다시보기(vod) 목록을 가져옵니다.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 등록된 영상이 없습니다.
 * /replays/{awards_no}:
 *   get:
 *     tags: [Replays]
 *     summary: 특정 회차 다시보기(vod) 목록 보기
 *     description: 백상예술대상의 특정 회차 다시보기(vod) 목록을 가져옵니다.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: awards_no
 *         in: path
 *         description: 가져올 회차 (58~59)
 *         required: true
 *         type: integer
 *         minimum: 58
 *         maximum: 59
 *     responses:
 *       200:
 *         description: JSON 데이터 요청 성공
 *       404:
 *         description: 해당 회차 영상을 찾을 수 없습니다.
 */

router.get('/', replays.findAll);
router.get('/:awards_no', replays.findByAwardNumber);

export default router;
