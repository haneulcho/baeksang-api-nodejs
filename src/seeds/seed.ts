import { dbConnection } from '../lib/connection';

import mongoose from 'mongoose';

import Prize from '../models/prize';
import Candidate from '../models/candidate';
import Winner from '../models/winner';
import Replay from '../models/replay';
import JSON_PRIZES from './prizes.json';
import JSON_CANDIDATES from './candidates.json';
import JSON_WINNERS from './winners.json';
import JSON_REPLAYS from './replays.json';

dbConnection();

const setPrize = async () => {
  const count = await Prize.countDocuments({});
  console.log('Prize 데이터 수: ', count);

  if (count === 0) {
    Prize.insertMany(JSON_PRIZES)
      .then((docs) => {
        if (docs) {
          console.log('JSON_PRIZES 초기 데이터 입력 완료!');
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('JSON_PRIZES 초기 데이터를 입력하는 데 에러가 발생했습니다.');
      });
  }
};

const setCandidate = async () => {
  const count = await Candidate.countDocuments({});
  console.log('Candidate 데이터 수: ', count);

  if (count === 0) {
    Candidate.insertMany(JSON_CANDIDATES)
      .then((docs) => {
        if (docs) {
          console.log('JSON_CANDIDATES 초기 데이터 입력 완료!');
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('JSON_CANDIDATES 초기 데이터를 입력하는 데 에러가 발생했습니다.');
      });
  }
};

const setWinner = async () => {
  const count = await Winner.countDocuments({});
  console.log('Winner 데이터 수: ', count);

  if (count === 0) {
    Winner.insertMany(JSON_WINNERS)
      .then((docs) => {
        if (docs) {
          console.log('JSON_WINNERS 초기 데이터 입력 완료!');
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('JSON_WINNERS 초기 데이터를 입력하는 데 에러가 발생했습니다.');
      });
  }
};

const setReply = async () => {
  const count = await Replay.countDocuments({});
  console.log('Replay 데이터 수: ', count);

  if (count === 0) {
    Replay.insertMany(JSON_REPLAYS)
      .then((docs) => {
        if (docs) {
          console.log('JSON_REPLAYS 초기 데이터 입력 완료!');
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('JSON_REPLAYS 초기 데이터를 입력하는 데 에러가 발생했습니다.');
      });
  }
};

setPrize();
setCandidate();
setWinner();
setReply();

function exit() {
  mongoose.disconnect();
}
