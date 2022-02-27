import {
    GET_USER_FAIL,
    GET_USER_SUCCESS,
    GET_USER_PENDING
} from '../constants/userConstants'


const initialState = {
    pending: false,
    success: false,
    data: [],
    message: null,
}

const userReducers = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_PENDING: {
            return {
                pending: true,
                success: false,
                message: "get message pending",
                data: []
            }
        }
        case GET_USER_SUCCESS: {
            return {
                pending: false,
                success: true,
                message: "success",
                data: action.payload
            }
        }
        case GET_USER_FAIL: {
            return {
                pending: false,
                success: false,
                message: "get message fail",
                data: []
            }
        }
        default:
            return state;
    }
}


export default userReducers