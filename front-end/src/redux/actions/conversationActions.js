import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
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
    DELETE_MEMBER_CONVERSATION,
    ADD_MEMBER_CONVERSATION,
    CHANGE_INFOR_CONVERSATION
} from '../constants/conversationConstant'


const getConversationActions = (navigate=null) => async dispatch => {
    dispatch({type: GET_CONVERSATION_PENDING})
    const reqOptions = createHeaders("GET", true)
    try {
        const response = await fetch(`${baseURL}/conversation`, reqOptions)
        if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
                dispatch({
                    type: GET_CONVERSATION_SUCCESS,
                    data: resBody.data
                })
            }
        } else {
            dispatch(getConversationActions(navigate))
            // dispatch({ type: GET_CONVERSATION_FAIL })
            // localStorage.removeItem("access_jwt")
            // if (navigate) {
            //     navigate("/dang-nhap")
            // }
        }
    } catch (error) {
        dispatch({ type: GET_CONVERSATION_FAIL })
        localStorage.removeItem("access_jwt")
        if (navigate) {
            navigate("/dang-nhap")
        }
    }
}

const selectedConversationActions = payload => {
    return {
        type: SELECTED_CONVERSATION,
        payload
    }
}

const addConversationActions = payload => {
    return {
        type: ADD_CONVERSATION,
        payload
    }
}

const resetConversationActions = () => {
    return {
        type: RESET_CONVERSATION,
    }
}

const addLatestMsgAction = payload => {
    return {
        type: ADD_LATEST_MSG,
        payload
    }
}

const changeTopicActions = payload => {
    return {
        type: CHANGE_TOPIC,
        payload
    }
}

const deleteConversationActions = payload => {
    return {
        type: DELETE_CONVERSATION,
        payload
    }
}

const leaveGroupConversationActions = payload => {
    return {
        type: LEAVE_GROUP_CONVERSATION,
        payload
    }
}

const addMemberConversationActions = payload => {
    return {
        type: ADD_MEMBER_CONVERSATION,
        payload
    }
}
const deleteMemberConversationActions = payload => {
    return {
        type: DELETE_MEMBER_CONVERSATION,
        payload
    }
}

const changeInforConversationActions = payload => {
    return {
        type: CHANGE_INFOR_CONVERSATION,
        payload
    }
}

export {
    getConversationActions,
    selectedConversationActions,
    addConversationActions,
    resetConversationActions,
    addLatestMsgAction,
    changeTopicActions,
    deleteConversationActions,
    leaveGroupConversationActions,
    addMemberConversationActions,
    deleteMemberConversationActions,
    changeInforConversationActions
}