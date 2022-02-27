import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN } from '../../assets/images';
import createHeaders from '../../config/createHeaders'
import { baseURL } from '../../constants/constants'

function SignUpPage() {

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    fullname: ""
  })
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    password: null,
    fullname: null,
    general: null
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleValidationSubmit = (val) => {
    const valFields = Object.keys(val)
    for (let index = 0; index < valFields.length; index++) {
      if (val[valFields[index]] === "") {
        setErrors(prev => ({ ...prev, [valFields[index]]: `Trường ${valFields[index]} không được để trống!` }))
        return false
      } else {
        if (val[valFields[index]].length <= 5) {
          setErrors(prev => ({ ...prev, [valFields[index]]: `Trường ${valFields[index]} không được dưới 5 ký tự!` }))
          return false
        }
      }
    }
    return true
  }

  const handleValidationBlur = (e) => {
    if (e.target.value === "") {
      setErrors(prev => ({ ...prev, [e.target.name]: `Trường ${e.target.name} không được để trống!` }))
    } else {
      if (e.target.value.length <= 5) {
        setErrors(prev => ({ ...prev, [e.target.name]: `Trường ${e.target.name} không được dưới 5 ký tự!` }))
      }
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validated = handleValidationSubmit(values)
    if (!validated) return
    handleSignUpRequest(values)
  }

  const handleSignUpRequest = async (data) => {
    setLoading(true)
    const reqOptions = createHeaders("POST", false, data)
    try {
      const response = await fetch(`${baseURL}/user/register`, reqOptions)
      if (response.ok) {
        const resBody = await response.json()
        if (resBody.errCode === 0) {
          setLoading(false)
          navigate("/dang-nhap")
        }
      } else {
        const resErr = await response.json()
        setLoading(false)
        if (resErr.username) {
          setErrors(prev => ({ ...prev, general: "Tên đăng nhập đã tồn tại!" }))
        }
        if (resErr.email) {
          setErrors(prev => ({ ...prev, general: "Email đã tồn tại!" }))
        }
      }
    } catch (error) {
      console.log(error);
    }
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
            <h2 className='text-[1.3rem] font-[600] mb-2'>Đăng ký</h2>
            <form
              onSubmit={handleSubmit}
            >

              <div>
                <div className='border-[2px] border-gray-300 h-[2.5rem] flex px-[5px] rounded-[5px]'>
                  <div className='h-full flex items-center justify-center mr-1'>
                    <i className='bx bx-user text-[28px] text-[#333]'></i>
                  </div>
                  <input type="text"
                    className='bg-transparent outline-none h-full text-[15px] text-[#333] font-[600] flex-1'
                    placeholder='Tên đăng nhập'
                    name='username'
                    onChange={(e) => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    onBlur={(e) => handleValidationBlur(e)}
                    onFocus={(e) => setErrors(prev => ({ ...prev, [e.target.name]: null }))}
                    value={values.username}
                  />
                </div>
                <div className='mt-[0.2rem] mb-3'>
                  {errors.username && (<span className='text-[13px] text-red-600 font-[500]'><i className='bx bxs-error-circle text-[18px] mr-1'></i> {errors.username}</span>)}
                </div>
              </div>

              <div>
                <div className='border-[2px] border-gray-300 h-[2.5rem] flex px-[5px] rounded-[5px]'>
                  <div className='h-full flex items-center justify-center mr-1'>
                    <i className='bx bx-envelope text-[28px] text-[#333]'></i>
                  </div>
                  <input type="email"
                    className='bg-transparent outline-none h-full text-[15px] text-[#333] font-[600] flex-1'
                    placeholder='Email'
                    name='email'
                    onChange={(e) => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    onBlur={(e) => handleValidationBlur(e)}
                    onFocus={(e) => setErrors(prev => ({ ...prev, [e.target.name]: null }))}
                    value={values.email}
                  />
                </div>
                <div className='mt-[0.2rem] mb-3'>
                  {errors.email && (<span className='text-[13px] text-red-600 font-[500] flex items-center'><i className='bx bxs-error-circle text-[18px] mr-1'></i> {errors.email}</span>)}
                </div>
              </div>

              <div>
                <div className='border-[2px] border-gray-300 h-[2.5rem] flex px-[5px] rounded-[5px]'>
                  <div className='h-full flex items-center justify-center mr-1'>
                    <i className='bx bx-lock-alt text-[28px] text-[#333]'></i>
                  </div>
                  <input type="password"
                    className='bg-transparent outline-none h-full text-[15px] text-[#333] font-[600] flex-1'
                    placeholder='Mật khẩu'
                    name='password'
                    onChange={(e) => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    onBlur={(e) => handleValidationBlur(e)}
                    onFocus={(e) => setErrors(prev => ({ ...prev, [e.target.name]: null }))}
                    value={values.password}
                  />
                </div>
                <div className='mt-[0.2rem] mb-3'>
                  {errors.password && (<span className='text-[13px] text-red-600 font-[500] flex items-center'><i className='bx bxs-error-circle text-[18px] mr-1'></i> {errors.password}</span>)}

                </div>
              </div>

              <div>
                <div className='border-[2px] border-gray-300 h-[2.5rem] flex px-[5px] rounded-[5px]'>
                  <div className='h-full flex items-center justify-center mr-1'>
                    <i className='bx bx-user text-[28px] text-[#333]'></i>
                  </div>
                  <input type="text"
                    className='bg-transparent outline-none h-full text-[15px] text-[#333] font-[600] flex-1'
                    placeholder='Nhập họ tên'
                    name='fullname'
                    onChange={(e) => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    onBlur={(e) => handleValidationBlur(e)}
                    onFocus={(e) => setErrors(prev => ({ ...prev, [e.target.name]: null }))}
                    value={values.fullname}
                  />
                </div>
                <div className='mt-[0.2rem] mb-3'>
                  {errors.fullname && (<span className='text-[13px] text-red-600 font-[500] flex items-center'><i className='bx bxs-error-circle text-[18px] mr-1'></i> {errors.fullname}</span>)}
                </div>
              </div>

              <div className='mb-2'>
                <label htmlFor="remember_me" className='flex items-center txt-bold-s'>
                  <input type="checkbox" className='' id='remember_me' />
                  <span className='ml-1'>Chấp nhận đồng ý các điều khoản!</span>
                </label>
              </div>
              <div className='mb-2'>
                {errors.general && (<span className='text-[13px] text-red-600 font-[500] flex items-center'><i className='bx bxs-error-circle text-[18px] mr-1'></i> {errors.general}</span>)}

              </div>
              <button type='submit' className={`w-full h-[2.5rem] text-[13px] mb-2 text-white font-[600] ${loading ? "bg-[#cbcbcb]" : "bg-main-color"} rounded-[3px]`}>
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <i className='bx bx-loader-circle bx-spin text-[20px] mr-1 text-[#555]' ></i>
                    Vui lòng đợi...
                  </div>
                ) : "Đăng ký"}
              </button>
            </form>
            <p className='txt'>Bạn chưa có tài khoản? Vui lòng nhấn <Link to="/dang-nhap" className='text-red-600'>đăng nhập.</Link></p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUpPage;
