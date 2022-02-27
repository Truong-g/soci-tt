import {
    GET_STORY_PENDING,
    GET_STORY_FAIL,
    GET_STORY_SUCCESS,
    CREATE_STORY,
    RESET_STORY
} from '../constants/storyConstants'

const initialState = {
    pending: false,
    data: [],
    message: null,
    success: false
}

const storyReducers = (state = initialState, action) => {
    switch (action.type) {
        case GET_STORY_PENDING:
            return {
                ...state,
                pending: true,
                success: false
            }
        case GET_STORY_SUCCESS:
            {
                return {
                    ...state,
                    pending: false,
                    success: true,
                    data: action.data,
                    message: "Get story success"
                }
            }

        case CREATE_STORY:
            return {
                ...state,
                data: [action.payload, ...state.data]
            }

        case GET_STORY_FAIL:

            return {
                ...state,
                pending: false,
                success: false,
                message: "Get story fail"
            }

        case RESET_STORY: {
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

export default storyReducers;
