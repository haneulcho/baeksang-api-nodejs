import { config } from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

export const dbConnection = async () => {
  if (process.env.NODE_ENV === 'production') {
    config({ path: path.resolve(process.cwd(), '.env.production') });
    console.log('프로덕션 모드 접속 완료!');
  } else if (process.env.NODE_ENV === 'development') {
    config({ path: path.resolve(process.cwd(), '.env.development') });
    console.log('개발 모드 접속 완료!');
  }

  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }

  try {
    const db = mongoose.connection;

    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST } = process.env;
    const uri = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(
      MONGODB_PASSWORD,
    )}@${MONGODB_HOST}/?retryWrites=true&w=majority`;

    console.log(uri);
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      dbName: 'baeksang',
    });
    console.log('데이터베이스 접속 성공!');

    db.on('error', () => {
      console.log('통신 오류가 발생했습니다!');
    });

    db.on('disconnected', () => {
      console.log('연결이 끊겼습니다. 연결을 재시도합니다.');
    });

    process.on('SIGINT', () => {
      console.log('서버 연결을 해제헸습니다.');
      process.exit(0);
    });
  } catch (error) {
    return console.log('데이터베이스에 접속하는 중 문제가 발생했습니다!' + error);
  }
};
