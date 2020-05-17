import {mUser} from './models/user';
import {mItem} from './models/item';

declare global {
  namespace Express {
    interface User extends mUser {}
  }
}

declare global {
  namespace Express {
    interface Request {
      item?: mItem;
    }
  }
}
