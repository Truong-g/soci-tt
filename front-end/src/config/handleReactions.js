
const handleReactions = (reactions) => {
    return {
        like: reactions.filter(item => item.type_reaction === "like").length,
        heart: reactions.filter(item => item.type_reaction === "heart").length,
        angry: reactions.filter(item => item.type_reaction === "angry").length,
        haha: reactions.filter(item => item.type_reaction === "haha").length,
        total: reactions.length
    }
}

export default handleReactions