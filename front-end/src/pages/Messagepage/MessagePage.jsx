import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Chat from "../../components/Chat/Chat";
import Message from "../../components/Message/Message";
import MessageForm from "../../components/Messageform/MessageForm";
import createHeaders from '../../config/createHeaders';
import selectFriendChat from '../../config/selectFriendChat';
import { baseURL } from '../../constants/constants';
import { notificationModalAction } from '../../redux/actions/modalActions';
import { addConversationActions, addLatestMsgAction, changeTopicActions, deleteConversationActions, getConversationActions, leaveGroupConversationActions } from '../../redux/actions/conversationActions'
import '../../styles/components/settopic.scss'
import ListUserView from '../../components/Listuser/ListUserView';
import ListUserDeleted from '../../components/Listuser/ListUserDeleted';
import ListUserAdded from '../../components/Listuser/ListUserAdded';
import ChangeInforChat from '../../components/Listuser/ChangeInforChat';



function MessagePage() {
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const profile = useSelector(state => state.auth.data)
    const socket = useSelector(state => state.socket.server)
    const [chatMb, setChatMb] = useState(false)
    const [listMessage, setListMessage] = useState([])
    const [loadMsg, setLoadMsg] = useState(false)
    const [showInforChat, setShowInforChat] = useState(false)
    const [showTopic, setShowTopic] = useState(false)
    const [loadMedia, setLoadMedia] = useState(false)
    const [showUserViewed, setShowUserViewed] = useState(false)
    const [showUserDeleted, setShowUserDeleted] = useState(false)
    const [showUserAdded, setShowUserAdded] = useState(false)
    const [showChangeChat, setShowChangeChat] = useState(false)


    const navigate = useNavigate()
    const dispatch = useDispatch()



    useEffect(() => {
        socket.on("message recived", (newMessage) => {
            setListMessage(prev => [...prev, newMessage])
        })
        socket.on("get latest message", (latest_msg) => {
            dispatch(addLatestMsgAction(latest_msg))
        })
        socket.on("get changed topic", (result) => {
            dispatch(changeTopicActions({ convId: result.convId, topic: result.topic }))
        })
        socket.on("get deleted conversation", (convId) => {
            dispatch(deleteConversationActions({ convId: convId }))
        })
        socket.on("get added conversation", (conversation) => {
            dispatch(addConversationActions(conversation))
        })
    }, [])

    useEffect(() => {
        dispatch(getConversationActions(navigate))
    }, [])

    useEffect(() => {
        const getMessages = async (convId) => {
            setLoadMsg(true)
            const reqOptions = createHeaders("GET", true)
            try {
                const response = await fetch(`${baseURL}/message/${convId}`, reqOptions)
                if (response.ok) {
                    const resBody = await response.json()
                    if (resBody.errCode === 0) {
                        setListMessage(resBody.data)
                        setLoadMsg(false)
                    }
                } else {
                    setLoadMsg(false)
                    localStorage.removeItem("access_jwt")
                    navigate("/dang-nhap")
                }
            } catch (error) {
                setLoadMsg(false)
                localStorage.removeItem("access_jwt")
                navigate("/dang-nhap")
            }
        }
        selectedConversation && getMessages(selectedConversation.id)

        if (selectedConversation) {
            socket.emit("join chat", selectedConversation.id)
        }
        return () => {
            if (selectedConversation) {
                socket.emit("leave chat", selectedConversation.id)
            }
        }
    }, [selectedConversation?.id])


    const handleAddMessage = async (objData, type) => {
        const data = {
            type: type,
            convId: selectedConversation?.id,
            content: objData.text,
            image: objData.image,
            video: objData.video,
            record: objData.record,
            sticker: objData.sticker
        }
        if (type === "text") {
            setListMessage(prev => [
                ...prev,
                {
                    conv_id: selectedConversation?.id,
                    content: objData.text,
                    created_at: new Date().toString(),
                    updated_at: new Date().toString(),
                    video: null,
                    image: null,
                    record: null,
                    sticker: null,
                    sender: {
                        id: profile.id,
                        avatar: profile.avatar,
                        username: profile.username,
                        fullname: profile.fullname
                    }
                }
            ]
            )
            dispatch(addLatestMsgAction({
                id: selectedConversation.id,
                latest_msg: objData.text,
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }))
            socket.emit("new message", ({
                conv_id: selectedConversation?.id,
                content: objData.text,
                created_at: new Date().toString(),
                updated_at: new Date().toString(),
                video: null,
                image: null,
                record: null,
                sticker: null,
                sender: {
                    id: profile.id,
                    avatar: profile.avatar,
                    username: profile.username,
                    fullname: profile.fullname
                }
            }), selectedConversation.id)

            socket.emit("add latest message", {
                id: selectedConversation.id,
                latest_msg: objData.text,
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }, [...selectedConversation.member.filter(item => item.id !== profile.id)])
            const reqActions = createHeaders("POST", true, data)
            try {
                const response = await fetch(`${baseURL}/message`, reqActions)
                if (response.ok) {
                    const resBody = await response.json()
                } else {
                    dispatch(notificationModalAction({
                        type: "error",
                        message: "Gửi tin nhắn không thành công"
                    }))
                }

            } catch (error) {
                dispatch(notificationModalAction({
                    type: "error",
                    message: "Gửi tin nhắn không thành công"
                }))
            }
        }

        if (type === "record") {
            setLoadMedia(true)
            const formData = new FormData()
            formData.append("file", objData.record)
            formData.append("upload_preset", "audio-recorder")
            formData.append("cloud_name", "dwfjhv7mr")

            const responseAudio = await fetch("https://api.cloudinary.com/v1_1/dwfjhv7mr/video/upload", {
                method: "POST",
                body: formData
            })
            const resBodAudio = await responseAudio.json()

            setLoadMedia(false)

            data.record = responseAudio.ok ? resBodAudio.url : null

            setListMessage(prev => [
                ...prev,
                {
                    conv_id: selectedConversation?.id,
                    content: null,
                    created_at: new Date().toString(),
                    updated_at: new Date().toString(),
                    video: null,
                    image: null,
                    record: data.record,
                    sticker: null,
                    sender: {
                        id: profile.id,
                        avatar: profile.avatar,
                        username: profile.username,
                        fullname: profile.fullname
                    }
                }
            ]
            )

            dispatch(addLatestMsgAction({
                id: selectedConversation.id,
                latest_msg: "Đã gửi một đoạn ghi âm.",
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }))

            socket.emit("new message", ({
                conv_id: selectedConversation?.id,
                content: null,
                created_at: new Date().toString(),
                updated_at: new Date().toString(),
                video: null,
                image: null,
                record: data.record,
                sticker: null,
                sender: {
                    id: profile.id,
                    avatar: profile.avatar,
                    username: profile.username,
                    fullname: profile.fullname
                }
            }), selectedConversation.id)

            socket.emit("add latest message", {
                id: selectedConversation.id,
                latest_msg: "Đã gửi một đoạn ghi âm.",
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }, [...selectedConversation.member.filter(item => item.id !== profile.id)])

            const reqActions = createHeaders("POST", true, data)
            try {
                const response = await fetch(`${baseURL}/message`, reqActions)
                if (response.ok) {
                    const resBody = await response.json()
                } else {
                    dispatch(notificationModalAction({
                        type: "error",
                        message: "Gửi tin nhắn không thành công"
                    }))
                }


            } catch (error) {
                dispatch(notificationModalAction({
                    type: "error",
                    message: "Gửi tin nhắn không thành công"
                }))
            }


        }


        if (type === "video") {

            setLoadMedia(true)
            const formData = new FormData()
            formData.append("file", objData.video)
            formData.append("upload_preset", "default")
            formData.append("cloud_name", "dwfjhv7mr")

            const responseAudio = await fetch("https://api.cloudinary.com/v1_1/dwfjhv7mr/video/upload", {
                method: "POST",
                body: formData
            })
            const resBodAudio = await responseAudio.json()
            setLoadMedia(false)


            data.video = responseAudio.ok ? resBodAudio.url : null

            setListMessage(prev => [
                ...prev,
                {
                    conv_id: selectedConversation?.id,
                    content: null,
                    created_at: new Date().toString(),
                    updated_at: new Date().toString(),
                    video: data.video,
                    image: null,
                    record: null,
                    sticker: null,
                    sender: {
                        id: profile.id,
                        avatar: profile.avatar,
                        username: profile.username,
                        fullname: profile.fullname
                    }
                }
            ]
            )

            dispatch(addLatestMsgAction({
                id: selectedConversation.id,
                latest_msg: "Đã gửi một đoạn video.",
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }))

            socket.emit("new message", ({
                conv_id: selectedConversation?.id,
                content: null,
                created_at: new Date().toString(),
                updated_at: new Date().toString(),
                video: data.video,
                image: null,
                record: null,
                sticker: null,
                sender: {
                    id: profile.id,
                    avatar: profile.avatar,
                    username: profile.username,
                    fullname: profile.fullname
                }
            }), selectedConversation.id)

            socket.emit("add latest message", {
                id: selectedConversation.id,
                latest_msg: "Đã gửi một đoạn video.",
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }, [...selectedConversation.member.filter(item => item.id !== profile.id)])

            const reqActions = createHeaders("POST", true, data)
            try {
                const response = await fetch(`${baseURL}/message`, reqActions)
                if (response.ok) {
                    const resBody = await response.json()
                } else {
                    dispatch(notificationModalAction({
                        type: "error",
                        message: "Gửi tin nhắn không thành công"
                    }))
                }


            } catch (error) {
                dispatch(notificationModalAction({
                    type: "error",
                    message: "Gửi tin nhắn không thành công"
                }))
            }
        }

        if (type === "image") {
            setLoadMedia(true)
            const formData = new FormData()
            formData.append("file", objData.image)
            formData.append("upload_preset", "default")
            formData.append("cloud_name", "dwfjhv7mr")

            const responseAudio = await fetch("https://api.cloudinary.com/v1_1/dwfjhv7mr/image/upload", {
                method: "POST",
                body: formData
            })
            const resBodAudio = await responseAudio.json()
            setLoadMedia(false)


            data.image = responseAudio.ok ? resBodAudio.url : null

            setListMessage(prev => [
                ...prev,
                {
                    conv_id: selectedConversation?.id,
                    content: null,
                    created_at: new Date().toString(),
                    updated_at: new Date().toString(),
                    video: null,
                    image: data.image,
                    record: null,
                    sticker: null,
                    sender: {
                        id: profile.id,
                        avatar: profile.avatar,
                        username: profile.username,
                        fullname: profile.fullname
                    }
                }
            ]
            )

            dispatch(addLatestMsgAction({
                id: selectedConversation.id,
                latest_msg: "Đã gửi một hình ảnh.",
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }))

            socket.emit("new message", ({
                conv_id: selectedConversation?.id,
                content: null,
                created_at: new Date().toString(),
                updated_at: new Date().toString(),
                video: null,
                image: data.image,
                record: null,
                sticker: null,
                sender: {
                    id: profile.id,
                    avatar: profile.avatar,
                    username: profile.username,
                    fullname: profile.fullname
                }
            }), selectedConversation.id)

            socket.emit("add latest message", {
                id: selectedConversation.id,
                latest_msg: "Đã gửi một hình ảnh.",
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }, [...selectedConversation.member.filter(item => item.id !== profile.id)])

            const reqActions = createHeaders("POST", true, data)
            try {
                const response = await fetch(`${baseURL}/message`, reqActions)
                if (response.ok) {
                    const resBody = await response.json()
                } else {
                    dispatch(notificationModalAction({
                        type: "error",
                        message: "Gửi tin nhắn không thành công"
                    }))
                }


            } catch (error) {
                dispatch(notificationModalAction({
                    type: "error",
                    message: "Gửi tin nhắn không thành công"
                }))
            }
        }

        if (type === "sticker") {
            data.sticker = objData.sticker
            setListMessage(prev => [
                ...prev,
                {
                    conv_id: selectedConversation?.id,
                    content: null,
                    created_at: new Date().toString(),
                    updated_at: new Date().toString(),
                    video: null,
                    image: null,
                    record: null,
                    sticker: data.sticker,
                    sender: {
                        id: profile.id,
                        avatar: profile.avatar,
                        username: profile.username,
                        fullname: profile.fullname
                    }
                }
            ]
            )
            dispatch(addLatestMsgAction({
                id: selectedConversation.id,
                latest_msg: "Đã gửi một nhãn dán.",
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }))
            socket.emit("new message", ({
                conv_id: selectedConversation?.id,
                content: null,
                created_at: new Date().toString(),
                updated_at: new Date().toString(),
                video: null,
                image: null,
                record: null,
                sticker: data.sticker,
                sender: {
                    id: profile.id,
                    avatar: profile.avatar,
                    username: profile.username,
                    fullname: profile.fullname
                }
            }), selectedConversation.id)

            socket.emit("add latest message", {
                id: selectedConversation.id,
                latest_msg: "Đã gửi một nhãn dán",
                infor: {
                    id: profile.id,
                    username: profile.username,
                    fullname: profile.fullname,
                    email: profile.email,
                    avatar: profile.avatar
                }
            }, [...selectedConversation.member.filter(item => item.id !== profile.id)])
            const reqActions = createHeaders("POST", true, data)
            try {
                const response = await fetch(`${baseURL}/message`, reqActions)
                if (response.ok) {
                    const resBody = await response.json()
                } else {
                    dispatch(notificationModalAction({
                        type: "error",
                        message: "Gửi tin nhắn không thành công"
                    }))
                }

            } catch (error) {
                dispatch(notificationModalAction({
                    type: "error",
                    message: "Gửi tin nhắn không thành công"
                }))
            }
        }
    }

    const handleChangeTopic = async (convId, topic) => {

        const data = {
            convId: convId,
            topic: topic
        }

        const reqOptions = createHeaders("POST", true, data)
        dispatch(changeTopicActions({ convId: convId, topic: topic }))
        setListMessage(prev => [
            ...prev,
            {
                conv_id: convId,
                content: "Đã đổi chủ đề.",
                created_at: new Date().toString(),
                updated_at: new Date().toString(),
                video: null,
                image: null,
                record: null,
                sticker: null,
                sender: {
                    id: profile.id,
                    avatar: profile.avatar,
                    username: profile.username,
                    fullname: profile.fullname
                }
            }
        ]
        )
        dispatch(addLatestMsgAction({
            id: convId,
            latest_msg: "Đã đổi chủ đề.",
            infor: {
                id: profile.id,
                username: profile.username,
                fullname: profile.fullname,
                email: profile.email,
                avatar: profile.avatar
            }
        }))
        socket.emit("new message", ({
            conv_id: convId,
            content: "Đã đổi chủ đề.",
            created_at: new Date().toString(),
            updated_at: new Date().toString(),
            video: null,
            image: null,
            record: null,
            sticker: null,
            sender: {
                id: profile.id,
                avatar: profile.avatar,
                username: profile.username,
                fullname: profile.fullname
            }
        }), convId)

        socket.emit("add latest message", {
            id: convId,
            latest_msg: "Đã đổi chủ đề.",
            infor: {
                id: profile.id,
                username: profile.username,
                fullname: profile.fullname,
                email: profile.email,
                avatar: profile.avatar
            }
        }, [...selectedConversation.member.filter(item => item.id !== profile.id)])

        socket.emit("change topic", { convId, topic }, [...selectedConversation.member.filter(item => item.id !== profile.id)])

        try {
            const response = await fetch(`${baseURL}/conversation/topic`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setShowInforChat(false)
                }
            }
        } catch (error) {

        }

    }

    const deletePrivateChat = async () => {
        const data = {
            convId: selectedConversation.id
        }
        const reqOptions = createHeaders("POST", true, data)
        dispatch(deleteConversationActions({ convId: selectedConversation.id }))
        socket.emit("send deleted conversation", selectedConversation.id, [...selectedConversation.member.filter(item => item.id !== profile.id)])
        try {
            const response = await fetch(`${baseURL}/conversation/delete`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    //
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

    const leaveGroupChat = async () => {

        const data = {
            convId: selectedConversation.id
        }

        dispatch(leaveGroupConversationActions({ convId: selectedConversation.id }))
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/conversation/leave-group`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {

                }
            }
        } catch (error) {

        }
    }



    return (
        <section className='flex sm:mb-[76px] sm:block'>
            <div className='flex-1 mr-4 sm:mr-0 relative'>
                {!selectedConversation ? (
                    <div className='h-[100%] bg-white shadow-md flex items-center justify-center border-b-[1px] px-5'>
                        <span className='text-[15px] text-[#555] sm:hidden'>Vui lòng chọn đoạn chat để nhắn tin!</span>
                        <div className='py-[20px] hidden sm:flex sm:items-center'>
                            <span className='text-[14px]'>Vui lòng nhấn vào đây để chọn đoạn chat: </span>
                            <i className='bx bxs-conversation text-main-color text-[22px] ml-2 cursor-pointer' onClick={() => setChatMb(true)} ></i>
                        </div>
                    </div>
                ) : (
                    <>
                        <>
                            <div className='h-[70px] bg-white shadow-sm flex items-center justify-between px-3 border-b-[1px]'>
                                <div className='flex items-center'>
                                    <div className='w-[45px] h-[45px] rounded-full overflow-hidden mr-2 cursor-pointer' onClick={(e) => {
                                        e.stopPropagation()
                                        setShowInforChat(true)
                                    }}>
                                        <img src={selectedConversation.is_group === 0 ? selectFriendChat(selectedConversation, profile.id).avatar : selectedConversation.avatar} alt={selectedConversation.is_group === 0 ? selectedConversation.avatar : selectFriendChat(selectedConversation, profile.id).avatar} className='w-[full] h-[full]' />
                                    </div>
                                    <div className='flex flex-col justify-center h-full'>
                                        <span className='txt-bold-m'>{selectedConversation.is_group === 0 ? selectFriendChat(selectedConversation, profile.id).fullname : selectedConversation.conv_name}</span>
                                        <div className='flex items-center'>
                                            <span className='inline-block w-[10px] h-[10px] rounded-full bg-green-600 mr-1'></span>
                                            <span className='txt'>Đang hoạt động</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className='text-[28px] text-main-color mr-3'><i className='bx bxs-phone'></i></button>
                                    <button className='text-[28px] text-main-color mr-0 sm:mr-3'><i className='bx bxs-video'></i></button>
                                    <button
                                        className='text-[28px] text-main-color hidden sm:inline-block'
                                        onClick={() => setChatMb(true)}
                                    >
                                        <i className='bx bxs-conversation' ></i>
                                    </button>

                                </div>
                            </div>
                            <div className='bg-white'>
                                <div className={`xl:h-[calc(100vh_-_248px)] lg:h-[calc(100vh_-_248px)] overflow-y-scroll sm:h-[calc(100vh_-_292px)] ${selectedConversation.topic}`}>
                                    <Message list={listMessage} loading={loadMsg} mediaLoaded={loadMedia} />
                                </div>
                                <div className='h-[70px]'>
                                    <MessageForm onAdd={handleAddMessage} />
                                </div>
                            </div>
                        </>
                        {showInforChat && (
                            <div className=' absolute top-0 left-0 h-[100%] w-[100%] bg-white shadow-md border-b-[1px] px-5 py-5'>
                                <div className='flex items-center'>
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        setShowInforChat(false)
                                    }}
                                        className='w-[40px] flex justify-center items-center h-[40px] hover:bg-[#dddddd] transition-all'><i className='bx bx-arrow-back text-[22px]'></i></button>
                                    <h3 className='text-center flex-1 text-[15px] font-[600]'>Thông tin trò chuyện</h3>
                                </div>
                                <div className='mt-[10px] sm:h-full sm:overflow-y-scroll'>
                                    <ul className='grid grid-cols-3 sm:grid-cols-2 gap-2'>
                                        {selectedConversation.is_group === 0 && (
                                            <li className='h-[150px] cursor-pointer hover:bg-[#ddd] select-none transition-all bg-white shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]'><Link className='text-[#333] flex w-full h-full justify-center items-center' to={`/thanh-vien/${selectFriendChat(selectedConversation, profile.id).id}`}>Trang cá nhân</Link></li>
                                        )}
                                        {selectedConversation.is_group === 0 && (
                                            <li onClick={() => deletePrivateChat()} className='h-[150px] cursor-pointer hover:bg-[#ddd] select-none transition-all bg-white shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]'>Xóa trò chuyện</li>
                                        )}
                                        {selectedConversation.is_group === 1 && selectedConversation.group_admin.id === profile.id && (
                                            <li
                                                onClick={() => deletePrivateChat()}
                                                className='h-[150px] cursor-pointer hover:bg-[#ddd] select-none transition-all bg-white shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]'>Xóa trò chuyện</li>

                                        )}
                                        {selectedConversation.is_group === 1 && (
                                            <li
                                                onClick={() => leaveGroupChat()}
                                                className='h-[150px] cursor-pointer hover:bg-[#ddd] select-none transition-all bg-white shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]'>Rời khỏi nhóm</li>

                                        )}
                                        {selectedConversation.is_group === 1 && selectedConversation.group_admin.id === profile.id && (
                                            <li
                                                onClick={() => {
                                                    setShowUserAdded(true)
                                                    setShowUserDeleted(false)
                                                    setShowUserViewed(false)
                                                }}
                                                className='h-[150px] cursor-pointer hover:bg-[#ddd] select-none transition-all bg-white shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]'>Thêm thành viên</li>
                                        )}
                                        {selectedConversation.is_group === 1 && selectedConversation.group_admin.id === profile.id && (
                                            <li
                                                onClick={() => setShowChangeChat(true)}
                                                className='h-[150px] cursor-pointer hover:bg-[#ddd] select-none transition-all bg-white shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]'>Đổi thông tin nhóm</li>
                                        )}
                                        {selectedConversation.is_group === 1 && selectedConversation.group_admin.id === profile.id && (
                                            <li
                                                onClick={() => {
                                                    setShowUserAdded(false)
                                                    setShowUserDeleted(true)
                                                    setShowUserViewed(false)
                                                }}
                                                className='h-[150px] cursor-pointer hover:bg-[#ddd] select-none transition-all bg-white shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]'>Xóa thành viên</li>
                                        )}
                                        {selectedConversation.is_group === 1 && (
                                            <li
                                                onClick={() => {
                                                    setShowUserAdded(false)
                                                    setShowUserDeleted(false)
                                                    setShowUserViewed(true)
                                                }}
                                                className='h-[150px] cursor-pointer hover:bg-[#ddd] select-none transition-all bg-white shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]'>Xem thành viên</li>
                                        )}
                                        <li
                                            onClick={() => setShowTopic(!showTopic)}
                                            className={`h-[150px] cursor-pointer hover:bg-[#ddd] transition-all ${!showTopic ? "bg-white" : "bg-[#ddd]"} shadow-md border-[1px] text-[#333] text-[12px] flex justify-center items-center px-2 font-[600]`}>Đổi chủ đề</li>
                                    </ul>
                                    {showTopic && (
                                        <div className='mt-[30px] mb-10'>
                                            <ul className='flex justify-between flex-wrap'>
                                                <li onClick={() => handleChangeTopic(selectedConversation.id, "tp1")} className='w-[45px] shadow-md mx-2 mb-2 h-[45px] tp1 rounded-full border-[1px]'></li>
                                                <li onClick={() => handleChangeTopic(selectedConversation.id, "tp2")} className='w-[45px] shadow-md mx-2 mb-2 h-[45px] tp2 rounded-full border-[1px]'></li>
                                                <li onClick={() => handleChangeTopic(selectedConversation.id, "tp3")} className='w-[45px] shadow-md mx-2 mb-2 h-[45px] tp3 rounded-full border-[1px]'></li>
                                                <li onClick={() => handleChangeTopic(selectedConversation.id, "tp4")} className='w-[45px] shadow-md mx-2 mb-2 h-[45px] tp4 rounded-full border-[1px]'></li>
                                                <li onClick={() => handleChangeTopic(selectedConversation.id, "tp5")} className='w-[45px] shadow-md mx-2 mb-2 h-[45px] tp5 rounded-full border-[1px]'></li>
                                                <li onClick={() => handleChangeTopic(selectedConversation.id, "tp6")} className='w-[45px] shadow-md mx-2 mb-2 h-[45px] tp6 rounded-full border-[1px]'></li>
                                                <li onClick={() => handleChangeTopic(selectedConversation.id, "tp7")} className='w-[45px] shadow-md mx-2 mb-2 h-[45px] tp7 rounded-full border-[1px]'></li>
                                                <li onClick={() => handleChangeTopic(selectedConversation.id, "tp8")} className='w-[45px] shadow-md mx-2 mb-2 h-[45px] tp8 rounded-full border-[1px]'></li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className={`w-[260px] sm:fixed sm:right-0 sm:top-0 sm:bottom-0 sm:w-[70vw] sm:z-40 ${chatMb ? "sm:block" : "sm:hidden"} sm:animate-fadeIn2`}>
                <Chat onShow={setChatMb} />
            </div>
            {selectedConversation && showUserViewed && (
                <div className='fixed top-0 left-0 bottom-0 right-0 bg-[#00000030] z-[90]'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]'>
                        <ListUserView onShow={setShowUserViewed} />
                    </div>
                </div>
            )}

            {selectedConversation && showUserDeleted && (
                <div className='fixed top-0 left-0 bottom-0 right-0 bg-[#00000030] z-[90]'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]'>
                        <ListUserDeleted onShow={setShowUserDeleted} />
                    </div>
                </div>
            )}

            {selectedConversation && showUserAdded && (
                <div className='fixed top-0 left-0 bottom-0 right-0 bg-[#00000030] z-[90]'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]'>
                        <ListUserAdded users={[...selectedConversation.member.filter(item => item.id != profile.id)]} onShow={setShowUserAdded} convId={selectedConversation.id} />
                    </div>
                </div>
            )}
            {selectedConversation && showChangeChat && (
                <div className='fixed top-0 left-0 bottom-0 right-0 bg-[#00000030] z-[90]'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]'>
                        <ChangeInforChat onShow={setShowChangeChat} convId={selectedConversation.id} />
                    </div>
                </div>
            )}


        </section>
    )
}

export default MessagePage;
