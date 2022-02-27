

import {
    GET_PROFILE_FAIL,
    GET_PROFILE_PENDING,
    GET_PROFILE_SUCCESS,
    PUT_AVATAR,
    UPDATE_PROFILE,
    LOG_OUT
} from '../constants/authConstants'
import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
import { type } from '@testing-library/user-event/dist/type'



const getProfileActions = (navigate = null) => async dispatch => {
    dispatch({ type: GET_PROFILE_PENDING })
    const reqOptions = createHeaders("POST", true)
    try {
        const response = await fetch(`${baseURL}/user/profile`, reqOptions)
        if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
                dispatch({
                    type: GET_PROFILE_SUCCESS,
                    payload: resBody.data
                })
            }
        } else {
            dispatch({ type: GET_PROFILE_FAIL })
            localStorage.removeItem("access_jwt")
            if (navigate) {
                navigate("/dang-nhap")
            }
        }
    } catch (error) {
        dispatch({ type: GET_PROFILE_FAIL })
        localStorage.removeItem("access_jwt")
        if (navigate) {
            navigate("/dang-nhap")
        }
    }
}

const updateProfileActions = payload => {
    return {
        type: UPDATE_PROFILE,
        payload
    }
}

const putAvatarActions = payload => {
    return {
        type: PUT_AVATAR,
        payload
    }
}

const logOutActions = (navigate) => async dispatch => {
    const reqOptions = createHeaders("POST", true)
    try {
        const response = await fetch(`${baseURL}/user/logout`, reqOptions)
        if(response.ok ){
            const resBody = await response.json()
            if(resBody){
                localStorage.removeItem("access_jwt")
                navigate("/dang-nhap")
            }
        }else{

        }
    } catch (error) {
        
    }
}

export {
    getProfileActions,
    updateProfileActions,
    putAvatarActions,
    logOutActions
}