const checkFriend = (friends, userId) => {
    if(friends.length === 0) return 0
    if (friends.findIndex(item => item.id === userId) === -1){
        return 0
    }
    if(friends.findIndex(item => item.id === userId && item.status_friend == 2 && item.active_id === userId) != -1) return 2 // u is pasive
    if(friends.findIndex(item => item.id === userId && item.status_friend == 2 && item.passive_id === userId) != -1) return 3 // u is active
    if(friends.findIndex(item => item.id === userId && item.status_friend == 1) != -1) return 1
}


export default checkFriend