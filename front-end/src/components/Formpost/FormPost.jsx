import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import '../../styles/components/text.scss'



function FormPost({ onHandleValues }) {
    const profile = useSelector(state => state.auth.data)
    const [preview, setPreview] = useState(null)
    const [media, setMedia] = useState(null)
    const [content, setContent] = useState("")


    useEffect(() => {
        // clean up
        return () => {
            preview && URL.revokeObjectURL(preview)
        }
    }, [preview])

    const handleMedia = (e) => {
        const file = e.target.files[0]
        setPreview(URL.createObjectURL(file))
        setMedia(file)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(content === "" && !media) return

        const data = {
            media, content
        }
        onHandleValues(data)
        setContent("")
        setMedia(null)
        setPreview(null)
        e.target.focus()
    }


    return (
        <div className="w-full p-5 bg-white rounded-[10px] shadow-md">
            <div className="flex items-center mb-3">
                <div className="w-[35px] h-[35px] rounded-full bg-[#eee] flex justify-center items-center text-main-color text-[22px] ">
                    <i className='bx bx-edit-alt'></i>
                </div>
                <span className="txt-bold-m ml-3">Tạo bài viết</span>
            </div>
            <div className='relative'>
                <form
                    onSubmit={handleSubmit}>
                    <textarea
                        className="resize-none rounded-[5px] w-full border-solid border-[1px] border-[#ccc] txt-bold-s p-[10px] pl-[40px] outline-none"
                        rows={3}
                        placeholder='Bạn đang nghĩ gì?'
                        onChange={(e) => setContent(e.target.value)}
                        value={content} form='form'
                    >

                    </textarea>
                    <button type='submit' className='w-full py-[0.3rem] bg-main-color rounded-[3px] text-[13px] text-white font-[600]'>Đăng</button>
                </form>

                <div className='absolute top-[5px] left-[5px] w-[30px] h-[30px] overflow-hidden rounded-full'>
                    <img src={profile.avatar} alt="" className='w-full' />
                </div>
            </div>
            {preview && (
                <div className='mt-1'>
                    {media.type.indexOf("image") != -1 && (
                        <div
                            className='w-full pt-[60%] bg-center bg-cover bg-no-repeat rounded-[10px] relative overflow-hidden'
                            style={{ backgroundImage: `url("${preview}")` }}
                        >
                            <div className='absolute top-0 left-0 right-0 bottom-0 bg-[#00000090] flex justify-center items-center'>
                                <button
                                    className='px-[1rem] py-[0.5rem] bg-[#eeeeee] flex justify-center items-center font-[600] text-[15px] text-[#333]'
                                    onClick={() => {
                                        preview && URL.revokeObjectURL(preview)
                                        setPreview(null)
                                        setMedia(null)
                                    }}
                                >
                                    HỦY
                                </button>
                            </div>
                        </div>
                    )}

                    {media.type.indexOf("video") != -1 && (
                        <div className='w-full relative'>
                            <video width="100%" height="100%" controls>
                                <source src={preview} type="video/mp4" />
                            </video>
                            <div className='absolute top-0 left-0 right-0 bottom-0 bg-[#00000090] flex justify-center items-center'>
                                <button
                                    className='px-[1rem] py-[0.5rem] bg-[#eeeeee] flex justify-center items-center font-[600] text-[15px] text-[#333]'
                                    onClick={() => {
                                        setPreview(null)
                                        setMedia(null)
                                    }}
                                >
                                    HỦY
                                </button>
                            </div>
                        </div>

                    )}
                </div>
            )}

            <div className='mt-4 flex justify-between items-center'>
                <div className='flex items-center sm:flex-wrap'>
                    <div className='flex items-center mr-4 cursor-pointer'>
                        <i className='bx bx-video mr-1 text-red-600 text-[26px]'></i>
                        <span className='txt-bold-m'>Live stream</span>
                    </div>
                    <div
                        className='flex items-center mr-4 cursor-pointer relative overflow-hidden'
                    >
                        <i className='bx bx-image-alt mr-1 text-green-400 text-[26px]'></i>
                        <span className='txt-bold-m'>Ảnh/Video</span>
                        <input
                            type="file"
                            className='absolute top-0 bottom-0 left-0 right-0 w-full h-full z-10 block appearance-none cursor-pointer opacity-0'
                            onChange={handleMedia}
                        />
                    </div>
                    <div className='flex items-center cursor-pointer'>
                        <i className='bx bx-camera mr-1 text-amber-400 text-[26px]'></i>
                        <span className='txt-bold-m'>Cảm xúc/Hoạt động</span>
                    </div>

                </div>
                <button className='w-[40px] h-[40px] rounded-full bg-[#eee] flex justify-center items-center text-[#444] text-[22px] sm:hidden'>
                    <i className='bx bx-dots-horizontal-rounded' ></i>
                </button>
            </div>
        </div>
    )
}

export default FormPost;
