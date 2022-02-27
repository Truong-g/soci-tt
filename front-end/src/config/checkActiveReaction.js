
const checkActiveReaction = (reactions, profileId) => {
    const check = reactions.findIndex(item => item.user_id === profileId)
    return check === -1 ? false : true
}

export default checkActiveReaction;
