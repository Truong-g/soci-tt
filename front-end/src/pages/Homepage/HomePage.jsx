import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonShowContactUser from "../../components/Buttonshowcontactuser/ButtonShowContactUser";
import CardPost from "../../components/Cardpost/CardPost";
import FormPost from "../../components/Formpost/FormPost";
import HomeGridStory from "../../components/Homegridstory/HomeGridStory";
import HomeRight from "../../components/Homeright/HomeRight";
import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'
import { notificationModalAction } from "../../redux/actions/modalActions";
import { addPostActions, createPostActions, handleReactionPostActions } from "../../redux/actions/postActions";


function HomePage({ profile }) {

  const posts = useSelector(state => state.post.data)
  const loadingPost = useSelector(state => state.post.pending)
  const socket = useSelector(state => state.socket.server)
  const totalPage = useSelector(state => state.post.totalPage)
  const [createLoading, setCreateLoading] = useState(false)
  const [addedLoading, setAddLoading] = useState(false)
  const [page, setPage] = useState(2)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const createPrivatePost = async (values) => {
    setCreateLoading(true)
    try {
      if (values.media) {
        let mediaTypeChild = null

        if (values.media.type.indexOf("video") != -1 || values.media.type.indexOf("mp4") != -1) {
          mediaTypeChild = "post_video"
        }

        console.log(values.media.type);

        if (values.media.type.indexOf("image") != -1 || values.media.type.indexOf("jpg") != -1 || values.media.type.indexOf("png") != -1) {
          mediaTypeChild = "post_image"
        }

        const formData = new FormData()
        if (mediaTypeChild === "post_video") {
          formData.append("file", values.media)
          formData.append("upload_preset", "audio-recorder")
          formData.append("cloud_name", "dwfjhv7mr")
        } else {
          formData.append("file", values.media)
          formData.append("upload_preset", "default")
          formData.append("cloud_name", "dwfjhv7mr")
        }
        const responseCloud = await fetch(`https://api.cloudinary.com/v1_1/dwfjhv7mr/${mediaTypeChild === "post_video" ? "video" : "image"}/upload`, {
          method: "POST",
          body: formData
        })
        if (responseCloud.ok) {
          const resCloudBody = await responseCloud.json()
          const data = {
            hasMedia: true,
            postType: "public",
            content: values.content,
            mediaType: "post",
            mediaTypeChild: mediaTypeChild,
            link: resCloudBody.url
          }
          const reqOptions = createHeaders("POST", true, data)

          const response = await fetch(`${baseURL}/post`, reqOptions)
          if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
              setCreateLoading(false)
              dispatch(createPostActions(resBody.data))
            }
          } else {
            setCreateLoading(false)
            localStorage.removeItem("access_jwt")
            navigate("/dang-nhap")
          }
        }
      } else {
        const data = {
          hasMedia: false,
          postType: "public",
          content: values.content,
        }
        const reqOptions = createHeaders("POST", true, data)

        const response = await fetch(`${baseURL}/post`, reqOptions)
        if (response.ok) {
          const resBody = await response.json()
          if (resBody.errCode === 0) {
            setCreateLoading(false)
            dispatch(createPostActions(resBody.data))

          }
        } else {
          setCreateLoading(false)
          localStorage.removeItem("access_jwt")
          navigate("/dang-nhap")
        }
      }
    } catch (error) {
      setCreateLoading(false)

    }
  }

  const handleReactionRequest = async (postId, typeReaction, senderId) => {
    const data = {
      type: "post",
      typeReaction: typeReaction,
      tableId: postId,
      selfId: senderId
    }

    dispatch(handleReactionPostActions({
      ...data,
      user_id: profile.id
    }))

    const reqOptions = createHeaders("POST", true, data)
    try {
      const response = await fetch(`${baseURL}/post/reaction`, reqOptions)
      if (response.ok) {
        const resBody = await response.json()
        if (resBody.errCode === 0) {
          socket.emit("send reaction", {
            notification_id: resBody.data.notification_id,
            self_id: senderId,
            tableId: resBody.data.table_id,
            user: resBody.data.user
          })
        }
      } else {
        dispatch(notificationModalAction({
          type: "warning",
          message: "Mạng không ổn định"
        }))
      }
    } catch (error) {
      // localStorage.removeItem("access_jwt")
      // navigate("/dang-nhap")
    }
  }

  const addPosts = async () => {
    setAddLoading(true)
    const reqOptions = createHeaders("GET", true)
    try {
      const response = await fetch(`${baseURL}/post?page=${page}`, reqOptions)
      if (response.ok) {
        const resBody = await response.json()
        if (resBody.errCode === 0) {
          dispatch(addPostActions(resBody.data.data))
          setPage(prev => prev + 1)
          setAddLoading(false)
        }
      } else {
        setAddLoading(false)
      }
    } catch (error) {
      setAddLoading(false)
    }
  }

  return (
    <section className='flex sm:flex-col sm:mb-[76px]'>
      <div className="flex-1 mr-4 sm:mr-0">
        <div className="w-full mb-5">
          <HomeGridStory />
        </div>
        <div className="w-full mb-5 relative overflow-hidden">
          <FormPost onHandleValues={createPrivatePost} />
          {createLoading && (
            <div className="absolute w-full h-full top-0 left-0 bottom-0 right-0 bg-[#ffffff99] flex justify-center items-center">
              <div className="text-[#333] flex items-center">
                <i className='bx bx-loader-circle bx-spin text-[2.2rem] mr-1' ></i>
                <span className="text-[18px] font-[400]">Vui lòng đợi...</span>
              </div>
            </div>
          )}

        </div>
        <div className="w-full mb-5">
          {loadingPost && (
            <div className="text-center mb-5">
              <i className='bx bx-loader-circle bx-spin text-[24px] text-main-color' ></i>
            </div>
          )}
          <div>
            {posts.map((item, index) => {
              return (
                <CardPost data={item} key={index} onReaction={handleReactionRequest} selfId={profile.id} />
              )
            })}

          </div>
          <div className="text-center">
            <button
              onClick={() => {
                if (page <= totalPage) {
                  addPosts()
                }
              }}
              className={`bg-main-color disabled:bg-[#ddd] disabled:text-[#333] text-white text-[12px] font-[600] py-[7px] px-[13px] rounded-md`} disabled={addedLoading}>
              {!addedLoading ? "Xem thêm" : (
                <i class='bx bx-loader-circle bx-spin text-[20px]' ></i>
              )}

            </button>
          </div>
        </div>
      </div>
      {/* hompage right */}
      <HomeRight />

      {/* show btn in mb screen */}
      <ButtonShowContactUser />
    </section>
  );
}

export default HomePage;
