import {
    GET_NOTIFICATION_PENDING,
    GET_NOTIFICATION_SUCCESS,
    GET_NOTIFICATION_FAIL,
    DELETE_NOTIFICATION,
    ADD_NOTIFICATION
} from '../constants/notificationConstant'


const initialState = {
    pending: false,
    success: false,
    data: [],
    message: null
}

const notificationReducers = (state = initialState, action) => {
    switch (action.type) {
        case GET_NOTIFICATION_PENDING: {
            return {
                pending: true,
                success: false,
                data: [],
                message: "pending"
            }
        }

        case GET_NOTIFICATION_SUCCESS: {
            return {
                pending: false,
                success: true,
                data: action.payload,
                message: "get success"
            }
        }

        case GET_NOTIFICATION_FAIL: {
            return {
                pending: false,
                success: false,
                data:[],
                message: "get fail"
            }
        }

        case DELETE_NOTIFICATION: {
            return {
                ...state,
                data: state.data.filter(item => item.id != action.payload)
            }
        }

        case ADD_NOTIFICATION: {
            return {
                ...state,
                data: [...state.data, action.payload]
            }
        }

        default:
            return state;
    }
}



export default notificationReducers