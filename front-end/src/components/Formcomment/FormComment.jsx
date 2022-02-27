import React, { useState } from 'react'

function FormComment({ onEnter, parent, setParent }) {
    const [text, setText] = useState("")


    const handleChangeText = (e) => {
        setText(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onEnter(text)
        setText("")
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='bg-[#ddd] h-[35px] w-full rounded-[20px] relative'>
            <div className='flex items-center h-full rounded-[20px] pl-3'>
                {parent && (
                    <div className='mr-[6px] inline-flex items-center rounded-[20px] bg-[#ccc] px-[10px] py-[3px]'>
                        <span className='text-[13px]'>Trả lời {parent.user.fullname} </span>
                        <span className='inline-flex items-center h-full cursor-pointer' onClick={() => setParent(null)}><i className='bx bx-x bx-rotate-90 text-[20px]' ></i></span>
                    </div>
                )}

                <input type="text" value={text} onChange={handleChangeText} className='flex-1 h-full bg-transparent outline-none text-[#333] text-[13px] font-[600] pr-[7rem] sm:pr-[7rem]' />
            </div>
            <div className='absolute flex right-0 h-full top-0 bottom-0 items-center'>
                <button className='flex justify-center items-center ml-2 text-[24px] mr-2'><i className='bx bx-image-alt'></i></button>
                <button className='flex justify-center items-center ml-2 text-[24px] mr-2'><i className='bx bxs-shapes'></i></button>
                <button className='flex justify-center items-center ml-2 text-[24px] mr-1'><i className='bx bx-smile'></i></button>
            </div>
        </form>
    )
}

export default FormComment