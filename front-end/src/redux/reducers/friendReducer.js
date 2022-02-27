import {
    GET_FRIEND_FAIL,
    GET_FRIEND_PENDING,
    GET_FRIEND_SUCCESS,
    ADD_FRIEND,
    ACCEPT_FRIEND,
    CANCEL_FRIEND,
    RESET_FRIEND

} from "../constants/friendConstans"

const initialState = {
    pending: false,
    success: false,
    data: [],
    message: null,
}

const friendReducers = (state = initialState, action) => {
    switch (action.type) {
        case GET_FRIEND_PENDING:
            return {
                ...state,
                pending: true,
                success: false
            }
        case GET_FRIEND_SUCCESS:
            {
                return {
                    ...state,
                    pending: false,
                    success: true,
                    data: action.payload,
                    message: "Get friend success"
                }
            }
        case ADD_FRIEND: {
            return {
                ...state,
                data: [...state.data, action.payload]
            }
        }

        case ACCEPT_FRIEND: {
            const newData = [...state.data]
            const index = state.data.findIndex(item => item.passive_id === action.payload.profileId &&
                item.active_id === action.payload.userId && item.status_friend == 2)
            if (index != -1) {
                newData[index] = { ...newData[index], status_friend: 1 }
                return {
                    ...state,
                    data: newData
                }
            }
        }

        case CANCEL_FRIEND: {
            const newData = state.data.filter(item => item.id != action.payload)
            return {
                ...state,
                data: newData
            }
        }

        case GET_FRIEND_FAIL:

            return {
                ...state,
                pending: false,
                success: false,
                message: "Get friend fail"
            }


        case RESET_FRIEND: {
            return {
                pending: false,
                success: false,
                data: [],
                message: null,
            }
        }

        default:
            return state;
    }
}


export default friendReducers;
