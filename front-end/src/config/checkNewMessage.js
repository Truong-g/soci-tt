const checkNewMessage = (listConv, userId) => {
    for (let index = 0; index < listConv.length; index++) {
        for (let index2 = 0; index2 < listConv[index].member.length; index2++) {
            if(listConv[index].member[index2].id === userId){
                if(listConv[index].member[index2].status = 2){
                    return true
                }
            }
        }
        
    }
    return false
}

export default checkNewMessage