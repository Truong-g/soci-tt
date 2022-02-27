import {
    NOTIFICATION_MODAL,
    TOGGLE_LEFTBAR,
    TOGGLE_RIGHTBAR
} from '../constants/modalConstants'

const toggleLeftBarAction = payload => {
    return {
        type: TOGGLE_LEFTBAR,
        payload
    }
}

const toggleRightBarAction = payload => {
    return {
        type: TOGGLE_RIGHTBAR,
        payload
    }
}

const notificationModalAction = payload => {
    return {
        type: NOTIFICATION_MODAL,
        payload
    }
}

export {
    toggleLeftBarAction,
    toggleRightBarAction,
    notificationModalAction
}