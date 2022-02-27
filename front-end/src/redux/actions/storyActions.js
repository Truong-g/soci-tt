import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
import {
    GET_STORY_PENDING,
    GET_STORY_FAIL,
    GET_STORY_SUCCESS,
    CREATE_STORY,
    RESET_STORY
} from '../constants/storyConstants'

const getAllStoryActions = (navigate=null) => async dispatch => {
    dispatch({type: GET_STORY_PENDING})
    const reqOptions = createHeaders("GET", true)
    try {
        const response = await fetch(`${baseURL}/stories`, reqOptions)
        if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
                dispatch({
                    type: GET_STORY_SUCCESS,
                    data: resBody.data
                })
            }
        } else {
            dispatch(getAllStoryActions(navigate))
            // dispatch({ type: GET_STORY_FAIL })
            // localStorage.removeItem("access_jwt")
            // if (navigate) {
            //     navigate("/dang-nhap")
            // }
        }
    } catch (error) {
        dispatch({ type: GET_STORY_FAIL })
        localStorage.removeItem("access_jwt")
        if (navigate) {
            navigate("/dang-nhap")
        }
    }
}

const createStoryActions = payload => {
    return {
        type: CREATE_STORY,
        payload
    }
}

const resetStoryActions = () => {
    return {
        type: RESET_STORY,
    }
}

export {
    getAllStoryActions,
    createStoryActions,
    resetStoryActions
};
