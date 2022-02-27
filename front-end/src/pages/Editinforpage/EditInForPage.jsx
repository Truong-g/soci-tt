

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BG_USER } from '../../assets/images';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { updateProfileActions } from '../../redux/actions/authActions';




function EditInForPage() {
    const profile = useSelector(state => state.auth.data)
    const [selectIndex, setSelectIndex] = useState(0)
    const [disableNext, setDisableNext] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const [values, setValues] = useState({
        fullname: profile.fullname,
        phone: profile.phone ? profile.phone : "",
        address: profile.address ? profile.address : "",
        day: profile.birthday ? new Date(profile.birthday).getDay() : "",
        month: profile.birthday ? new Date(profile.birthday).getMonth() : "",
        year: profile.birthday ? new Date(profile.birthday).getFullYear() : "",
        intro: profile.intro ? profile.intro : "",
        avatar: profile.avatar,
        background: profile.background ? profile.background : null,
        learn_at: profile.learn_at ? profile.learn_at : "",
        work_at: profile.work_at ? profile.work_at : "",
        duty: profile.duty ? profile.duty : "",
        case_love: profile.case_love ? profile.case_love : "",
    })

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [previewAvatar, setPreviewAvatar] = useState(profile.avatar)
    const [previewBackground, setPreviewBackground] = useState(profile.background || BG_USER)

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

    const element = [
        <div className='w-full'>
            <h1 className='text-[1.2rem] text-[#333] font-[600] mb-2'>Thông tin cá nhân</h1>
            <div className='text-[0.95rem] font-[400] text-[#555] mb-3'>
                <input type="text" className='h-[40px] w-full bg-[#eee] outline-none rounded-[5px] px-[10px]'
                    name='fullname'
                    value={values.fullname}
                    onChange={(e) => handleValue(e)}
                    placeholder='Họ tên' />
            </div>
            <div className='w-full mb-3'>
                <input type="number" className='h-[40px] w-full bg-[#eee] outline-none mr-2 rounded-[5px] px-[10px]'
                    value={values.phone}
                    name='phone'
                    onChange={(e) => handleValue(e)}
                    placeholder='Số điện thoại' />
            </div>
            <div className='w-full mb-3'>
                <input type="text" className='h-[40px] w-full bg-[#eee] outline-none mr-2 rounded-[5px] px-[10px]'
                    value={values.address}
                    name='address'
                    onChange={(e) => handleValue(e)}
                    placeholder='Địa chỉ' />
            </div>
            <h1 className='text-[1.2rem] text-[#333] font-[600] w-full mb-2'>Ngày sinh</h1>
            <div className='flex text-[0.95rem] font-[400] text-[#555] mb-3 sm:justify-between w-full'>
                <input type="number" className='h-[40px] flex-1 bg-[#eee] outline-none mr-1 rounded-[5px] px-[10px] sm:w-[40px]'
                    value={values.day}
                    name='day'
                    onChange={(e) => handleValue(e)}
                    placeholder='Ngày' />
                <input type="number" className='h-[40px] flex-1 bg-[#eee] outline-none mx-1 rounded-[5px] px-[10px] sm:w-[40px]'
                    value={values.month}
                    name='month'
                    onChange={(e) => handleValue(e)}

                    placeholder='Tháng' />
                <input type="number" className='h-[40px] flex-1 bg-[#eee] outline-none ml-1 rounded-[5px] px-[10px] sm:w-[40px]'
                    value={values.year}
                    name='year'
                    onChange={(e) => handleValue(e)}
                    placeholder='Năm' />
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

        </div>,
        <div className='w-full'>
            <h1 className='text-[1.2rem] text-[#333] font-[600] mb-2'>Thông tin khác</h1>
            <div className='w-full mb-3'>
                <input type="text" className='h-[40px] w-full bg-[#eee] outline-none mr-2 rounded-[5px] px-[10px]'
                    value={values.learn_at}
                    name='learn_at'
                    onChange={(e) => handleValue(e)}
                    placeholder='Học tại' />
            </div>
            <div className='w-full mb-3'>
                <input type="text" className='h-[40px] w-full bg-[#eee] outline-none mr-2 rounded-[5px] px-[10px]'
                    value={values.work_at}
                    onChange={(e) => handleValue(e)}
                    name='work_at'
                    placeholder='Làm việc tại' />
            </div>
            <div className='w-full mb-3'>
                <input type="text" className='h-[40px] w-full bg-[#eee] outline-none mr-2 rounded-[5px] px-[10px]'
                    value={values.duty}
                    onChange={(e) => handleValue(e)}
                    name='duty'
                    placeholder='Chức vụ' />
            </div>
            <div className='w-full mb-3'>
                <input type="text" className='h-[40px] w-full bg-[#eee] outline-none mr-2 rounded-[5px] px-[10px]'
                    value={values.case_love}
                    onChange={(e) => handleValue(e)}
                    name='case_love'
                    placeholder='Tình trường' />
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
            if (copyIndex > 0) {
                setSelectIndex(selectIndex - 1)
                copyIndex -= 1
            }
            if (copyIndex <= 0) {
                navigate(-1)
            }
        }
        if (copyIndex < element.length - 1) setDisableNext(false)
    }

    const handleSubmit = async () => {
        if (!values.fullname) {
            setError("Họ tên không được để trống!")
            return
        }
        const birthday = Date.parse(`${values.year}-${values.month}-${values.day}`)
        if (!birthday) {
            setError("Ngày sinh không hợp lệ")
            return
        }
        setLoading(true)
        const data = {
            fullname: values.fullname,
            phone: values.phone || null,
            address: values.address || null,
            birthday: birthday || null,
            intro: values.intro || null,
            learn_at: values.learn_at || null,
            work_at: values.work_at || null,
            duty: values.duty || null,
            case_love: values.case_love || null,
        }
        if (values.avatar === profile.avatar) {
            data.avatar = values.avatar
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

        if (values.background === profile.background) {
            data.background = values.background
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
            const response = await fetch(`${baseURL}/user/update`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setLoading(false)
                    dispatch(updateProfileActions(resBody.data))
                    navigate(`/thanh-vien/${resBody.data.id}`)
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
        </section >
    )
}

export default EditInForPage;
