import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
import {
    GET_GROUP_PENDING,
    GET_GROUP_FAIL,
    GET_GROUP_SUCCESS,
    CREATE_GROUP,
    RESET_GROUP
} from '../constants/groupConstant'

const getAllGroupActions = (navigate=null) => async dispatch => {
    dispatch({type: GET_GROUP_PENDING})
    const reqOptions = createHeaders("GET", true)
    try {
        const response = await fetch(`${baseURL}/group`, reqOptions)
        if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
                dispatch({
                    type: GET_GROUP_SUCCESS,
                    data: resBody.data
                })
            }
        } else {
            dispatch(getAllGroupActions(navigate))
            // dispatch({ type: GET_GROUP_FAIL })
            // localStorage.removeItem("access_jwt")
            // if (navigate) {
            //     navigate("/dang-nhap")
            // }
        }
    } catch (error) {
        dispatch({ type: GET_GROUP_FAIL })
        localStorage.removeItem("access_jwt")
        if (navigate) {
            navigate("/dang-nhap")
        }
    }
}

const createGroupActions = payload => {
    return {
        type: CREATE_GROUP,
        payload
    }
}


const resetGroupActions = () => {
    return {
        type: RESET_GROUP,
    }
}

export {
    getAllGroupActions,
    createGroupActions,
    resetGroupActions
};
