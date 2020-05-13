import { IUser } from './models/user'
import { IItem } from './models/item'

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}

declare global {
    namespace Express {
        interface Request {item?:IItem}
    }
}