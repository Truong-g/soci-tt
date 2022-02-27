import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { addConversationActions, selectedConversationActions } from '../../redux/actions/conversationActions';
import { notificationModalAction } from '../../redux/actions/modalActions';

function CreateChat({ onShow }) {
    const profile = useSelector(state => state.auth.data)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [showListMembers, setShowListMembers] = useState(false)
    const [members, setMembers] = useState([profile.id])
    const [name, setName] = useState("")
    const [previewAvatar, setPreviewAvatar] = useState("https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642599877/group_ybpqtk.jpg")
    const [avatarChat, setAvatarChat] = useState(null)
    const [createLoaded, setCreateLoaded] = useState(false)
    const [isEmtyName, setIsEmtyName] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()



    useEffect(() => {
        const getUsers = async () => {
            setLoading(true)
            const reqOptions = createHeaders("GET", true)
            try {
                const response = await fetch(`${baseURL}/user`, reqOptions)
                if (response.ok) {
                    const resBody = await response.json()
                    if (resBody.errCode === 0) {
                        setUsers(resBody.data)
                        setLoading(false)
                    }
                } else {
                    setLoading(false)
                    localStorage.removeItem("access_jwt")
                    if (navigate) {
                        navigate("/dang-nhap")
                    }
                }
            } catch (error) {
                setLoading(false)
                localStorage.removeItem("access_jwt")
                if (navigate) {
                    navigate("/dang-nhap")
                }
            }
        }
        getUsers()

    }, []);

    useEffect(() => {
        // clean up
        return () => {
            previewAvatar && URL.revokeObjectURL(previewAvatar)
        }
    }, [previewAvatar])


    const hanldeAvatar = (e) => {
        const file = e.target.files[0]
        setPreviewAvatar(URL.createObjectURL(file))
        setAvatarChat(file)
    }

    const handleCheckAsArray = e => {
        if (e.target.checked) {
            if (!members.includes(e.target.value)) {
                setMembers(prev => [...prev, e.target.value])
            }
        } else {
            setMembers(prev => [
                ...prev.filter(member => member !== e.target.value)
            ])
        }
    }

    const allowedCreateChat = (arrays) => {
        if (arrays.length < 3) {
            dispatch(notificationModalAction({
                type: "error",
                message: "Vui lòng chọn trên 3 thành viên để tạo nhóm"
            }))
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (name === "") {
            setIsEmtyName(true)
            return
        }

        const data = {
            isGroup: true,
            name: name,
            avatar: "https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642599877/group_ybpqtk.jpg",
            member: members,
        }

        setIsEmtyName(false)
        const validateCheck = allowedCreateChat(members)
        if (validateCheck) {
            if (!avatarChat) {

                const reqOptions = createHeaders("POST", true, data)
                setCreateLoaded(true)
                try {
                    const response = await fetch(`${baseURL}/conversation`, reqOptions)
                    if (response.ok) {
                        const resBody = await response.json()
                        if (resBody.errCode === 0) {
                            setCreateLoaded(false)
                            dispatch(addConversationActions(resBody.data))
                            dispatch(selectedConversationActions(resBody.data))
                            navigate("/tin-nhan")
                            onShow(false)
                        }

                    } else {
                        setCreateLoaded(false)
                        localStorage.removeItem("access_jwt")
                        if (navigate) {
                            navigate("/dang-nhap")
                        }

                    }
                } catch (error) {
                    setCreateLoaded(false)
                    localStorage.removeItem("access_jwt")
                    if (navigate) {
                        navigate("/dang-nhap")
                    }
                }
            } else {
                setCreateLoaded(true)
                const formData = new FormData()
                formData.append("file", avatarChat)
                formData.append("upload_preset", "default")
                formData.append("cloud_name", "dwfjhv7mr")
                const responseCloud = await fetch(`https://api.cloudinary.com/v1_1/dwfjhv7mr/image/upload`, {
                    method: "POST",
                    body: formData
                })
                if (responseCloud.ok) {
                    const resBodyCloud = await responseCloud.json()
                    data.avatar = resBodyCloud.url
                    const reqOptions = createHeaders("POST", true, data)
                    try {
                        const response = await fetch(`${baseURL}/conversation`, reqOptions)
                        if (response.ok) {
                            const resBody = await response.json()
                            if (resBody.errCode === 0) {
                                setCreateLoaded(false)
                                dispatch(addConversationActions(resBody.data))
                                dispatch(selectedConversationActions(resBody.data))
                                navigate("/tin-nhan")
                                onShow(false)
                            }

                        } else {
                            setCreateLoaded(false)
                            localStorage.removeItem("access_jwt")
                            if (navigate) {
                                navigate("/dang-nhap")
                            }

                        }
                    } catch (error) {
                        setCreateLoaded(false)
                        localStorage.removeItem("access_jwt")
                        if (navigate) {
                            navigate("/dang-nhap")
                        }
                    }
                } else {
                    setCreateLoaded(true)
                    const reqOptions = createHeaders("POST", true, data)
                    try {
                        const response = await fetch(`${baseURL}/conversation`, reqOptions)
                        if (response.ok) {
                            const resBody = await response.json()
                            if (resBody.errCode === 0) {
                                setCreateLoaded(false)
                                dispatch(addConversationActions(resBody.data))
                                dispatch(selectedConversationActions(resBody.data))
                                navigate("/tin-nhan")
                                onShow(false)
                            }

                        } else {
                            setCreateLoaded(false)
                            localStorage.removeItem("access_jwt")
                            if (navigate) {
                                navigate("/dang-nhap")
                            }

                        }
                    } catch (error) {
                        setCreateLoaded(false)
                        localStorage.removeItem("access_jwt")
                        if (navigate) {
                            navigate("/dang-nhap")
                        }
                    }
                }
            }
        }
    }





    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-50'>
            <div className='min-w-[500px] p-[15px] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md rounded-md'>
                <h3 className='text-[15px] text-[#333] font-[600] text-center relative'>Tạo nhóm chat
                    <button
                        onClick={() => onShow(false)}
                        className='w-[30px] h-[30px] bg-[#ddd] absolute right-0 top-1/2 -translate-y-1/2 rounded-full flex justify-center items-center'>
                        <i className='bx bx-x text-[18px] text-[#555]'></i>
                    </button>
                </h3>
                <div className='w-[90%] mx-auto mt-3'>
                    <div className='mb-2'>
                        <input type="text" className='border border-[#ccc] bg-[#eee] w-full h-[30px] px-2 py-1 outline-none txt-bold-m' placeholder='Nhập tên chat' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        {members.length > 1 && members.map((item, index) => {
                            return (
                                <span className={`txt bg-[#ddd] items-center mr-2 px-2 py-1 rounded-xl ${!users.find(user => user.id === item) ? "hidden" : "inline-flex"}`} key={index}>
                                    {users.find(user => user.id === item)?.fullname}
                                    <i className='bx bx-x text-[16px] text-[#333] ml-1 '></i>
                                </span>
                            )
                        })}
                    </div>
                    <div className='w-full border p-[5px] bg-[#eee] mt-2'>
                        <div
                            className='bg-[#ddd] p-[3px] cursor-pointer'
                            onClick={() => setShowListMembers(!showListMembers)}
                        >
                            Chọn thành viên
                        </div>

                        <div className={`max-h-[200px] overflow-y-scroll ${showListMembers ? "block" : "hidden"}`}>
                            {loading && (
                                <div className='py-2 flex justify-center items-center'>
                                    <i className='bx bx-loader-circle bx-spin text-[18px] text-[#555]' ></i>
                                </div>
                            )}
                            {users.map((item, index) => {
                                return (
                                    <label htmlFor={item.id} className='flex items-center justify-between px-2 py-2 cursor-pointer' key={index}>
                                        <div className='flex items-center'>
                                            <div className='w-[30px] h-[30px] rounded-full overflow-hidden mr-2'>
                                                <img src={item.avatar} alt="" className="w-full object-cover" />
                                            </div>
                                            <div className='txt-bold-m select-none'>{item.fullname}</div>
                                        </div>
                                        <input type="checkbox" id={item.id} value={item.id} onChange={handleCheckAsArray} />
                                    </label>
                                )
                            })}

                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <div>
                        <div
                            className='w-[100px] h-[100px] overflow-hidden rounded-full mx-auto'
                        >
                            <div
                                className='w-full pt-[100%] bg-center bg-cover bg-no-repeat rounded-full relative'
                                style={{ backgroundImage: `url("${previewAvatar}")` }}
                            >
                                <div className='absolute top-0 left-0 right-0 bottom-0 bg-[#00000090] flex justify-center items-center overflow-hidden cursor-pointer'>
                                    <div className='inline-block'>
                                        <i className='bx bxs-image-add text-white text-[30px]'></i>
                                    </div>
                                    <input type="file" onChange={hanldeAvatar} className='appearance-none block absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer' />
                                </div>
                            </div>
                        </div>
                        <div className='text-center'>
                            <span className='txt'>Chọn ảnh đại diện</span>
                        </div>
                    </div>
                </div>
                <div className='mt-[10px] text-center'>
                    {isEmtyName && (
                        <p className='text-[13px] mb-[5px] text-red-600'>Tên nhóm không được để trống</p>
                    )}
                    <button
                        onClick={() => handleSubmit()}
                        className={`px-3 py-2 text-[13px] disabled:bg-[#ddd] disabled:text-[#333] font-[600] bg-main-color text-white`} disabled={createLoaded}>
                        {createLoaded ? (
                            <i className='bx bx-loader-circle bx-spin text-[20px]'></i>
                        ) : "Tạo"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateChat;
