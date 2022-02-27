import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LOGIN } from '../../assets/images';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { resetConversationActions } from '../../redux/actions/conversationActions';
import { resetFriendActions } from '../../redux/actions/friendActions';
import { resetGroupActions } from '../../redux/actions/groupAction';
import { resetPostActions } from '../../redux/actions/postActions';
import { resetStoryActions } from '../../redux/actions/storyActions';
import { LOG_OUT } from '../../redux/constants/authConstants';

function SignInPage() {
  const profile = useSelector(state => state.auth.data)
  const socket = useSelector(state => state.socket.server)
  const [errors, setErrors] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  useEffect(() => {
    if (socket && profile) {
      socket.emit("leave server", profile)
    }
  }, [socket])


  useEffect(() => {
    dispatch({type: LOG_OUT})
    dispatch(resetConversationActions())
    dispatch(resetFriendActions())
    dispatch(resetGroupActions())
    dispatch(resetPostActions())
    dispatch(resetStoryActions())

  }, [])



  const handleValidation = () => {
    if (email.length === 0) {
      setErrors("Email không được để trống!")
      return false
    }
    if (password.length <= 5) {
      setErrors("Mật khẩu không được dưới 5 ký tự!")
      return false
    }
    return true
  }


  const handleSubmit = (e) => {
    e.preventDefault()

    const validate = handleValidation()
    if (!validate) return
    const data = {
      email: email,
      password: password
    }

    handleSignInRequest(data)

  }



  const handleSignInRequest = async (data) => {
    setLoading(true)
    const reqOptions = createHeaders("POST", false, data)
    try {
      const response = await fetch(`${baseURL}/user/login`, reqOptions)
      if (response.ok) {
        const resBody = await response.json()
        if (resBody) {
          setLoading(false)
          localStorage.setItem("access_jwt", JSON.stringify(resBody.access_token))
          navigate("/")
        }
      } else {
        const resErr = await response.json()
        setLoading(false)
        if (resErr) {
          setErrors("Email hoặc mật khẩu không đúng!")
        }
      }
    } catch (error) {
      setLoading(false)
    }
  }

  if (localStorage.getItem("access_jwt")) {
    return <Navigate to="/" />
  }

  return (
    <section className='w-[100vw] h-[100vh]'>
      <div className='flex w-full h-full bg-emerald-100'>
        <div className='flex-1 flex justify-center items-center sm:hidden'>
          <div className='w-[70%] mx-auto'>
            <img src={LOGIN} alt="" />
          </div>
        </div>
        <div className='flex-1 flex justify-center items-center'>
          <div className='w-[50%] sm:w-[70%] mx-auto bg-white shadow-sm p-5 rounded-[10px]'>
            <h2 className='text-[1.3rem] font-[600] mb-2'>Đăng nhập</h2>
            <form
              onSubmit={handleSubmit}
            >
              <div className='border-[2px] border-gray-300 h-[2.5rem] flex px-[5px] rounded-[5px] mb-4'>
                <div className='h-full flex items-center justify-center mr-1'>
                  <i className='bx bx-envelope text-[28px] text-[#333]'></i>
                </div>
                <input type="email"
                  className='bg-transparent outline-none h-full flex-1 text-[15px] text-[#333] font-[600]'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='border-[2px] border-gray-300 h-[2.5rem] flex px-[5px] rounded-[5px] mb-4'>
                <div className='h-full flex items-center justify-center mr-1'>
                  <i className='bx bx-lock-alt text-[28px] text-[#333]'></i>
                </div>
                <input type="password"
                  className='bg-transparent outline-none h-full text-[15px] flex-1 text-[#333] font-[600]'
                  placeholder='Mật khẩu'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className='flex items-center justify-between mb-2'>
                <label htmlFor="remember_me" className='flex items-center txt-bold-s'>
                  <input type="checkbox" className='' id='remember_me' />
                  <span className='ml-1'>Ghi nhớ tôi</span>
                </label>
                <Link to="/" className='text-[15px] text-[#333] font-[600]'>Quên mật khẩu</Link>
              </div>
              <div className='mb-2'>
                {errors && (<span className='text-[13px] text-red-600 font-[500] flex items-center'><i className='bx bxs-error-circle text-[18px] mr-1'></i> {errors}</span>)}
              </div>
              <button type='submit'
                disabled={loading}
                className='w-full h-[2.5rem] text-[13px] mb-2 text-white font-[600] bg-main-color rounded-[3px] disabled:bg-[#ddd] disabled:text-[#555] disabled:flex disabled:items-center disabled:justify-center'>
                {loading ? (
                  <>
                    <i className='bx bx-loader-circle bx-spin text-[18px] mr-1' ></i>
                    <span>Vui lòng đợi...</span>
                  </>
                ) : "Đăng nhập"}
              </button>
            </form>
            <p className='txt'>Bạn chưa có tài khoản? Vui lòng nhấn <Link to="/dang-ky" className='text-red-600'>đăng ký.</Link></p>

            <div className='text-center text-[13px] z-10 h-[1px] bg-[#cbcbcb99] my-[30px] relative'>
              <span className='inline-block bg-white px-3 text-[#777] py-1 z-30 top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 absolute'>HOẶC</span>
            </div>
            <div className='flex items-center bg-blue-600 px-2 py-[10px] rounded-[3px] cursor-pointer mb-4'>
              <i className='bx bxl-facebook text-[28px] text-white '></i>
              <div className='flex-1 text-center'>
                <span className='text-[13px] text-white font-[600]'>Đăng nhập bằng fb</span>
              </div>
            </div>
            <div className='flex items-center bg-red-700 px-2 py-[10px] rounded-[3px] cursor-pointer mb-4'>
              <i className='bx bxl-google text-[28px] text-white '></i>
              <div className='flex-1 text-center'>
                <span className='text-[13px] text-white font-[600]'>Đăng nhập bằng gg</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default SignInPage;
