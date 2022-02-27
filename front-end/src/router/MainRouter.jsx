import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import 'boxicons'
import HomePage from '../pages/Homepage/HomePage'
import FriendPage from '../pages/Friendpage/FriendPage'
import GroupPage from '../pages/Grouppage/GroupPage'
import StoryPage from '../pages/Storypage/StoryPage'
import Header from '../components/Header/Header'
import LeftBar from '../components/Leftbar/LeftBar'
import RightBar from '../components/Rightbar/RightBar'
import UserPage from '../pages/Userpage/UserPage'
import MemberPage from '../pages/Memberpage/MemberPage'
import VideoPage from '../pages/Videopage/VideoPage'
import MessagePage from '../pages/Messagepage/MessagePage'
import GroupDetailPage from '../pages/Groupdetailpage/GroupDetailPage'
import StoryDetail from '../pages/Storydetail/StoryDetail'
import PostDetail from '../pages/Postdetail/PostDetail'
import { getProfileActions } from '../redux/actions/authActions'
import { useEffect } from 'react'
import { LOADER } from '../assets/images'
import { getAllPostActions } from '../redux/actions/postActions'
import EditInForPage from '../pages/Editinforpage/EditInForPage'
import { getAllFriendActions } from '../redux/actions/friendActions'
import ImagePage from '../pages/Imagepage/ImagePage'
import ImageDetailPage from '../pages/Imagedetailpage/ImageDetailPage'
import NotificationModal from '../components/Notificationmodal/NotificationModal'
import { getAllStoryActions } from '../redux/actions/storyActions'
import CreateGroupPage from '../pages/Creategroup/CreateGroupPage'
import { getAllGroupActions } from '../redux/actions/groupAction'
import { joinSocketServerActions } from '../redux/actions/socketActions'
import { getConversationActions } from '../redux/actions/conversationActions'
import { getNotificationActions } from '../redux/actions/notificationActions'
import { getAllUserActions } from '../redux/actions/userActions'
import { getAllOnlineActions } from '../redux/actions/onlinesActions'


function MainRouter() {

  const me = useSelector(state => state.auth.data)
  const notifications = useSelector(state => state.modal.notificationData)
  const socket = useSelector(state => state.socket.server)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getProfileActions(navigate))
    dispatch(getAllPostActions(navigate))
    dispatch(getAllFriendActions(navigate))
    dispatch(getAllStoryActions(navigate))
    dispatch(getAllGroupActions(navigate))
    dispatch(joinSocketServerActions())
    dispatch(getConversationActions(navigate))
    dispatch(getNotificationActions(navigate))
    dispatch(getAllUserActions(navigate))

  }, [])

  useEffect(() => {
    if (socket){
      socket.on("list online", (list) => {
        dispatch(getAllOnlineActions(list))
      })
    }
  }, [socket])



  useEffect(() => {
    if (socket && me) {
      socket.emit("join server", me)
    }
  }, [socket, me])

  

  return (
    <div className='bg-[#eeeeee70]'>
      {!me ? (
        <div className='flex fixed top-0 left-0 right-0 bottom-0 justify-center items-center'>
          <div className='w-[3rem] h-[3rem]'>
            <img src={LOADER} alt="" className="w-full" />
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main className='pt-24 sm:pt-16'>
            <div className="flex">
              <LeftBar />
              <div className='flex-1 p-3 pb-0 height-scroll-xl overflow-y-scroll'>
                <div className='w-[800px] sm:w-full mx-auto'>
                  <Routes>
                    <Route path="/" element={<HomePage profile={me} />} />
                    <Route path="/bai-viet" element={<Navigate to="/" />} />
                    <Route path="/bai-viet/:postId" element={<PostDetail />} />
                    <Route path="/ban-be" element={<FriendPage />} />
                    <Route path="/nhom" element={<GroupPage />} />
                    <Route path="/nhom/tao-nhom" element={<CreateGroupPage />} />
                    <Route path="/nhom/:groupId" element={<GroupDetailPage />} />
                    <Route path="/story" element={<StoryPage />} />
                    <Route path="/story/chi-tiet" element={<StoryDetail />} />
                    <Route path="/thanh-vien" element={<MemberPage />} />
                    <Route path="/thanh-vien/anh" element={<ImagePage />} />
                    <Route path="/anh/:imgId" element={<ImageDetailPage />} />
                    <Route path="/video" element={<VideoPage />} />
                    <Route path="/tin-nhan" element={<MessagePage />} />
                    <Route path="/chinh-sua-thong-tin" element={<EditInForPage />} />
                    <Route path="/thanh-vien/:userId" element={<UserPage />} />
                  </Routes>
                </div>
              </div>
              <RightBar />
            </div>
          </main>
          {notifications && (<NotificationModal />)}
        </>

      )}

    </div>
  )

}

export default MainRouter;
