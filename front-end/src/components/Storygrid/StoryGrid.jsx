

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function StoryGrid() {
    const stories = useSelector(state => state.story.data)
    return (
        <div className='grid grid-cols-4 gap-3 sm:grid-cols-2 sm:gap-2'>
            {stories.map((item, index) => {
                return (
                    <div key={index} className='w-full bg-cover bg-center bg-no-repeat pt-[154%] overflow-hidden rounded-[5px] relative'>
                        <Link to="/story/chi-tiet"
                            style={{ backgroundImage: `url("${item.link}")` }}
                            className='block absolute top-0 left-0 right-0 bottom-0' state={item}>

                        </Link>
                        <div className="absolute w-full bottom-0">
                            <Link to={`/thanh-vien/${item.user.id}`} className='w-[60px] block h-[60px] border-[3px] border-red-600 rounded-full overflow-hidden mx-auto'>
                                <img src={item.user.avatar} alt="" className="w-full" />
                            </Link>
                            <div className='w-full text-center mb-4'>
                                <span className='text-[13px] text-white font-[600]'>{item.user.fullname}</span>
                            </div>
                        </div>
                    </div>

                )
            })}

        </div>
    )
}

export default StoryGrid;
