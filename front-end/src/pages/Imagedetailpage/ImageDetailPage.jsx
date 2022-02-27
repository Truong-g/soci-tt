import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { putAvatarActions } from '../../redux/actions/authActions';
import { notificationModalAction } from '../../redux/actions/modalActions';

function ImageDetailPage() {
  const profile = useSelector(state => state.auth.data)
  const location = useLocation()
  const { link, user_id, id } = location.state
  const [showOption, setShowOption] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const deleteImage = async () => {
    if (profile.avatar === link) {
      dispatch(notificationModalAction({
        type: "error",
        message: "Bạn không thể xóa ảnh đại diện"
      }))
      return
    }
    const data ={
      id: id
    }
    const reqoption = createHeaders("POST", true, data)
    try {
      const response = await fetch(`${baseURL}/image/delete-avatar`, reqoption)
      if (response.ok) {
        const resBody = await response.json()
        if (resBody.errCode === 0) {
          dispatch(notificationModalAction({
            type: "success",
            message: "Đổi xóa ảnh thành công"
          }))
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


  const putAvatar = async () => {
    dispatch(putAvatarActions(link))
    const data = {
      oldAvatar: profile.avatar,
      newAvatar: link
    }
    const reqoption = createHeaders("POST", true, data)
    try {
      const response = await fetch(`${baseURL}/image/change-avatar`, reqoption)
      if (response.ok) {
        const resBody = await response.json()
        if (resBody.errCode === 0) {
          dispatch(notificationModalAction({
            type: "success",
            message: "Đổi avatar thành công"
          }))
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
    <section
      className='fixed top-0 left-0 right-0 bottom-0 bg-[#000000] z-50 flex justify-center items-center'
    >
      <div
        className='block w-[50%] max-h-[80%] sm:w-full sm:h-auto sm:border-none sm:rounded-none border-[5px] border-white rounded-xl overflow-hidden relative'
      >

        <img src={link} alt="state" className='object-cover w-full' />

        <div
          className='absolute sm:fixed sm:z-[60] top-[0.5rem] left-0 right-0 flex justify-between items-center px-[1rem] transition-all'>
          <button
            className='w-[40px] h-[40px] text-white text-[28px] rounded-full hover:bg-[#ffffff99] flex justify-center items-center'
            onClick={() => navigate(-1)}
          >
            <i className='bx bx-arrow-back'></i>
          </button>

          {profile.id === user_id && (
            <div
              className='w-[40px] h-[40px] text-white text-[28px] rounded-full relative hover:bg-[#ffffff99] flex justify-center items-center'
              onClick={() => setShowOption(!showOption)}
            >
              <i className='bx bx-dots-vertical-rounded' ></i>

              <div className={`w-[10rem] bg-white absolute top-full right-0 ${showOption ? "block" : "hidden"}`}>
                <button
                  onClick={() => putAvatar()}
                  className='select-none text-[13px] w-full text-[#333] font-[600] block px-[1rem] py-[0.3rem] hover:bg-[#ddd]'
                >
                  Đặt ảnh đại diện
                </button>
                <button
                  className='select-none text-[13px] w-full text-[#333] font-[600] block px-[1rem] py-[0.3rem] hover:bg-[#ddd]'
                  onClick={() => deleteImage()}
                >Xóa</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ImageDetailPage;
