//import {MUser} from './models/user';
//import {MItem} from './models/item';

declare global {
  namespace Express {
    type User = MUser;
    interface Request {
      item?: MItem;
    }
  }
}
