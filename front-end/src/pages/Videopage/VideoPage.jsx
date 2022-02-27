import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CardPost from '../../components/Cardpost/CardPost';
import VideoHeader from '../../components/Videoheader/VideoHeader';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { handleReactionPostActions } from '../../redux/actions/postActions';

function VideoPage() {
  const profile = useSelector(state => state.auth.data)
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(() => {
    getPostVideos()
  }, [])

  const getPostVideos = async () => {
    const reqOptions = createHeaders("GET", true)
    try {
      const response = await fetch(`${baseURL}/post/videos`, reqOptions)
      if (response.ok) {
        const resBody = await response.json()
        if (resBody.errCode === 0) {
          const newData = resBody.data.filter(post => post.media != null && post.media.type_child === "post_video")
          setData(newData)
        }
      } else {
      }
    } catch (error) {
    }
  }

  const handleReactionRequest = async (postId, typeReaction) => {
    const data = {
      type: "post",
      typeReaction: typeReaction,
      tableId: postId
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
          // process socket noitification
          console.log(resBody);
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
    <section className='sm:mb-[76px]'>
      <div className='mb-3'>
        <VideoHeader />
      </div>
      <div>
        {data.map((item, index) => {
          return (
            <CardPost data={item} key={index} onReaction={handleReactionRequest} selfId={profile.id} />
          )
        })}

      </div>
    </section>
  )
}

export default VideoPage;
