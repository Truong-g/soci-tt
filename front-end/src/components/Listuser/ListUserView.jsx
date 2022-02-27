

import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function ListUserView({ onShow }) {
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const conversations = useSelector(state => state.conversation.data)

    return (
        <div className='w-[400px] sm:w-[300px] bg-white rounded-md p-3'>
            <div className='flex items-center border-b-[1px] pb-2'>
                <h3 className='text-[15px] font-[600] flex-1 text-[#333] text-center'>Xem Thành viên</h3>
                <button
                    onClick={() => onShow(false)}
                    className='w-[40px] h-[40px] flex justify-center items-center bg-[#ddd] rounded-full'><i className='bx bx-x text-[22px]'></i></button>
            </div>
            <div className='py-[10px]'>
                <div>
                    {selectedConversation.member.map((item, index) => {
                        return (
                            <Link to={`/thanh-vien/${item.id}`} key={index} className='flex items-center justify-between hover:bg-[#eeee] p-[5px] rounded-[15px] select-none cursor-pointer'>
                                <div className='flex items-center'>
                                    <div className='w-[35px] h-[35px] rounded-full overflow-hidden'>
                                        <img src={item.avatar} className='w-[100%] h-[100%]' />
                                    </div>
                                    <div className='pl-[10px] txt-bold-m flex-1'>{item.fullname}</div>
                                </div>
                                <div className='txt'>{item.id === selectedConversation.group_admin.id ? "Quản trị viên" : "Thành viên"}</div>
                                <div className='w-[30px] h-[30px] flex justify-center items-center text-white bg-green-600 rounded-full'>
                                    <i className='bx bxs-show'></i>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ListUserView