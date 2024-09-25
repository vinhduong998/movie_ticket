import { combineReducers } from 'redux';

import user from "./reducers/user.reducer"
import home from "./reducers/home.reducer"
/**
 * Reg and import store from here ...
 */

const rootReducer = combineReducers({
  user,
  home
});

export default rootReducer;

export type RootReducer = ReturnType<typeof rootReducer>
