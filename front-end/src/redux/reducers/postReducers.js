import {
    GET_POST_FAIL,
    GET_POST_PENDING,
    GET_POST_SUCCESS,
    CREATE_POST,
    HANDLE_REACTION_POST,
    RESET_POST,
    ADD_POST,
    INCREASE_COMMENT_POST
} from '../constants/postConstants'

const initialState = {
    pending: false,
    success: false,
    data: [],
    message: null,
    totalPage: null
}

const postReducers = (state = initialState, action) => {
    switch (action.type) {
        case GET_POST_PENDING:
            return {
                ...state,
                pending: true,
                success: false
            }
        case GET_POST_SUCCESS:
            {
            const newData = action.payload.data
            return {
                ...state,
                pending: false,
                success: true,
                data: newData,
                message: "Get POST success",
                totalPage: action.payload.last_page
            }
        }

        case CREATE_POST:
            return {
                ...state,
                data: [action.payload, ...state.data]
            }

        case HANDLE_REACTION_POST: {
            const newData = [...state.data]
            const indexData = state.data.findIndex(item => item.id === action.payload.tableId)
            const selectReactionData = state.data.find(item => item.id === action.payload.tableId)
            let selectReaction = state.data.find(item => item.id === action.payload.tableId).reaction

            const index1 = selectReaction.findIndex(item => item.user_id === action.payload.user_id && item.type_reaction === action.payload.typeReaction)
            if(index1 != -1){
                selectReaction.splice(index1, 1)
            }else{
                const index2 = selectReaction.findIndex(item => item.user_id === action.payload.user_id)
                if(index2 != -1){
                    selectReaction[index2] = {...selectReaction[index2], type_reaction: action.payload.typeReaction}
                }else{
                    selectReaction = [...selectReaction, {user_id: action.payload.user_id, type_reaction: action.payload.typeReaction, created_at: new Date(), updated_at: new Date()}]
                }

            }
            selectReactionData.reaction = selectReaction
            newData[indexData] = selectReactionData

            return {
                ...state,
                data: newData
            }
        }


        case GET_POST_FAIL:

            return {
                ...state,
                pending: false,
                success: false,
                message: "Get POST fail"
            }

            case RESET_POST: {
                return {
                    pending: false,
                    success: false,
                    data: [],
                    message: null,
                    totalPage: null
                }
            }

            case INCREASE_COMMENT_POST: {
                const copyData = [...state.data]
                const index = state.data.findIndex(item => item.id === action.payload)
                copyData[index].comment +=1
                return {
                    ...state,
                    data: copyData
                }
            }

            case ADD_POST: {
                return {
                    ...state,
                    data: [...state.data, ...action.payload]
                }
            }

        default:
            return state;
    }
}


export default postReducers;
