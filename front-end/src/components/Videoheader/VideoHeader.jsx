

import React from 'react';
import { Link } from 'react-router-dom';

function VideoHeader() {
    return (
        <div className='w-full p-[20px] bg-white rounded-[2px] shadow-sm'>
            <div className='flex justify-between items-center'>
                <h1 className='text-[1rem] text-[#222] font-[600]'>Story nổi bật</h1>
                <Link to="/" className='text-[13px] text-main-color font-[500] block px-[1.2rem] py-[0.3rem] rounded-[20px] bg-main-color-dim'>Tất cả</Link>
            </div>
            <ul className='flex items-center mt-2'>
                <li className='mr-[5px]'>
                    <Link to="/" className='flex justify-center items-center w-[60px] h-[60px] border-solid border-[1px]  rounded-full'>
                    <i className='bx bx-plus text-[20px] text-[#444]' ></i>
                    </Link>
                </li>
                <li className='mr-[5px]'>
                    <Link to="/" className='w-[60px] h-[60px] rounded-full overflow-hidden border-double border-4 border-red-600 block'>
                            <img src="https://images.pexels.com/photos/698532/pexels-photo-698532.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
                    </Link>
                </li>
                <li className='mr-[5px]'>
                    <Link to="/" className='w-[60px] h-[60px] rounded-full overflow-hidden border-double border-4 border-red-600 block'>
                            <img src="https://images.pexels.com/photos/698532/pexels-photo-698532.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
                    </Link>
                </li>
                <li className='mr-[5px]'>
                    <Link to="/" className='w-[60px] h-[60px] rounded-full overflow-hidden border-double border-4 border-red-600 block'>
                            <img src="https://images.pexels.com/photos/698532/pexels-photo-698532.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
                    </Link>
                </li>
                <li className='mr-[5px]'>
                    <Link to="/" className='w-[60px] h-[60px] rounded-full overflow-hidden border-double border-4 border-red-600 block'>
                            <img src="https://images.pexels.com/photos/698532/pexels-photo-698532.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
                    </Link>
                </li>
                <li className='mr-[5px]'>
                    <Link to="/" className='w-[60px] h-[60px] rounded-full overflow-hidden border-double border-4 border-red-600 block'>
                            <img src="https://images.pexels.com/photos/698532/pexels-photo-698532.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default VideoHeader;
