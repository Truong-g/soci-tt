

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { STORY } from '../../assets/images'
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { notificationModalAction } from '../../redux/actions/modalActions';
import { createStoryActions } from '../../redux/actions/storyActions';

function FormStory({ onShow }) {
    const profile = useSelector(state => state.auth.data)
    const [preview, setPreview] = useState(null)
    const [media, setMedia] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        // clean up
        return () => {
            preview && URL.revokeObjectURL(preview)
        }
    }, [preview])

    const handleMedia = (e) => {
        const file = e.target.files[0]
        setPreview(URL.createObjectURL(file))
        setMedia(file)
    }

    const createStoryReq = async () => {
        setLoading(true)
        const data = {}
        const formData = new FormData()
        formData.append("file", media)
        formData.append("upload_preset", "default")
        formData.append("cloud_name", "dwfjhv7mr")
        const responseCloud = await fetch(`https://api.cloudinary.com/v1_1/dwfjhv7mr/image/upload`, {
            method: "POST",
            body: formData
        })
        if (responseCloud.ok) {
            const resBodyCloud = await responseCloud.json()
            data.link = resBodyCloud.url
        } else {
            setLoading(false)
            dispatch(notificationModalAction({
                type: "error",
                message: "Tải ảnh thất bại"
            }))
            return
        }
        const reqOption = createHeaders("POST", true, data)

        try {
            const response = await fetch(`${baseURL}/stories`, reqOption)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setLoading(false)
                    dispatch(createStoryActions({
                        user: profile,
                        link: data.link,
                        id_story: resBody.data
                    }))
                    onShow(false)
                }
            } else {
                setLoading(false)
                localStorage.removeItem("access_jwt")
                navigate("/dang-nhap")
            }
        } catch (error) {
            setLoading(false)
            localStorage.removeItem("access_jwt")
            navigate("/dang-nhap")
        }
    }

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-50'>
            <div className='bg-white p-3 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg'>
                <div className='w-[400px]'>
                    <div className='w-[230px] mx-auto'>
                        <div className='w-full pt-[154%] bg-center bg-cover bg-no-repeat rounded-[10px]'
                            style={{ backgroundImage: `url("${preview ? preview : STORY}")` }}
                        >
                        </div>
                    </div>
                    <div className='flex justify-center w-full items-center mt-3'>
                        <button
                            className='h-[30px] px-[1rem] text-[#333] text-[13px] font-[600] bg-[#ddd] mr-1'
                            onClick={() => onShow(false)}
                        >Đóng</button>
                        <button className='h-[30px] px-[1rem] text-white text-[13px] font-[600] bg-main-color mx-1 relative overflow-hidden'>
                            Tải ảnh
                            <input type="file" className='absolute top-0 left-0 right-0 bottom-0 appearance-none block w-full h-full opacity-0'
                                onChange={(e) => handleMedia(e)}
                            />
                        </button>
                        <button
                            className='h-[30px] px-[1rem] text-white text-[13px] font-[600] bg-main-color ml-1 disabled:bg-[#ddd] disabled:text-[#555]'
                            disabled={loading}
                            onClick={() => createStoryReq()}

                        >
                            {loading ? (
                                <i className='bx bx-loader-circle bx-spin text-[18px] mr-1' ></i>
                            ) : "Đăng"}

                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormStory;
