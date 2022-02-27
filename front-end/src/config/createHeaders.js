


const createHeaders = (method, jwt=true, body=null) => {
    return {
        method: method,
        headers: jwt ? {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + JSON.parse(localStorage.getItem("access_jwt"))
        } : {
            "Content-Type": "application/json",
        },
        body: !!body ? JSON.stringify(body) : null
    }
}
export default createHeaders