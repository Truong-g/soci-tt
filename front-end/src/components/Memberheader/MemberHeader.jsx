

import React from 'react';

function MemberHeader({title}) {
    return (
        <div className='w-full p-[20px] bg-white rounded-[2px] shadow-md'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[1rem] text-[#222] font-[600]'>{title ? title : "Tất cả thành viên"}</h1>
                <div className='flex items-center'>
                    <form action="" className='h-[35px] bg-[#ddd] rounded-[10px]'>
                        <input
                            type="text"
                            className='block border-none h-full outline-none bg-transparent w-[200px] px-2 txt-bold-s'
                            placeholder='Tìm kiếm...'
                        />

                    </form>
                    <button className='w-[35px] h-[35px] bg-[#ddd] flex justify-center items-center rounded-[10px] ml-1'>
                        <i className='bx bx-sort-a-z text-[18px] text-[#333]'></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MemberHeader;
