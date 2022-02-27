const selectFriendChat = (chat, profileId) => {
    return chat.member[0].id == profileId ? chat.member[1] : chat.member[0]
}

export default selectFriendChat;
