const checkExistChat = (listChat, userId) => {
    const privateChats = listChat.filter(item => item.is_group == 0);
    console.log(privateChats);
    for (let index = 0; index < privateChats.length; index++) {
        if(privateChats[index].member[0].id == userId) return privateChats[index]
        if(privateChats[index].member[1].id == userId) return privateChats[index]
    }
    return null
}

export default checkExistChat;
