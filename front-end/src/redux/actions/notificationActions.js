import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'

import { 
    GET_NOTIFICATION_PENDING,
    GET_NOTIFICATION_SUCCESS,
    GET_NOTIFICATION_FAIL,
    DELETE_NOTIFICATION,
    ADD_NOTIFICATION
 } from '../constants/notificationConstant'

 const getNotificationActions = (navigate=null) => async dispatch => {
    dispatch({type: GET_NOTIFICATION_PENDING})
    const reqOptions = createHeaders("GET", true)
    try {
        const response = await fetch(`${baseURL}/notification`, reqOptions)
        if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
                dispatch({
                    type: GET_NOTIFICATION_SUCCESS,
                    payload: resBody.data
                })
            }
        } else {
            dispatch(getNotificationActions(navigate))
            // dispatch({ type: GET_NOTIFICATION_FAIL })
            // localStorage.removeItem("access_jwt")
            // if (navigate) {
            //     navigate("/dang-nhap")
            // }
        }
    } catch (error) {
        dispatch({ type: GET_NOTIFICATION_FAIL })
        localStorage.removeItem("access_jwt")
        if (navigate) {
            navigate("/dang-nhap")
        }
    }
}

const deleteNotificationActions = payload => {
    return {
        type: DELETE_NOTIFICATION,
        payload
    }
}

const addNotificationActions = payload => {
    return {
        type: ADD_NOTIFICATION,
        payload
    }
}

export {
    getNotificationActions,
    deleteNotificationActions,
    addNotificationActions
}