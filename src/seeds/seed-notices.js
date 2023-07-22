import { dbConnection } from '../lib/connection';

import mongoose from 'mongoose';
import Notice from '../models/notice';
import JSON_NOTICES from './notices.json';

dbConnection();

// map, forEach를 사용하면 connection 에러 발생
// insertMany를 사용하면 sequence duplicate 오류 발생
// for 돌려서 save()로 데이터 집어 넣어야 함 -> 병렬로 처리되어 오류 생생
// 재귀로 순차 실행 처리하도록 수정
let count = 0;

function addNotice() {
  let notice = new Notice(JSON_NOTICES[count]);
  notice
    .save()
    .then((result) => {
      count++;
      if (count < JSON_NOTICES.length) {
        addNotice();
      }
      if (count === JSON_NOTICES.length) {
        console.log(`JSON_NOTICES 초기 데이터 입력 완료!`);
        exit();
      }
    })
    .catch((err) => {
      console.log(err);
      console.log(`JSON_NOTICES 초기 데이터를 입력하는 데 에러가 발생했습니다.`);
    });
}

addNotice();

function exit() {
  mongoose.disconnect();
}
