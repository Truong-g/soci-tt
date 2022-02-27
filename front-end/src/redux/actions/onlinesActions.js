import { GET_ALL_ONLINES } from "../constants/onlinesConstant";

const getAllOnlineActions = payload => {
    return {
        type: GET_ALL_ONLINES,
        payload
    }
}

export {
    getAllOnlineActions
}