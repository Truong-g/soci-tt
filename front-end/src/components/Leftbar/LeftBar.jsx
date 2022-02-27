import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPostActions } from '../../redux/actions/postActions';
import '../../styles/components/buttons.scss'
import '../../styles/components/custom-height.scss'

function LeftBar() {

    const toggle = useSelector(state => state.modal.leftBar)
    const profile = useSelector(state => state.auth.data)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    return (
        <aside className={`w-60 p-3 height-scroll-xl overflow-y-scroll sm:fixed sm:left-0 sm:top-0 sm:bottom-0 ${toggle ? "sm:bolck" : "sm:hidden"} sm:w-[70vw] sm:bg-[#eee] sm:z-30 sm:h-[100vh] sm:animate-fadeIn1`}>
            <div className="bg-white p-3 drop-shadow-lg rounded-[10px] mb-4">
                <h4 className="text-[12px] font-[600] text-[#adb5bd] mb-2">Tùy chọn</h4>
                <ul>
                    <li className='my-2'>
                        <div onClick={() => dispatch(getAllPostActions(navigate))} className='flex cursor-pointer text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 btn-gradient2 rounded-full flex justify-center items-center text-white text-[20px]'>
                                <i className='bx bx-tv'></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-4 '>Bảng tin mới</span>
                        </div>
                    </li>
                    <li className='my-2'>
                        <Link to="/thanh-vien" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 btn-gradient1 rounded-full flex justify-center items-center text-white text-[20px]'>
                            <i className='bx bx-user-plus' ></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-4 '>Kết bạn</span>
                        </Link>
                    </li>
                    <li className='my-2'>
                        <Link to="/" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 btn-gradient3 rounded-full flex justify-center items-center text-white text-[20px]'>
                            <i className='bx bx-globe'></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-4 '>Story</span>
                        </Link>
                    </li>
                    <li className='my-2'>
                        <Link to="/nhom" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 btn-gradient4 rounded-full flex justify-center items-center text-white text-[20px]'>
                            <i className='bx bx-group'></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-4 '>Nhóm</span>
                        </Link>
                    </li>
                    <li className='my-2'>
                        <Link to={`/thanh-vien/${profile.id}`} className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 btn-gradient5 rounded-full flex justify-center items-center text-white text-[20px]'>
                            <i className='bx bx-user'></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-4 '>Trang cá nhân</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="bg-white p-3 drop-shadow-lg rounded-[10px] mb-4">
                <h4 className="text-[12px] font-[600] text-[#adb5bd] mb-2">Trang khác</h4>
                <ul>
                    <li className='my-2'>
                        <Link to="/" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 text-main-color rounded-full flex justify-center items-center text-[24px]'>
                            <i className='bx bxs-store'></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-2 '>Cửa hàng</span>
                        </Link>
                    </li>
                    <li className='my-2'>
                        <Link to="/" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 text-main-color rounded-full flex justify-center items-center text-[24px]'>
                            <i className='bx bx-hotel'></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-2 '>Hotel</span>
                        </Link>
                    </li>
                    <li className='my-2'>
                        <Link to="/" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 text-main-color rounded-full flex justify-center items-center text-[24px]'>
                            <i className='bx bxs-location-plus'></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-2 '>Sự kiện</span>
                        </Link>
                    </li>
                    <li className='my-2'>
                        <Link to="/" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 text-main-color rounded-full flex justify-center items-center text-[24px]'>
                            <i className='bx bxs-videos' ></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-2 '>Video</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="bg-white p-3 drop-shadow-lg rounded-[10px]">
                <h4 className="text-[12px] font-[600] text-[#adb5bd] mb-2">Tài khoản</h4>
                <ul>
                    <li className='my-2'>
                        <Link to="/" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 text-[#777] rounded-full flex justify-center items-center text-[24px]'>
                            <i className='bx bx-cog' ></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-2 '>Cài đặt</span>
                        </Link>
                    </li>
                    <li className='my-2'>
                        <Link to="/" className='flex text-[#777] xl:hover:text-main-color lg:hover:text-main-color'>
                            <div className='w-10 h-10 text-[#777] rounded-full flex justify-center items-center text-[24px]'>
                            <i className='bx bx-message-square'></i>
                            </div>
                            <span className='font-[600] text-[15px] flex justify-center items-center ml-2 '>Tin nhắn</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default LeftBar;
