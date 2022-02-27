import { GET_ALL_ONLINES } from "../constants/onlinesConstant";
const initialState = {
    data : []
}
const onlineReducers = (state=initialState, action) => {
    switch (action.type) {
        case GET_ALL_ONLINES:
            return {
                data: action.payload
            }
        default:
            return state;
    }
}
export default onlineReducers