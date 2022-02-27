

import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectFriendChat from '../../config/selectFriendChat';
import CreateChat from '../Createchat/CreateChat';
import { selectedConversationActions } from '../../redux/actions/conversationActions'

function Chat({ onShow }) {
    const conversations = useSelector(state => state.conversation.data)
    const socket = useSelector(state => state.socket.server)
    const selectedChonversation = useSelector(state => state.conversation.selectedConversation)
    const profile = useSelector(state => state.auth.data)
    const [showCreateBtn, setShowCreateBtn] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const dispatch = useDispatch()
    const handleSelectedChat = (conversation) => {
        dispatch(selectedConversationActions(conversation))
        onShow(false)
    }



    return (
        <div className="w-full p-3 rounded-[10px] bg-white sm:h-[100vh]">
            <h3 className="text-[#333] text-[15px] font-[600] h-[22px] relative">Chat
                <button
                    className='absolute text-[24px] right-0 top-1/2 translate-y-[-50%] hidden sm:block'
                    onClick={() => onShow(false)}
                >
                    <i className='bx bx-right-arrow-alt'></i>
                </button>
            </h3>
            <div className="flex items-center mt-5">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="h-[35px] flex-1 block outline-none bg-[#ddd] rounded-[20px] mr-2 px-2 txt-bold-m" />
                <button
                    className="min-w-[35px] min-h-[35px] bg-[#ddd] text-[22px] text-[#555] flex justify-center items-center relative"
                    onClick={() => setShowCreateBtn(!showCreateBtn)}
                >
                    <i className='bx bxs-group'></i>
                    {showCreateBtn && (
                        <div
                            className='absolute top-full right-0 flex items-center justify-center w-[400%] bg-white shadow-md py-[10px]'
                            onClick={() => setShowCreateModal(true)}
                        >
                            <i className='bx bx-plus-circle text-[18px] text-[#444] mr-1'></i>
                            <span className='txt-bold-m'>Tạo nhóm chat</span>
                        </div>
                    )}

                </button>
            </div>
            <div className="h-[1px] bg-[#ddd] my-3"></div>
            <ul className="w-full height-chat-xl overflow-y-scroll height-chat-sm">
                {conversations.map((conversation, index) => {
                    return (
                        <li className="w-full h-auto" key={index}>
                            <div
                                onClick={() => handleSelectedChat(conversation)}
                                className={`w-full flex items-center p-3 hover:bg-[#ddd] transition-colors cursor-pointer rounded-[20px] ${selectedChonversation?.id === conversation.id ? "bg-[#ddd]" : ""}`}
                            >
                                <div className="w-[40px] h-[40px] mr-2 overflow-hidden rounded-full">
                                    <img src={conversation.is_group === 0 ? selectFriendChat(conversation, profile.id).avatar : conversation.avatar} alt="" className="w-full" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <h3 className="text-[13px] text-[#333] font-[600]">
                                        {conversation.is_group === 0 ? selectFriendChat(conversation, profile.id).fullname : conversation.conv_name}
                                    </h3>
                                    {conversation.latest_msg && conversation.latest_msg_person && (
                                        <p className="txt h-[18px] overflow-text-1 w-full">
                                            <strong>{conversation.latest_msg_person.id === profile.id ? "Bạn" : conversation.latest_msg_person.fullname}: </strong>
                                            {conversation.latest_msg}
                                        </p>
                                    )}

                                </div>
                            </div>
                        </li>
                    )
                })}


            </ul>
            {showCreateModal && (<CreateChat onShow={setShowCreateModal} />)}


        </div>
    )
}

export default Chat;
