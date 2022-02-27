

import { memo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GridPhoto from '../../components/Gridphoto/GridPhoto';
import '../../styles/components/text.scss';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';

function HomeRight() {
    const profile = useSelector(state => state.auth.data)
    const users = useSelector(state => state.user.data)
    const friends = useSelector(state => state.friend.data)
    const groups = useSelector(state => state.group.data)

    const [requiredUsers, setRequiredUsers] = useState([])
    const [acceptedFriends, setAcceptedFriends] = useState([])
    const [listImg, setListImg] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        handleRequiredUsers()
        handleAcceptedFriends()

    }, [])

    const handleRequiredUsers = () => {
        const ids = friends.map(item => item.id)
        const arrays = users.filter(item => {
            return ids.indexOf(item.id) === -1
        })
        setRequiredUsers(arrays)
    }

    const handleAcceptedFriends = () => {
        setAcceptedFriends(prev => {
            return [...prev.filter(item => item.status === 2 && item.active_id === profile.id)]
        })
    }


    useEffect(() => {
        getImages()
        return () => {
            setListImg([])
        }
    }, [])

    const getImages = async () => {
        const reqOptions = createHeaders("GET", true)
        try {
            const response = await fetch(`${baseURL}/image/${profile.id}&limit=${6}`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setListImg(resBody.data)
                }
            } else {
                localStorage.removeItem("access_jwt")
                if (navigate) {
                    navigate("/dang-nhap")
                }
            }
        } catch (error) {
            localStorage.removeItem("access_jwt")
            if (navigate) {
                navigate("/dang-nhap")
            }
        }
    }


    return (
        <div className='w-[260px] sm:w-full'>
            {/* Notification birthday */}
            <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                <div className='flex items-center'>
                    <div className='w-[50px] h-[50px] overflow-hidden rounded-full mr-2'>
                        <img src="https://freepngimg.com/thumb/cake/36942-2-birthday-cake-photos.png" alt="" className="w-full" />
                    </div>
                    <div>
                        <p className='text-[12px] text-[#777] font-[500]'>Hôm nay là sinh nhật của
                            <strong> <Link to="">Nguyễn Văn A</Link></strong>
                        </p>
                    </div>
                </div>
            </div>

            {/* request friend */}
            <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                <div className='flex justify-between items-center mb-1'>
                    <span className="text-[13px] text-[#333] font-[600]">Yêu cầu kết bạn</span>
                    <Link to="/thanh-vien" className='text-main-color text-[13px] font-[500]'>Tất cả</Link>
                </div>
                <ul className='p-2 grid grid-cols-1 sm:grid-cols-1 gap-6'>
                    {requiredUsers.length === 0 && (<li className='txt text-center'>Không có bạn bè đề xuất</li>)}
                    {requiredUsers.map((item, index) => {
                        return (
                            <li className='sm:p-[10px]' key={index}>
                                <div className='flex'>
                                    <div className='w-[40px] h-[40px] rounded-full overflow-hidden mr-2'>
                                        <img src={item.avatar} alt="" className="w-full" />
                                    </div>
                                    <div className='flex flex-col'>
                                        <h4 className='txt-bold-s'>{item.fullname}</h4>
                                        <span className='txt'>12 bạn chung</span>
                                    </div>
                                </div>
                                <div className='flex mt-3 px-3 sm:px-0 justify-between'>
                                    <button className='bg-main-color w-[90px] sm:w-auto text-[#fff] text-[12px] font-[600] rounded-[20px] px-5 sm:px-3 sm:py-1 py-2'>Kết bạn</button>
                                    <button className='bg-[#ddd] w-[90px] sm:w-auto text-[#555] text-[12px] font-[600] rounded-[20px] px-5 sm:px-3 sm:py-1 py-2'>Xóa</button>
                                </div>
                                <div></div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* confirm friend */}

            <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                <div className='flex justify-between items-center mb-1'>
                    <span className="text-[13px] text-[#333] font-[600]">Chấp nhận kết bạn</span>
                    <Link to="/thanh-vien" className='text-main-color text-[13px] font-[500]'>Tất cả</Link>
                </div>
                <ul className='p-2 grid grid-cols-1 gap-3'>
                    {acceptedFriends.length === 0 && (<li className='txt text-center'>Không có yêu cầu kết bạn nào!</li>)}
                    {acceptedFriends.map((item, index) => {
                        return (
                            <li className='bg-[#ddd] p-3 rounded-[12px]' key={index}>
                                <div className='flex'>
                                    <div className='flex-1 flex items-center'>
                                        <div className='w-[35px] h-[35px] rounded-full overflow-hidden mr-3'>
                                            <img src={item.avatar} alt="" />
                                        </div>
                                        <div className='flex flex-col'>
                                            <h4 className="txt-bold-s">{item.fullname}</h4>
                                            <span className='txt'>14 bạn chung</span>
                                        </div>

                                    </div>
                                    <div className='w-[30px] h-[30px] rounded-full bg-[#fff] ml-3 text-[22px] text-[#333] flex justify-center items-center'>
                                        <i className='bx bx-chevron-right'></i>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* group suggest */}
            <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                <div className='flex justify-between items-center mb-1'>
                    <span className="text-[13px] text-[#333] font-[600]">Nhóm đề nghị</span>
                    <Link to="/nhom" className='text-main-color text-[13px] font-[500]'>Tất cả</Link>
                </div>
                <ul className='p-2 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {groups.slice(0, 2).map((item, index) => {
                        return (
                            <li key={index}>
                                <div
                                    className='pt-[70%] bg-center bg-cover bg-no-repeat w-full overflow-hidden rounded-[5px] block'
                                    style={{ backgroundImage: `url("${item.group_avatar}")` }}
                                >
                                </div>
                                <div className='w-[100%] mt-3'>
                                    <button className='h-[40px] rounded-[20px] w-[100%] bg-[#ddd] flex justify-center items-center'>
                                        <i className='bx bx-edit mr-2'></i>
                                        <span className='txt'>Tham gia</span>
                                    </button>
                                </div>
                            </li>
                        )
                    })}


                </ul>
            </div>

            {/* event */}
            <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                <div className='flex justify-between items-center mb-1'>
                    <span className="text-[13px] text-[#333] font-[600]">Sự kiện</span>
                    <Link to="" className='text-main-color text-[13px] font-[500]'>Tất cả</Link>
                </div>
                <ul className='p-2 grid grid-cols-1 gap-4'>
                    <li className='flex items-center'>
                        <div className='w-[55px] h-full mr-3 flex justify-center items-center bg-emerald-500 rounded-[3px]'>
                            <div className='py-2'>
                                <span className='text-[14px] font-[600] uppercase leading-none block text-white'>APR</span>
                                <h4 className='text-[16px] font-[700] uppercase leading-none block text-white'>22</h4>
                            </div>
                        </div>
                        <div className='flex-1'>
                            <h4 className='txt-bold-m mb-1'>Meeting with clients</h4>
                            <p className='txt h-[36px] overflow-text'>41 madison ave, floor 24 new work,ddddddd NY 10010</p>
                        </div>
                    </li>
                    <li className='flex items-center'>
                        <div className='w-[55px] h-full mr-3 flex justify-center items-center bg-emerald-500 rounded-[3px]'>
                            <div className='py-2'>
                                <span className='text-[14px] font-[600] uppercase leading-none block text-white'>APR</span>
                                <h4 className='text-[16px] font-[700] uppercase leading-none block text-white'>22</h4>
                            </div>
                        </div>
                        <div className='flex-1'>
                            <h4 className='txt-bold-m mb-1'>Meeting with clients</h4>
                            <p className='txt h-[36px] overflow-text'>41 madison ave, floor 24 new work,ddddddd NY 10010</p>
                        </div>
                    </li>
                    <li className='flex items-center'>
                        <div className='w-[55px] h-full mr-3 flex justify-center items-center bg-emerald-500 rounded-[3px]'>
                            <div className='py-2'>
                                <span className='text-[14px] font-[600] uppercase leading-none block text-white'>APR</span>
                                <h4 className='text-[16px] font-[700] uppercase leading-none block text-white'>22</h4>
                            </div>
                        </div>
                        <div className='flex-1'>
                            <h4 className='txt-bold-m mb-1'>Meeting with clients</h4>
                            <p className='txt h-[36px] overflow-text'>41 madison ave, floor 24 new work,ddddddd NY 10010</p>
                        </div>
                    </li>
                </ul>
            </div>

            <GridPhoto list={listImg} />

        </div>
    )
}

export default memo(HomeRight);
