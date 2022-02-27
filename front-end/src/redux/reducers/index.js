import { combineReducers } from "redux";
import authReducers from "./authReducers";
import conversationReducers from "./conversationReducers";
import friendReducers from "./friendReducer";
import groupReducers from "./groupReducers";
import modalReducers from './modalReducers'
import notificationReducers from "./notificationReducers";
import onlineReducers from "./onlinesReducers";
import postReducers from "./postReducers";
import socketReducers from "./socketReducers";
import storyReducers from "./storyReducers";
import userReducers from "./userReducers";
const reducers = combineReducers({
    modal: modalReducers,
    auth: authReducers,
    post: postReducers,
    friend: friendReducers,
    story: storyReducers,
    group: groupReducers,
    conversation: conversationReducers,
    socket: socketReducers,
    notification: notificationReducers,
    user: userReducers,
    online: onlineReducers
})

export default (state, action) => reducers(state, action)