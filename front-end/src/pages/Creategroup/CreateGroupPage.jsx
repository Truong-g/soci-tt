import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BG_USER, LOGIN } from '../../assets/images';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { createGroupActions } from '../../redux/actions/groupAction';

function CreateGroupPage() {

    const profile = useSelector(state => state.auth.data)
    const friends = useSelector(state => state.friend.data)
    const [selectIndex, setSelectIndex] = useState(0)
    const [disableNext, setDisableNext] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showModalMember, setShowModalMember] = useState(false)
    const [members, setMembers] = useState([profile.id])

    const [values, setValues] = useState({
        groupName: "",
        intro: "",
        avatar: null,
        background: null,
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [previewAvatar, setPreviewAvatar] = useState("https://res.cloudinary.com/dwfjhv7mr/image/upload/v1644250322/OIP_frawpa.jpg")
    const [previewBackground, setPreviewBackground] = useState("https://res.cloudinary.com/dwfjhv7mr/image/upload/v1644250491/nature-3082832_960_720_etedg1.jpg")

    useEffect(() => {
        // clean up
        return () => {
            previewAvatar && URL.revokeObjectURL(previewAvatar)
        }
    }, [previewAvatar])

    useEffect(() => {
        // clean up
        return () => {
            previewBackground && URL.revokeObjectURL(previewBackground)
        }
    }, [previewBackground])

    const hanldeAvatar = (e) => {
        const file = e.target.files[0]
        setPreviewAvatar(URL.createObjectURL(file))
        setValues(prev => {
            return {
                ...prev,
                avatar: file
            }
        })
    }
    const hanldeBackground = (e) => {
        const file = e.target.files[0]
        setPreviewBackground(URL.createObjectURL(file))
        setValues(prev => {
            return {
                ...prev,
                background: file
            }
        })
    }


    const handleValue = (e) => {
        setValues(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleCheckAsArray = e => {
        if(e.target.checked){
            if(!members.includes(e.target.value)){
                setMembers(prev => [...prev, e.target.value])
            }
        }else{
            setMembers(prev => [
                ...prev.filter(member => member !== e.target.value)
            ])
        }
    }


    const element = [
        <div className='w-full'>
            <h1 className='text-[1.2rem] text-[#333] font-[600] mb-2'>Tên nhóm</h1>
            <div className='text-[0.95rem] font-[400] text-[#555] mb-3'>
                <input type="text" className='h-[40px] w-full bg-[#eee] outline-none rounded-[5px] px-[10px]'
                    name='groupName'
                    value={values.groupName}
                    onChange={(e) => handleValue(e)}
                    placeholder='Tên nhóm' />
            </div>
        </div>,
        <div className='w-full'>
            <h1 className='text-[1.2rem] text-[#333] font-[600] mb-2'>Giới thiệu</h1>
            <div className='w-full mb-3'>
                <textarea className='w-full outline-none bg-[#eee] border-[1px] border-gray-600 p-3 rounded-lg text-[0.95rem] font-[400] text-[#555]'
                    value={values.intro}
                    name='intro'
                    onChange={(e) => handleValue(e)}
                    placeholder='Hãy nhập một cái gì đó trông thật ngầu nào!' rows="5"></textarea>
            </div>
        </div>,
        <div className='w-full'>
            <h1 className='text-[1.2rem] text-[#333] font-[600] mb-2'>Thêm thành viên</h1>
            <div className='w-full mb-3'>
                <div className='w-[70%] mx-auto h-[40px] bg-[#ddd] rounded-[5px] cursor-pointer relative'>
                    <div
                        className='flex items-center h-full px-[10px] select-none'
                        onClick={() => setShowModalMember(!showModalMember)}
                    >
                        Chọn thành viên
                    </div>
                    <div className={`max-h-[400px] absolute top-full w-full left-0 shadow-md cursor-default py-1 ${showModalMember ? "block" : "hidden"}`}>
                        {friends.map((item, index) => {
                            return (
                                <label htmlFor={item.id} key={index} className='select-none flex justify-between items-center py-[10px] px-[15px] cursor-pointer mb-1'>
                                    <div className='flex items-center'>
                                        <div className='w-[30px] h-[30px] overflow-hidden rounded-full mr-2'>
                                            <img src={item.avatar} className='object-cover w-full' alt={item.avatar} />
                                        </div>
                                        <span className='txt-bold-s'>{item.fullname}</span>
                                    </div>
                                    <input type="checkbox" id={item.id} value={item.id} onChange={handleCheckAsArray} />
                                </label>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>,
        <div className='w-full'>
            <h1 className='text-[1.2rem] text-[#333] font-[600] mb-2'>Ảnh đại diện</h1>
            <div className='w-full mb-3'>
                <div className='w-[60%] mx-auto rounded-[10px] overflow-hidden'>
                    <img src={previewAvatar} alt="" className='w-full object-cover' />
                </div>
                <div className='text-center mt-2 relative overflow-hidden'>
                    <button className='text-[13px] font-[600] text-[#333] bg-[#ddd] px-3 py-2'>Thay đổi</button>
                    <input type="file"
                        className='absolute top-0 cursor-pointer left-0 right-0 bottom-0 w-full h-full appearance-none opacity-0'
                        onChange={(e) => hanldeAvatar(e)}
                    />
                </div>
            </div>

        </div>,
        <div className='w-full'>
            <h1 className='text-[1.2rem] text-[#333] font-[600] mb-2'>Ảnh bìa</h1>
            <div className='w-full mb-3'>
                <div className='w-[60%] sm:w-full mx-auto rounded-[10px] overflow-hidden'>
                    <img src={previewBackground} alt="" className='w-full object-cover' />
                </div>
                <div className='text-center mt-2 relative overflow-hidden'>
                    <button className='text-[13px] font-[600] text-[#333] bg-[#ddd] px-3 py-2'>Thay đổi</button>
                    <input type="file"
                        className='absolute top-0 left-0 right-0 bottom-0 w-full h-full cursor-pointer appearance-none opacity-0'
                        onChange={(e) => hanldeBackground(e)}
                    />
                </div>
            </div>

        </div>
    ]

   


    const changeSlide = (status) => {
        let copyIndex = selectIndex

        if (status === "next") {
            if (selectIndex < element.length - 1) {
                setSelectIndex(selectIndex + 1)
                copyIndex += 1
            }
            if (copyIndex >= element.length - 1) {
                setDisableNext(true)
            }
        } else {
            if (copyIndex >= 0) {
                setSelectIndex(selectIndex - 1)
                copyIndex -= 1
            }
            if (copyIndex < 0) {
                navigate(-1)
            }
        }
        if (copyIndex < element.length - 1) setDisableNext(false)
    }

    const handleSubmit = async () => {
        if (!values.groupName) {
            setError("Tên nhóm không được để trống!")
            return
        }
        setLoading(true)
        const data = {
            groupName: values.groupName,
            intro: values.intro || null,
            member: members
        }
        if (values.avatar === null) {
            data.avatar = "https://res.cloudinary.com/dwfjhv7mr/image/upload/v1644250322/OIP_frawpa.jpg"
        } else {
            const formData = new FormData()
            formData.append("file", values.avatar)
            formData.append("upload_preset", "default")
            formData.append("cloud_name", "dwfjhv7mr")
            const responseCloud = await fetch(`https://api.cloudinary.com/v1_1/dwfjhv7mr/image/upload`, {
                method: "POST",
                body: formData
            })
            if (responseCloud.ok) {
                const resBodyCloud = await responseCloud.json()
                data.avatar = resBodyCloud.url
            } else {
                data.avatar = values.avatar
            }
        }

        if (values.background === null) {
            data.background = "https://res.cloudinary.com/dwfjhv7mr/image/upload/v1644250491/nature-3082832_960_720_etedg1.jpg"
        } else {
            const formData = new FormData()
            formData.append("file", values.background)
            formData.append("upload_preset", "default")
            formData.append("cloud_name", "dwfjhv7mr")
            const responseCloud = await fetch(`https://api.cloudinary.com/v1_1/dwfjhv7mr/image/upload`, {
                method: "POST",
                body: formData
            })
            if (responseCloud.ok) {
                const resBodyCloud = await responseCloud.json()
                data.background = resBodyCloud.url
            } else {
                data.background = values.background
            }
        }

        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/group`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setLoading(false)
                    dispatch(createGroupActions(resBody.data))
                    navigate(-1)

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
        <section className='sm:mb-[76px] sm:h-[calc(100vh_-_178px)] sm:overflow-y-scroll hide-scroll'>
            <div className='sm:w-full w-[80%] mx-auto sm:mx-0 shadow-sm bg-white rounded-[5px]'>
                <div className='w-full flex justify-between items-center p-5 pb-0'>
                    <div>
                        <button
                            className='text-[13px] font-[600] text-white bg-main-color px-3 py-2'
                            onClick={() => changeSlide("prev")}
                        >
                            Quay lại
                        </button>
                    </div>
                    <div>


                        {disableNext ? (
                            <button
                                className='text-[13px] font-[600] text-white bg-main-color px-3 py-2 disabled:bg-[#ddd] disabled:flex disabled:justify-center disabled:items-center disabled:text-[#555]'
                                onClick={() => handleSubmit()}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className='bx bx-loader-circle bx-spin text-[18px] mr-1' ></i>
                                        <span>Vui lòng đợi...</span>
                                    </>
                                ) : "Cập nhập"}
                            </button>
                        ) : (
                            <button
                                className='text-[13px] font-[600] text-white bg-main-color px-3 py-2'
                                onClick={() => changeSlide("next")}
                            >
                                Tiếp
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className='flex items-center text-[13px] text-red-600 mt-2 px-3'>
                        <i class='bx bxs-error text-[18px] mr-1'></i>
                        <span className=''>{error}</span>
                    </div>
                )}
                <div className='relative bg-white'>
                    {element.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={`absolute top-0 left-0 right-0 w-full bg-white p-3 pt-[20px] ${selectIndex === index ? "block" : "hidden"}`}>
                                {item}
                            </div>
                        )
                    })}

                </div>

            </div>
        </section>
    );
}

export default CreateGroupPage;
