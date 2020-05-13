import express from 'express';
import {Request, Response} from 'express';

const app = express();

app.set('port', process.env.PORT || 5000);

app.get('/', (req:Request, res:Response) => {
  res.send('Welcome to the IITD Market Server !!');
});

export default app;
