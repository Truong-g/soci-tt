import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BG_USER } from '../../assets/images';
import checkExistChat from '../../config/checkExistChat';
import checkFriend from '../../config/checkFriend';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { addConversationActions, selectedConversationActions } from '../../redux/actions/conversationActions';
import { acceptFriendActions, addFriendActions, cancelFriendActions } from '../../redux/actions/friendActions';


function UserHeader({ user, targetId }) {
    const profile = useSelector(state => state.auth.data)
    const socket = useSelector(state => state.socket.server)
    const friends = useSelector(state => state.friend.data)
    const conversations = useSelector(state => state.conversation.data)
    const [loadingChat, setLoadingChat] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleAddFriend = async () => {
        dispatch(addFriendActions({
            ...user,
            passive_id: user.id,
            active_id: profile.id,
            status_friend: 2
        }))
        const data = {
            user_id: user.id
        }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/friends/send-request`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {

                }
            } else {
                localStorage.removeItem("access_jwt")
                navigate("/dang-nhap")
            }
        } catch (error) {
            localStorage.removeItem("access_jwt")
            navigate("/dang-nhap")
        }
    }
    const handleAcceptFriend = async () => {
        dispatch(acceptFriendActions({
            profileId: profile.id,
            userId: user.id
        }))

        const data = {
            user_id: user.id
        }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/friends/accept-request`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {

                }
            } else {
                localStorage.removeItem("access_jwt")
                navigate("/dang-nhap")
            }
        } catch (error) {
            localStorage.removeItem("access_jwt")
            navigate("/dang-nhap")
        }
    }
    const handleCancelFriend = async () => {
        dispatch(cancelFriendActions(user.id))
        const data = {
            user_id: user.id
        }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/friends/unfrimate`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {

                }
            } else {
                localStorage.removeItem("access_jwt")
                navigate("/dang-nhap")
            }
        } catch (error) {
            localStorage.removeItem("access_jwt")
            navigate("/dang-nhap")
        }

    }

    const handlePrivateChat = async () => {
        const selected = checkExistChat(conversations, user.id)
        if (selected) {
            dispatch(selectedConversationActions(selected))
            navigate("/tin-nhan")
            return
        }
        setLoadingChat(true)
        const data = {
            member: [profile.id, user.id]
        }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/conversation`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setLoadingChat(false)
                    dispatch(addConversationActions(resBody.data))
                    socket.emit("send added conversation", resBody.data, user.id)
                    dispatch(selectedConversationActions(resBody.data))
                    navigate("/tin-nhan")
                }
            } else {
                setLoadingChat(false)
                localStorage.removeItem("access_jwt")
                if (navigate) {
                    navigate("/dang-nhap")
                }
            }
        } catch (error) {
            setLoadingChat(false)
            localStorage.removeItem("access_jwt")
            if (navigate) {
                navigate("/dang-nhap")
            }
        }
    }

    return (
        <div className='p-5 bg-white rounded-[10px]'>
            <div
                className='w-full bg-center bg-cover bg-no-repeat pt-[40%] rounded-[10px] relative'
                style={{ backgroundImage: `url("${user?.background ? user.background : BG_USER}")` }}
            >
                <div className='absolute top-full left-0 w-full bg-white rounded-[10px] shadow-md'>
                    <div className='flex items-center justify-between sm:flex-col h-[100px] sm:h-[152px] p-4 border-[1px] border-l-0 border-r-0 border-t-0 w-full'>
                        <div className='h-full flex items-center sm:h-[60px]'>
                            <div className='mr-5 sm:mr-2 relative w-[150px] sm:w-[90px] h-full'>
                                <div className='absolute bottom-0 left-0 w-[150px] sm:w-[90px] h-[150px] sm:h-[90px] rounded-full bg-white shadow-md overflow-hidden border-4'>
                                    <img src={user?.avatar} className='w-full' alt="" />
                                </div>
                            </div>
                            <div className='ml-2'>
                                {user ? (
                                    <h2 className='text-[1.3rem] text-[#333] sm:text-[1rem] font-[400] leading-none mb-1'>{user?.fullname}</h2>
                                ) : (
                                    <h2 className='h-[25px] sm:h-[20px] w-[250px] bg-[#ddd] rounded-[20px]'></h2>
                                )}
                                {user ? (
                                    <p className='text-[12px] text-[#777] font-[600]'>{user?.email}</p>
                                ) : (
                                    <p className='h-[18px] sm:h-[13px] w-[200px] bg-[#ddd] rounded-[20px] mt-[5px]'></p>
                                )}

                            </div>
                        </div>
                        <div className='flex items-center sm:h-[60px] sm:justify-center'>
                            {profile.id === targetId ? (
                                <Link to="/chinh-sua-thong-tin" className='px-[1.5rem] h-[2.4rem] flex items-center justify-center bg-[#ddd] text-[13px] font-[600] ml-2 rounded-[4px] text-[#333]'>
                                    Chỉnh sửa thông tin
                                </Link>
                            ) : (
                                <>
                                    {user && checkFriend(friends, user?.id) === 0 && (
                                        <button
                                            className='px-[1.5rem] h-[2.4rem] text-white text-[13px] font-[600] flex items-center justify-center bg-[#10d876] rounded-[4px]'
                                            onClick={() => handleAddFriend()}
                                        >
                                            Kết bạn</button>
                                    )}
                                    {user && checkFriend(friends, user?.id) === 1 && (
                                        <button
                                            className='px-[1.5rem] h-[2.4rem] text-[#555] text-[13px] font-[600] flex items-center justify-center bg-[#ddd] rounded-[4px]'
                                            onClick={() => handleCancelFriend()}

                                        >Hủy kết bạn</button>
                                    )}
                                    {user && checkFriend(friends, user?.id) === 2 && (
                                        <button
                                            className='px-[1.5rem] h-[2.4rem] text-[#555] text-[13px] font-[600] flex items-center justify-center bg-[#ddd] rounded-[4px]'
                                            onClick={() => handleAcceptFriend()}
                                        >Chấp nhận kết bạn</button>
                                    )}
                                    {user && checkFriend(friends, user?.id) === 3 && (
                                        <button
                                            className='px-[1.5rem] h-[2.4rem] text-[#555] text-[13px] font-[600] flex items-center justify-center bg-[#ddd] rounded-[4px]'
                                            onClick={() => handleCancelFriend()}
                                        >Đã gửi lời mời</button>
                                    )}
                                    <button
                                        onClick={() => handlePrivateChat()}
                                        className='flex w-[2.4rem] h-[2.4rem] items-center justify-center bg-[#ddd] text-[20px] ml-2 rounded-[4px] text-[#333]'>
                                        {loadingChat ? (
                                            <i className='bx bx-loader-circle bx-spin' ></i>
                                        ) : (
                                            <i className='bx bx-message'></i>
                                        )}
                                    </button>
                                </>
                            )}
                            <button className='flex w-[2.4rem] h-[2.4rem] items-center justify-center bg-[#ddd] text-[20px] ml-2 rounded-[4px] text-[#333]'>
                                <i className='bx bx-dots-horizontal-rounded'></i>
                            </button>
                        </div>
                    </div>
                    <div className='px-[10px] flex items-center h-[64px]'>
                        <ul className='flex items-center h-full'>
                            <li className='mr-[20px]'>
                                <NavLink to='/' className='text-[13px] text-main-color font-[600] hover:text-main-color'>Trang cá nhân</NavLink>
                            </li>
                            <li className='mr-[20px]'>
                                <NavLink to='/' className='text-[13px] text-[#777] font-[600] hover:text-main-color'>Bạn bè</NavLink>
                            </li>
                            <li className='mr-[20px] sm:hidden'>
                                <NavLink to='/' className='text-[13px] text-[#777] font-[600] hover:text-main-color'>Video</NavLink>
                            </li>
                            <li className='mr-[20px] sm:hidden'>
                                <NavLink to='/' className='text-[13px] text-[#777] font-[600] hover:text-main-color'>Nhóm</NavLink>
                            </li>
                            <li className='mr-[20px] sm:hidden'>
                                <NavLink to='/' className='text-[13px] text-[#777] font-[600] hover:text-main-color'>Sự kiện</NavLink>
                            </li>
                            <li className='mr-[20px]'>
                                <NavLink to='/' className='text-[13px] text-[#777] font-[600] hover:text-main-color'>Thư viện</NavLink>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default UserHeader;
