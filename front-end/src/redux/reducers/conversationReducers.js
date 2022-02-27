import {
    GET_CONVERSATION_FAIL,
    GET_CONVERSATION_SUCCESS,
    GET_CONVERSATION_PENDING,
    SELECTED_CONVERSATION,
    ADD_CONVERSATION,
    RESET_CONVERSATION,
    ADD_LATEST_MSG,
    CHANGE_TOPIC,
    DELETE_CONVERSATION,
    LEAVE_GROUP_CONVERSATION,
    ADD_MEMBER_CONVERSATION,
    DELETE_MEMBER_CONVERSATION,
    CHANGE_INFOR_CONVERSATION

} from '../constants/conversationConstant'

const initialState = {
    pending: false,
    data: [],
    message: null,
    success: false,
    selectedConversation: null
}


const conversationReducers = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONVERSATION_PENDING:
            return {
                ...state,
                pending: true,
                success: false
            }
        case GET_CONVERSATION_SUCCESS:
            {
                return {
                    ...state,
                    pending: false,
                    success: true,
                    data: action.data,
                    message: "Get conversation success"
                }
            }

        case ADD_CONVERSATION:
            {
                return {
                    ...state,
                    data: [action.payload, ...state.data]
                }
            }

        case SELECTED_CONVERSATION:
            {
                return {
                    ...state,
                    selectedConversation: action.payload
                }
            }

        case RESET_CONVERSATION: {
            return {
                pending: false,
                data: [],
                message: null,
                success: false,
                selectedConversation: null
            }
        }

        case ADD_LATEST_MSG: {
            const index = state.data.findIndex(item => item.id === action.payload.id)
            state.data[index].latest_msg = action.payload.latest_msg
            state.data[index].latest_msg_person = action.payload.infor
            const copyData = [...state.data]
            return {
                ...state,
                data: copyData
            }
        }


        case CHANGE_TOPIC: {
            const index = state.data.findIndex(item => item.id === action.payload.convId)
            if (index != -1) {
                state.data[index].topic = action.payload.topic
                if (state.selectedConversation) {
                    if (state.selectedConversation.id === action.payload.convId) {
                        state.selectedConversation.topic = action.payload.topic
                        return {
                            ...state,
                            data: [...state.data],
                            selectedConversation: { ...state.selectedConversation }
                        }
                    } else {
                        return {
                            ...state,
                            data: [...state.data],
                        }
                    }
                } else {
                    return {
                        ...state,
                        data: [...state.data],
                    }
                }
            }
        }


        case GET_CONVERSATION_FAIL:

            return {
                ...state,
                pending: false,
                success: false,
                message: "Get conversation fail"
            }

        case DELETE_CONVERSATION: {
            if (state.selectedConversation) {
                return {
                    ...state,
                    data: [...state.data.filter(item => item.id !== action.payload.convId)],
                    selectedConversation: state.selectedConversation.id === action.payload.convId ? null : state.selectedConversation
                }
            } else {
                return {
                    ...state,
                    data: [...state.data.filter(item => item.id !== action.payload.convId)],
                }
            }

        }

        case LEAVE_GROUP_CONVERSATION: {
            return {
                ...state,
                data: [...state.data.filter(item => item.id !== action.payload.convId)],
                selectedConversation: null
            }
        }

        case ADD_MEMBER_CONVERSATION: {
            const index = state.data.findIndex(item => item.id === action.payload.convId)
            if(index != -1){
                state.data[index].member = [...state.data[index].member, action.payload.user]
                const copyData = [...state.data]
                return {
                    ...state,
                    data: copyData
                }
            }
        }

        case DELETE_MEMBER_CONVERSATION: {
            const index = state.data.findIndex(item => item.id === action.payload.convId)
            if(index != -1){
                const newMembers = state.data[index].member.filter(item => {
                    return item.id !== action.payload.userId
                })
                state.data[index].member = newMembers
                return {
                    ...state,
                    data: [...state.data]
                }
            }
        }

        case CHANGE_INFOR_CONVERSATION: {
            const index = state.data.findIndex(item => item.id === action.payload.convId)
            if(action.payload.hasAvatar){
                state.data[index].conv_name = action.payload.name
                state.data[index].avatar = action.payload.avatar
            }else{
                state.data[index].conv_name = action.payload.name
            }
            return {
                ...state,
                data: [...state.data]
            }
        }
        default:
            return state;
    }
}

export default conversationReducers;
