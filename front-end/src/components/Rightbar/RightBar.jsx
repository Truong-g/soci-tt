import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import checkOnline from '../../config/checkOnlines';
import selectFriendChat from '../../config/selectFriendChat';
import { selectedConversationActions } from '../../redux/actions/conversationActions';
import '../../styles/components/buttons.scss'
import '../../styles/components/custom-height.scss'

function RightBar() {
    const onlines = useSelector(state => state.online.data)
    const toggle = useSelector(state => state.modal.rightBar)
    const profile = useSelector(state => state.auth.data)
    const conversations = useSelector(state => state.conversation.data)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSelectedChat = (payload) => {
        dispatch(selectedConversationActions(payload))
        navigate("/tin-nhan")
    }


    return (
        <aside className={`w-60 p-3 height-scroll-xl overflow-y-scroll sm:fixed sm:right-0 sm:top-0 sm:bottom-0 sm:w-[70vw] sm:bg-[#eee] sm:z-30 sm:h-[100vh] ${toggle ? "sm:block" : "sm:hidden"} sm:animate-fadeIn2`}>
            <div className="bg-white p-3 drop-shadow-lg rounded-[10px] mb-4">
                <h4 className="text-[12px] font-[600] text-[#adb5bd] mb-2">Liên hệ</h4>
                <ul>
                    {conversations.filter(item => item.is_group === 0).map((item, index) => {
                        return (
                            <li className='my-4 cursor-pointer' key={index} onClick={() => handleSelectedChat(item)}>
                                <div className='flex justify-between items-center text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                                    <div className='flex items-center flex-1'>
                                        <div className='w-9 h-9 rounded-full overflow-hidden'>
                                            <img src={selectFriendChat(item, profile.id).avatar} alt={selectFriendChat(item, profile.id).fullname} className='w-full' />
                                        </div>
                                        <span className='font-[600] text-[13px] flex justify-center items-center ml-2'>{selectFriendChat(item, profile.id).fullname}</span>
                                    </div>
                                    
                                    <div className={`inline-block w-2 h-2 ${checkOnline(onlines, selectFriendChat(item, profile.id).id) ? "bg-lime-600" : "bg-red-700"} rounded-full`}></div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                {conversations.filter(item => item.is_group === 0).length === 0 && (
                    <p className='txt text-center'>Chưa có đoạn chat nào!</p>
                )}

            </div>
            <div className="bg-white p-3 drop-shadow-lg rounded-[10px] mb-4">
                <h4 className="text-[12px] font-[600] text-[#adb5bd] mb-2">Nhóm</h4>
                <ul>
                    {conversations.filter(item => item.is_group === 1).map((item, index) => {
                        return (
                            <li className='my-4' key={index} onClick={() => handleSelectedChat(item)}>
                                <Link to="/" className='flex justify-between items-center text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                                    <div className='flex items-center flex-1'>
                                        <div className='w-9 h-9 rounded-full overflow-hidden'>
                                            <img src={item.avatar} alt={item.avatar} className='w-full' />
                                        </div>
                                        <span className='font-[600] text-[13px] flex justify-center items-center ml-2'>{item.conv_name}</span>
                                    </div>
                                    <div className='inline-block w-2 h-2 bg-lime-600 rounded-full'></div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                {conversations.filter(item => item.is_group === 1).length === 0 && (
                    <p className='txt text-center'>Chưa có đoạn chat nào!</p>
                )}
            </div>
        </aside>
    )
}

export default RightBar;
