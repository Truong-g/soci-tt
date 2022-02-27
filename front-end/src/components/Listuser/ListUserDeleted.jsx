

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { deleteMemberConversationActions } from '../../redux/actions/conversationActions';
import { notificationModalAction } from '../../redux/actions/modalActions';


function ListUserDeleted({ onShow }) {
    const profile = useSelector(state => state.auth.data)
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const conversations = useSelector(state => state.conversation.data)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleDeleteMember = async (userId) => {
        if(selectedConversation.group_admin.id === userId){
            dispatch(notificationModalAction({
                type: "error",
                message: "Bạn không thể xóa quản trị viên ra khỏi nhóm chat!"
            }))
            return
        }
        dispatch(deleteMemberConversationActions({ convId: selectedConversation.id, userId: userId }))
        const data = {
            convId: selectedConversation.id,
            userId: userId
        }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/conversation/del-member`, reqOptions)
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

    return (
        <div className='w-[400px] sm:w-[300px] bg-white rounded-md p-3'>
            <div className='flex items-center border-b-[1px] pb-2'>
                <h3 className='text-[15px] font-[600] flex-1 text-[#333] text-center'>Xóa thành viên</h3>
                <button
                    onClick={() => onShow(false)}
                    className='w-[40px] h-[40px] flex justify-center items-center bg-[#ddd] rounded-full'><i className='bx bx-x text-[22px]'></i></button>
            </div>
            <div className='py-[10px]'>
                <div>
                    {selectedConversation.member.map((item, index) => {
                        return (
                            <div key={index}
                                onClick={() => handleDeleteMember(item.id)}
                                className='flex items-center justify-between hover:bg-[#eeee] p-[5px] rounded-[15px] select-none cursor-pointer'>
                                <div className='flex items-center'>
                                    <div className='w-[35px] h-[35px] rounded-full overflow-hidden'>
                                        <img src={item.avatar} className='w-[100%] h-[100%]' />
                                    </div>
                                    <div className='pl-[10px] txt-bold-m flex-1'>{item.fullname}</div>
                                </div>
                                <div className='txt'>{item.id === selectedConversation.group_admin.id ? "Quản trị viên" : "Thành viên"}</div>
                                <div className='w-[30px] h-[30px] flex justify-center items-center text-white bg-red-600 rounded-full'>
                                    <i className='bx bx-trash-alt'></i>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ListUserDeleted