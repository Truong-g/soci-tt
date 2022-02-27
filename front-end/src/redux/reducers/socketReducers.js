import socketIO from 'socket.io-client';
import {
    JOIN_SOCKET_SERVER
} from '../constants/socketConstant'
const ENDPOINT = 'https://soci-tt-skio.herokuapp.com/'

const initialState = {
    server: null
}

const socketReducers = (state=initialState, action) => {
    switch (action.type) {
        case JOIN_SOCKET_SERVER:{
            return {
                ...state,
                server: socketIO(ENDPOINT, {transports: ["websocket"]})
            }
        }
    
        default:
            return state;
    }
}

export default socketReducers