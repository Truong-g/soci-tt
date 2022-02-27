

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
import { addMemberConversationActions } from '../../redux/actions/conversationActions'

function ListUserAdded({ onShow, users, convId }) {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const getUsers = async () => {
            setLoading(true)
            const reqOptions = createHeaders("GET", true)
            try {
                const response = await fetch(`${baseURL}/user`, reqOptions)
                if (response.ok) {
                    const resBody = await response.json()
                    if (resBody.errCode === 0) {
                        const ids = users.map(item => item.id)
                        const arrays = resBody.data.filter(item => {
                            return ids.indexOf(item.id) === -1
                        })
                        setList(arrays)
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

    }, [])

    const handleAddMemberConversation = async (user) => {

        dispatch(addMemberConversationActions({
            convId: convId,
            user: {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            }
        }))
        const data = { convId: convId, userId: user.id }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/conversation/add-member`, reqOptions)
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
                <h3 className='text-[15px] font-[600] flex-1 text-[#333] text-center'>Thêm thành viên</h3>
                <button
                    onClick={() => onShow(false)}
                    className='w-[40px] h-[40px] flex justify-center items-center bg-[#ddd] rounded-full'><i className='bx bx-x text-[22px]'></i></button>
            </div>
            <div className='py-[10px]'>
                {loading && (
                    <p className='txt text-center'>Vui lòng chờ...</p>
                )}
                <div>
                    {list.map((item, index) => {
                        return (
                            <div key={index}
                                className={`flex items-center hover:bg-[#eeee] relative p-[5px] rounded-[15px] select-none cursor-pointer`}>
                                <div className='w-[35px] h-[35px] rounded-full overflow-hidden'>
                                    <img src={item.avatar} className='w-[100%] h-[100%]' />
                                </div>
                                <div className='pl-[10px] txt-bold-m flex-1'>{item.fullname}</div>
                                <p className='text-[12px] text-main-color hidden text-isAdded'>Đã thêm</p>
                                <div className='w-[30px] h-[30px] btn-isAdded flex justify-center items-center text-white bg-main-color rounded-full'>
                                    <i className='bx bx-plus' ></i>
                                </div>
                                <button className='absolute top-0 left-0 bottom-0 bg-transparent right-0 z-50'
                                    onClick={(e) => {
                                        e.target.parentElement.style.backgroundColor = "#eeee"
                                        e.target.parentElement.querySelector(".text-isAdded").style.display = "block"
                                        e.target.parentElement.querySelector(".btn-isAdded").style.display = "none"
                                        handleAddMemberConversation(item)
                                        e.target.disabled = true
                                    }}></button>
                            </div>
                        )
                    })}
                </div>
                {list.length === 0 && !loading && (
                    <p className='txt text-center'>Danh sách người dùng trống!</p>
                )}
            </div>
        </div>
    )
}

export default ListUserAdded