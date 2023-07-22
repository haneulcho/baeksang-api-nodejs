import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { dbConnection } from './lib/connection';
import authRouter from './routes/auth';
import candidatesRouter from './routes/candidates';
import indexRouter from './routes/index';
import noticeRouter from './routes/notice';
import prizesRouter from './routes/prizes';
import replaysRouter from './routes/replays';
import userRouter from './routes/user';
import winnersRouter from './routes/winners';

const app = express();

dbConnection();

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});

app.use('/', indexRouter);
app.use('/api/prizes', prizesRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/winners', winnersRouter);
app.use('/api/replays', replaysRouter);
app.use('/api/notice', noticeRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server is listening on port 3000');
});

app.use('/robots.txt', (req, res, next) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

const options = {
  openapi: '3.0.0',
  definition: {
    info: {
      title: '백상예술대상 API',
      version: '1.0.0',
      description:
        '백상예술대상 클론코딩을 위한 API 문서입니다. API 문서 제작에는 [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express), [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc) NPM 모듈을 사용했습니다.',
      contact: {
        email: 'haneulcho@nexon.co.kr',
      },
    },
    basePath: '/api',
    securityDefinitions: {
      JWT: {
        description: `${process.env.SITE_URL}/api/auth/swagger 에서 발급한 토큰값을 Value에 붙여 넣으세요.`,
        type: 'apiKey',
        name: 'x-access-token',
        in: 'header',
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
