import {
    GET_GROUP_PENDING,
    GET_GROUP_FAIL,
    GET_GROUP_SUCCESS,
    CREATE_GROUP,
    RESET_GROUP
} from '../constants/groupConstant'

const initialState = {
    pending: false,
    data: [],
    message: null,
    success: false
}

const groupReducers = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUP_PENDING:
            return {
                ...state,
                pending: true,
                success: false
            }
        case GET_GROUP_SUCCESS:
            {
                return {
                    ...state,
                    pending: false,
                    success: true,
                    data: action.data,
                    message: "Get group success"
                }
            }

        case CREATE_GROUP:
            return {
                ...state,
                data: [action.payload, ...state.data]
            }

        case GET_GROUP_FAIL:

            return {
                ...state,
                pending: false,
                success: false,
                message: "Get group fail"
            }

        case RESET_GROUP: {
            return {
                pending: false,
                data: [],
                message: null,
                success: false
            }
        }

        default:
            return state;
    }
}

export default groupReducers;
