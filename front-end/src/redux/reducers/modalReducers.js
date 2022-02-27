

import {
    NOTIFICATION_MODAL,
    TOGGLE_LEFTBAR,
    TOGGLE_RIGHTBAR
} from '../constants/modalConstants'

const initialState = {
    leftBar: false,
    rightBar: false,
    notificationData: null
}

const modalReducers = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_LEFTBAR:
            return {
                ...state,
                leftBar: action.payload,
                rightBar:false
            }

        case TOGGLE_RIGHTBAR:
            return {
                ...state,
                rightBar: action.payload,
                leftBar: false
            }

        case NOTIFICATION_MODAL:{
            return {
                ...state,
                notificationData: action.payload
            }
        }

        default:
            return state;
    }
}

export default modalReducers
