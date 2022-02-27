import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
import { changeInforConversationActions } from '../../redux/actions/conversationActions'

function ChangeInforChat({ onShow }) {
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const [name, setName] = useState(selectedConversation.conv_name)
    const [previewAvatar, setPreviewAvatar] = useState(selectedConversation.avatar)
    const [avatarChat, setAvatarChat] = useState(null)
    const [createLoaded, setCreateLoaded] = useState(false)
    const [isEmtyName, setIsEmtyName] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const hanldeAvatar = (e) => {
        const file = e.target.files[0]
        setPreviewAvatar(URL.createObjectURL(file))
        setAvatarChat(file)
    }


    const handleSubmit = async () => {
        if (name === "") {
            setIsEmtyName(true)
            return
        }

        const data = {
            name: name,
            convId: selectedConversation.id
        }

        setIsEmtyName(false)
        setCreateLoaded(true)
        if (avatarChat) {
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

                dispatch(changeInforConversationActions({
                    convId: selectedConversation.id,
                    name: name,
                    avatar: resBodyCloud.url,
                    hasAvatar: true
                }))

                const reqOptions = createHeaders("POST", true, data)
                try {
                    const response = await fetch(`${baseURL}/conversation/change-infor`, reqOptions)
                    if (response.ok) {
                        const resBody = await response.json()
                        if (resBody.errCode === 0) {
                            setCreateLoaded(false)
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
                    onShow(false)
                }
            }
        } else {
            dispatch(changeInforConversationActions({
                convId: selectedConversation.id,
                name: name,
                hasAvatar: false
            }))
            const reqOptions = createHeaders("POST", true, data)
            try {
                const response = await fetch(`${baseURL}/conversation/change-infor`, reqOptions)
                if (response.ok) {
                    const resBody = await response.json()
                    if (resBody.errCode === 0) {
                        setCreateLoaded(false)
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
                onShow(false)

            }
        }
    }

    return (
        <div className='w-[400px] sm:w-[300px] bg-white rounded-md p-3'>
            <div className='flex items-center border-b-[1px] pb-2'>
                <h3 className='text-[15px] font-[600] flex-1 text-[#333] text-center'>Đổi thông tin nhóm</h3>
                <button
                    onClick={() => onShow(false)}
                    className='w-[40px] h-[40px] flex justify-center items-center bg-[#ddd] rounded-full'><i className='bx bx-x text-[22px]'></i></button>
            </div>
            <div className='py-[10px]'>
                <div>
                    <input type="text" className='w-full h-[40px] bg-[#eee] txt-bold-m outline-none px-[10px]' value={name} onChange={(e) => setName(e.target.value)} />
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

export default ChangeInforChat