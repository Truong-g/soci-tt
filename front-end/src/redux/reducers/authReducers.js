import {
    GET_PROFILE_FAIL,
    GET_PROFILE_PENDING,
    GET_PROFILE_SUCCESS,
    PUT_AVATAR,
    UPDATE_PROFILE,
    LOG_OUT
} from '../constants/authConstants'

const initialState = {
    pending: false,
    success: false,
    data: null,
    message: null
}

const authReducers = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROFILE_PENDING:
            return {
                ...state,
                pending: true,
                success: false
            }
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                data: action.payload,
                message: "Get profile success"
            }
        case UPDATE_PROFILE:
            return {
                ...state,
                data: action.payload
            }

        case PUT_AVATAR:
            return {
                ...state,
                data: { ...state.data, avatar: action.payload }
            }

        case LOG_OUT:
            return {
                pending: false,
                success: false,
                data: null,
                message: null
            }

        case GET_PROFILE_FAIL:

            return {
                ...state,
                pending: false,
                success: false,
                message: "Get profile fail"
            }



        default:
            return state;
    }
}


export default authReducers;
