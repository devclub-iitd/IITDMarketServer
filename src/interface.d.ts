import {MUser} from './models/user';
import {MItem} from './models/item';

declare global {
  namespace Express {
    interface User extends MUser {}
  }
}

declare global {
  namespace Express {
    interface Request {
      item?: MItem;
    }
  }
}
