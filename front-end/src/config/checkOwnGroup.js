const checkOwnGroup = (profile, group) => {
    if(group.group_admin === profile.id) return 1 // chủ group
    const inGroup = group.member.find(item => item.id === profile.id)
    if(!inGroup) return 2 // chưa tham gia
    else return 3 // đã tham gia
}

export default checkOwnGroup;
