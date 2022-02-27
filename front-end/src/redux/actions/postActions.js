
import createHeaders from "../../config/createHeaders"
import { baseURL } from "../../constants/constants"
import {
    GET_POST_FAIL,
    GET_POST_PENDING,
    GET_POST_SUCCESS,
    CREATE_POST,
    HANDLE_REACTION_POST,
    RESET_POST,
    ADD_POST,
    INCREASE_COMMENT_POST
} from "../constants/postConstants"


const getAllPostActions = (navigate=null) => async dispatch => {
    dispatch({type: GET_POST_PENDING})
    const reqOptions = createHeaders("GET", true)
    try {
        const response = await fetch(`${baseURL}/post`, reqOptions)
        if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
                dispatch({
                    type: GET_POST_SUCCESS,
                    payload: resBody.data
                })
            }
        } else {
            dispatch(getAllPostActions(navigate))
            // dispatch({ type: GET_POST_FAIL })
            // localStorage.removeItem("access_jwt")
            // if (navigate) {
            //     navigate("/dang-nhap")
            // }
        }
    } catch (error) {
        dispatch({ type: GET_POST_FAIL })
        localStorage.removeItem("access_jwt")
        if (navigate) {
            navigate("/dang-nhap")
        }
    }
}


const createPostActions = payload => {
    return {
        type: CREATE_POST,
        payload
    }
}

const handleReactionPostActions = payload => {
    return {
        type: HANDLE_REACTION_POST,
        payload
    }
}

const resetPostActions = () => {
    return {
        type: RESET_POST,
        
    }
}

const addPostActions = (payload) => {
    return {
        type: ADD_POST,
        payload
    }
}

const increaseCommentActions = payload => {
    return {
        type: INCREASE_COMMENT_POST,
        payload
    }
}

export {getAllPostActions, createPostActions, handleReactionPostActions, resetPostActions, addPostActions, increaseCommentActions};
