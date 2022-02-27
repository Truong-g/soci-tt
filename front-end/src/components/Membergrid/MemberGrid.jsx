

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import checkFriend from '../../config/checkFriend';

function MemberGrid({ data, handleAddFriend, handleAcceptFriend, handleCancelFriend }) {
    const friends = useSelector(state => state.friend.data)

    return (
        <div className='grid grid-cols-4 gap-3 sm:grid-cols-2 sm:gap-2'>
            {data.map((item, index) => {
                return (
                    <Link to={`/thanh-vien/${item.id}`} className='block min-h-[150px] rounded-[5px] bg-white shadow py-[20px]' key={index}>
                        <div className='w-full'>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden mx-auto'>
                                <img src={item.avatar} alt="" className='w-full' />
                            </div>
                        </div>
                        <div className='mt-[10px]'>
                            <h4 className='text-[0.9rem] font-[600] text-[#333] text-center'>{item.fullname}</h4>
                            <p className='txt text-center'>{item.email}</p>
                        </div>
                        <div className='mt-[10px]'>
                            {checkFriend(friends, item.id) === 0 && (
                                <button
                                    className='px-[1rem] py-[0.5rem] rounded-[20px] text-[0.8rem] text-white font-[600] flex justify-center items-center bg-[#10d876] mx-auto'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleAddFriend(item)}}
                                >
                                    Kết bạn
                                </button>
                            )}
                            {checkFriend(friends, item.id) === 1 && (
                                <button
                                    className='px-[1rem] py-[0.5rem] rounded-[20px] text-[0.8rem] text-[#555] font-[600] flex justify-center items-center bg-[#ddd] mx-auto'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleCancelFriend(item)}}
                                >
                                    Hủy kết bạn
                                </button>
                            )}
                            {checkFriend(friends, item.id) === 2 && (
                                <button
                                    className='px-[1rem] py-[0.5rem] rounded-[20px] text-[0.8rem] text-[#555] font-[600] flex justify-center items-center bg-[#ddd] mx-auto'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleAcceptFriend(item)}}
                                >
                                    Chấp nhận kết bạn
                                </button>
                            )}
                            {checkFriend(friends, item.id) === 3 && (
                                <button
                                    className='px-[1rem] py-[0.5rem] rounded-[20px] text-[0.8rem] text-[#555] font-[600] flex justify-center items-center bg-[#ddd] mx-auto'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleCancelFriend(item)}}
                                >
                                    Đã gửi lời mời
                                </button>
                            )}

                        </div>
                    </Link>
                )
            })}


        </div>
    )
}

export default MemberGrid;
