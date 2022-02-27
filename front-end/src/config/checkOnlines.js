const checkOnline = (onlines, userId) => {
    return onlines.some(online => online === userId)
}
export default checkOnline