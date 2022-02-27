import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import GridPhoto from '../Gridphoto/GridPhoto'

function UserSideBar({ user, userId }) {
    const [listImg, setListImg] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        getImages()

        return () => {
            setListImg([])
        }
    }, [])

    const getImages = async () => {
        const reqOptions = createHeaders("GET", true)
        try {
            const response = await fetch(`${baseURL}/image/${userId}&limit=${6}`, reqOptions)
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
            <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                <div>
                    <h3 className='txt-bold-m border-b-[1px] pb-[5px] flex items-center justify-center'>
                        <i className='bx bx-briefcase-alt-2 text-[16px] mr-2'></i> Công việc
                    </h3>
                    {user ? (
                        <div className='mt-[5px]'>
                            {user.work_at && (
                                <p className='text-[12px]'><span className='txt-bold-s'>Nơi làm việc: </span>{user.work_at}</p>
                            )}
                            {user.duty && (
                                <p className='text-[12px]'><span className='txt-bold-s'>Chức vụ: </span>{user.duty}</p>
                            )}
                            {!user.work_at && !user.duty && (
                                <div className='mt-[5px] flex justify-center items-center'>
                                    <p className='text-[12px]'>Chưa cập nhập</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='mt-[5px] flex justify-center items-center'>
                            <p className='text-[12px]'>Chưa cập nhập</p>
                        </div>
                    )}

                </div>
            </div>
            <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                <h2 className='txt-bold-m mb-4'>Giới thiệu</h2>
                <p className='txt mb-[10px]'>{user?.intro ? user.intro : "Chưa cập nhập"}</p>
                <div className='h-[1px] bg-[#ddd]'></div>
                <ul>
                    <li className='p-2'>
                        <div className='flex items-center'>
                            <i className='bx bxs-calendar text-[25px] mr-[10px]'></i>
                            <div className='flex flex-col'>
                                <h4 className='leading-none txt-bold-s'>Sinh ngày: </h4>
                                <span className='leading-none text-[#777] text-[12px] mt-[5px]'>{user?.birthday ? user?.birthday : "Chưa cập nhập"}</span>
                            </div>
                        </div>
                    </li>
                    <li className='p-2'>
                        <div className='flex items-center'>
                            <i className='bx bxs-school text-[25px] mr-[10px]'></i>
                            <div className='flex flex-col'>
                                <h4 className='leading-none txt-bold-s'>Học tại: </h4>
                                <span className='leading-none text-[#777] text-[12px] mt-[5px]'>{user?.learn_at ? user?.learn_at : "Chưa cập nhập"}</span>
                            </div>
                        </div>
                    </li>
                    <li className='p-2'>
                        <div className='flex items-center'>
                            <i className='bx bxs-location-plus text-[25px] mr-[10px]'></i>
                            <div className='flex flex-col'>
                                <h4 className='leading-none txt-bold-s'>Địa chỉ: </h4>
                                <span className='leading-none text-[#777] text-[12px] mt-[5px]'>{user?.address ? user?.address : "Chưa cập nhập"}</span>
                            </div>
                        </div>
                    </li>
                    <li className='p-2'>
                        <div className='flex items-center'>
                            <i className='bx bx-award text-[25px] mr-[10px]'></i>
                            <div className='flex flex-col'>
                                <h4 className='leading-none txt-bold-s'>Tình trạng: </h4>
                                <span className='leading-none text-[#777] text-[12px] mt-[5px]'>{user?.case_love ? user?.case_love : "Chưa cập nhập"}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <GridPhoto list={listImg}/>

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
        </div>
    )
}

export default UserSideBar;
