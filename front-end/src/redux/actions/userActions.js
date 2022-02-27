import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
import {
    GET_USER_FAIL,
    GET_USER_SUCCESS,
    GET_USER_PENDING
} from '../constants/userConstants'


const getAllUserActions = (navigate=null) => async dispatch => {
    dispatch({type: GET_USER_PENDING})
    const reqOptions = createHeaders("GET", true)
    try {
        const response = await fetch(`${baseURL}/user`, reqOptions)
        if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
                dispatch({
                    type: GET_USER_SUCCESS,
                    payload: resBody.data
                })
            }
        } else {
            dispatch(getAllUserActions(navigate))
            // dispatch({ type: GET_USER_FAIL })
            // localStorage.removeItem("access_jwt")
            // if (navigate) {
            //     navigate("/dang-nhap")
            // }
        }
    } catch (error) {
        dispatch({ type: GET_USER_FAIL })
        localStorage.removeItem("access_jwt")
        if (navigate) {
            navigate("/dang-nhap")
        }
    }
}

export { getAllUserActions }