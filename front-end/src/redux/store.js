import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import reducers from './reducers'


const middleware = [thunk]

export const store = createStore(reducers, applyMiddleware(...middleware))