import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import 'boxicons'
import '../../styles/components/buttons.scss'
import { LOGO } from '../../assets/images'
import ButtonBar from '../Buttonbar/ButtonBar'
import HeaderFormSearch from './HeaderFormSearch'
import { notificationModalAction, toggleLeftBarAction } from '../../redux/actions/modalActions'
import { logOutActions } from '../../redux/actions/authActions'
import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
import { addNotificationActions, deleteNotificationActions } from '../../redux/actions/notificationActions'



function Header() {
    const toggleLeftbar = useSelector(state => state.modal.leftBar)
    const me = useSelector(state => state.auth.data)
    const socket = useSelector(state => state.socket.server)
    const notifications = useSelector(state => state.notification.data)
    const [showNotification, setShowNotification] = useState(false)
    const [showLogout, setShowLogOut] = useState(false)
    const navigate = useNavigate()

    const [showSearch, setShowSearch] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("get comment", (result) => {
            dispatch(addNotificationActions({
                created_at: new Date(),
                updated_at: new Date(),
                id: result.notification_id ? result.notification_id : null,
                self_id: result.self_id,
                status: "2",
                table_id: result.table_id,
                type: "comment",
                user: result.user
            }))
        })

        socket.on("get reaction", (result) => {
            dispatch(addNotificationActions({
                created_at: new Date(),
                updated_at: new Date(),
                id: result.notification_id ? result.notification_id : null,
                self_id: result.self_id,
                status: "2",
                table_id: result.tableId,
                type: "reaction",
                user: result.user
            }))
        })
    }, [])

    const removeNotification = async (id, postId) => {
        const data = { id: id }
        const reqOptions = createHeaders("POST", "true", data)
        try {
            const response = await fetch(`${baseURL}/notification/delete`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    dispatch(deleteNotificationActions(id))
                    navigate(`/bai-viet/${postId}`)
                }
            } else {
                dispatch(notificationModalAction({
                    type: "warning",
                    message: "Mạng không ổn định"
                }))
            }
        } catch (error) {
            // localStorage.removeItem("access_jwt")
            // if (navigate) {
            //     navigate("/dang-nhap")
            // }
        }
    }


    return (
        <header className="h-24 fixed top-0 left-0 right-0 z-10 sm:h-16 bg-white shadow-md">
            <div className="flex h-full w-full justify-between items-center">
                <div className="flex h-full items-center">
                    <Link to={"/"} className="w-64 pr-5 md:pr-0 sm:pr-0 sm:w-28 sm:pl-2">
                        <img src={LOGO} alt="" className='w-[80%] sm:w-[100%]' />
                    </Link>
                    <HeaderFormSearch showMobile={showSearch} setShowMobile={setShowSearch} />
                    <div className="ml-2 sm:fixed sm:bottom-0 sm:w-[100vw] sm:p-2 sm:bg-main-color sm:ml-0 md:fixed md:bottom-0 md:w-[100vw] md:p-2 md:bg-main-color md:ml-0">
                        <ul className="flex sm:justify-between md:justify-between">
                            <li className='lg:mx-[10px] xl:mx-[10px]'>
                                <NavLink className={({ isActive }) => isActive ? "btn-active btn-mobile btn-tablet" : "btn-unactive btn-mobile btn-tablet"}
                                    to="/">
                                    <i className='bx bx-home' ></i></NavLink>
                            </li>
                            <li className='mx-[10px]'>
                                <NavLink className={({ isActive }) => isActive ? "btn-active btn-mobile btn-tablet" : "btn-unactive btn-mobile btn-tablet"}
                                    to="/story">
                                    <i className='bx bx-history'></i></NavLink>
                            </li>
                            <li className='mx-[10px]'>
                                <NavLink className={({ isActive }) => isActive ? "btn-active btn-mobile btn-tablet" : "btn-unactive btn-mobile btn-tablet"}
                                    to="/video">
                                    <i className='bx bx-video'></i></NavLink>
                            </li>
                            <li className='mx-[10px]'>
                                <NavLink className={({ isActive }) => isActive ? "btn-active btn-mobile btn-tablet" : "btn-unactive btn-mobile btn-tablet"}
                                    to="/nhom">
                                    <i className='bx bx-group'></i></NavLink>
                            </li>
                            <li className='mx-[10px]'>
                                <NavLink className={({ isActive }) => isActive ? "btn-active btn-mobile btn-tablet" : "btn-unactive btn-mobile btn-tablet"}
                                    to="/cua-hang">
                                    <i className='bx bx-store'></i></NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="h-full">
                    <nav className='flex items-center h-full'>
                        <div
                            onClick={() => setShowNotification(!showNotification)}
                            className=" cursor-pointer w-[40px] h-[40px] mx-2 flex justify-center items-center rounded-full text-main-color text-3xl sm:bg-[#dddddd] sm:text-xl sm:text-[#333] md:bg-[#dddddd] md:text-xl md:text-[#333] relative">
                            <i className='bx bx-bell'></i>
                            {showNotification && (
                                <div className='p-3 absolute w-[250px] max-h-[500px] overflow-y-scroll bg-white shadow-md top-[calc(100%_+_10px)] left-0 z-[100] -translate-x-[calc(50%_-_20px)]'>
                                    <ul className='select-none'>
                                        {notifications.map((item, index) => {
                                            return (
                                                <li
                                                    onClick={() => removeNotification(item.id, item.table_id)}
                                                    className='flex items-center h-auto hover:bg-[#ccc] p-[10px] cursor-pointer transition-all rounded-md' key={index}>
                                                    <div className='w-[40px] h-[40px]'>
                                                        <div className='bg-center bg-no-repeat bg-cover pt-[100%] w-[40px] rounded-[100%]' style={{
                                                            backgroundImage: `url("${item.user.avatar}")`
                                                        }}></div>
                                                    </div>
                                                    <div className='text-[12px] text-[#444] leading-[1.3] pl-[10px]'>
                                                        <strong>{item.user.fullname}</strong> đã {item.type === "comment" ? "bình luận" : "thả cảm xúc"} bài viết của bạn.
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    {notifications.length === 0 && (
                                        <p className='txt text-center'>Bạn không có thông báo nào!</p>
                                    )}
                                </div>
                            )}
                            {notifications.length > 0 && (
                                <div className='absolute top-0 right-0 w-[15px] h-[15px] text-white flex justify-center items-center bg-red-600 text-[11px] rounded-full'>{notifications.length}</div>
                            )}
                        </div>
                        <Link to="/tin-nhan" className="w-[40px] h-[40px] mx-2 flex justify-center items-center rounded-full text-main-color text-3xl sm:bg-[#dddddd] sm:text-xl sm:text-[#333] md:bg-[#dddddd] md:text-xl md:text-[#333]">
                            <i className='bx bx-message'></i>
                        </Link>
                        <div className="w-[40px] h-[40px] mx-2 flex justify-center items-center rounded-full text-main-color text-3xl sm:hidden md:hidden">
                            <i className='bx bx-moon' ></i>
                        </div>
                        <div
                            className="w-[40px] h-[40px] mx-2 flex justify-center items-center rounded-full text-main-color text-3xl sm:bg-[#dddddd] sm:text-xl sm:text-[#333] md:bg-[#dddddd] md:text-xl md:text-[#333] xl:hidden lg:hidden"
                            onClick={() => setShowSearch(true)}
                        >
                            <i className='bx bx-search'></i>
                        </div>
                        <div
                            className="w-[40px] h-[40px] mx-2 flex justify-center items-center rounded-full sm:text-xl sm:text-[#333] md:bg-[#dddddd] md:text-xl md:text-[#333] md:bg-transparent xl:hidden lg:hidden"
                            onClick={() => {
                                dispatch(toggleLeftBarAction(!toggleLeftbar))
                            }}
                        >
                            <ButtonBar isActive={toggleLeftbar} />
                        </div>
                        <div
                        onClick={() => setShowLogOut(!showLogout)}
                        className="w-[40px] h-[40px] mx-2  ml-4 sm:hidden md:hidden cursor-pointer relative">
                            <img src={me.avatar} alt="" className='w-full rounded-full' />
                            {showLogout && (
                                <div className='absolute top-full right-0 min-w-[90px] shadow-md bg-[#fff] rounded-[5px]'>
                                    <button
                                        onClick={() => dispatch(logOutActions(navigate))}
                                        className='text-[#333] text-[13px] p-[5px] hover:bg-[#ddd] w-full font-[600]'>Đăng xuất</button>
                                </div>
                            )}

                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header;
