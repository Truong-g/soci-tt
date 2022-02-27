

import React, { useEffect, useState } from 'react';
import GroupSideBar from '../../components/Groupsidebar/GroupSideBar';
import FormPost from '../../components/Formpost/FormPost';
import CardPost from '../../components/Cardpost/CardPost';
import { baseURL } from '../../constants/constants'
import createHeaders from '../../config/createHeaders'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


function GroupDetailPage() {
  const profile = useSelector(state => state.auth.data)
  const [createLoading, setCreateLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const { groupId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { inforGroup } = location.state

  

  useEffect(() => {
    getGroupPost()
  }, [])

  const getGroupPost = async () => {
    const reqOptions = createHeaders("GET", true)
    try {
      const response = await fetch(`${baseURL}/post/group/${groupId}`, reqOptions)
      if (response.ok) {
        const resBody = await response.json()
        if (resBody.errCode === 0) {
          setPosts(resBody.data.data)
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

  const handleReactionRequest = async (postId, typeReaction) => {
    const data = {
      type: "post",
      typeReaction: typeReaction,
      tableId: postId
    }

    handleReactionUserPage(posts, { ...data, user_id: profile.id })

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

  const handleReactionUserPage = (dataArrays, actionData) => {
    const copyData = [...dataArrays]
    const indexData = dataArrays.findIndex(item => item.id === actionData.tableId)
    const selectReactionData = dataArrays.find(item => item.id === actionData.tableId)
    let selectReaction = dataArrays.find(item => item.id === actionData.tableId).reaction

    const index1 = selectReaction.findIndex(item => item.user_id === actionData.user_id && item.type_reaction === actionData.typeReaction)
    if (index1 != -1) {
      selectReaction.splice(index1, 1)
    } else {
      const index2 = selectReaction.findIndex(item => item.user_id === actionData.user_id)
      if (index2 != -1) {
        selectReaction[index2] = { ...selectReaction[index2], type_reaction: actionData.typeReaction }
      } else {
        selectReaction = [...selectReaction, { user_id: actionData.user_id, type_reaction: actionData.typeReaction, created_at: new Date(), updated_at: new Date() }]
      }

    }
    selectReactionData.reaction = selectReaction
    copyData[indexData] = selectReactionData
    setPosts(copyData)
  }

  const createGroupPost = async (values) => {
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
            postType: "private",
            content: values.content,
            mediaType: "post",
            mediaTypeChild: mediaTypeChild,
            link: resCloudBody.url,
            groupId: groupId
          }
          const reqOptions = createHeaders("POST", true, data)

          const response = await fetch(`${baseURL}/post`, reqOptions)
          if (response.ok) {
            const resBody = await response.json()
            if (resBody.errCode === 0) {
              setCreateLoading(false)
              setPosts(prev => [
                resBody.data,
                ...prev
              ])
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
          postType: "private",
          content: values.content,
          groupId: groupId
        }
        const reqOptions = createHeaders("POST", true, data)

        const response = await fetch(`${baseURL}/post`, reqOptions)
        if (response.ok) {
          const resBody = await response.json()
          if (resBody.errCode === 0) {
            setCreateLoading(false)
            setPosts(prev => [
              resBody.data,
              ...prev
            ])

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

  return (
    <section className='w-full sm:pb-[86px]'>
      <div className='flex sm:flex-col'>
        <div className='mr-[16px] sm:mr-0'>
          <GroupSideBar infor={inforGroup}/>
        </div>
        <div className="flex-1">
          <div className='w-full mb-4'>
            <FormPost onHandleValues={createGroupPost} />
            {createLoading && (
              <div className="absolute w-full h-full top-0 left-0 bottom-0 right-0 bg-[#ffffff99] flex justify-center items-center">
                <div className="text-[#333] flex items-center">
                  <i className='bx bx-loader-circle bx-spin text-[2.2rem] mr-1' ></i>
                  <span className="text-[18px] font-[400]">Vui lòng đợi...</span>
                </div>
              </div>
            )}
          </div>
          <div className='w-full'>
            {posts.map((post, index) => {
              return (
                <CardPost onReaction={handleReactionRequest} selfId={profile.id} data={post} key={index} />
              )
            })}


          </div>
        </div>
      </div>
    </section>
  )
}

export default GroupDetailPage;
