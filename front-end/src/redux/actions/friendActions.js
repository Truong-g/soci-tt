
import createHeaders from "../../config/createHeaders"
import { baseURL } from "../../constants/constants"
import {
    ACCEPT_FRIEND,
    ADD_FRIEND,
    CANCEL_FRIEND,
    GET_FRIEND_FAIL,
    GET_FRIEND_PENDING,
    GET_FRIEND_SUCCESS,
    RESET_FRIEND,
    
} from "../constants/friendConstans"


const getAllFriendActions = (navigate=null) => async dispatch => {
    dispatch({type: GET_FRIEND_PENDING})
    const reqOptions = createHeaders("GET", true)
    try {
        const response = await fetch(`${baseURL}/friends`, reqOptions)
        if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
                dispatch({
                    type: GET_FRIEND_SUCCESS,
                    payload: resBody.data
                })
            }
        } else {
            dispatch(getAllFriendActions(navigate))
            // dispatch({ type: GET_FRIEND_FAIL })
            // localStorage.removeItem("access_jwt")
            // if (navigate) {
            //     navigate("/dang-nhap")
            // }
        }
    } catch (error) {
        dispatch({ type: GET_FRIEND_FAIL })
        localStorage.removeItem("access_jwt")
        if (navigate) {
            navigate("/dang-nhap")
        }
    }
}

const addFriendActions = payload => {
    return {
        type: ADD_FRIEND,
        payload
    }
}

const acceptFriendActions = payload => {
    return {
        type: ACCEPT_FRIEND,
        payload
    }
}

const cancelFriendActions = payload => {
    return {
        type: CANCEL_FRIEND,
        payload
    }
}

const resetFriendActions = () => {
    return {
        type: RESET_FRIEND,
    }
}



export {
    getAllFriendActions,
    addFriendActions,
    acceptFriendActions,
    cancelFriendActions,
    resetFriendActions
};
