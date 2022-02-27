

import { data } from 'autoprefixer';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import formatDate from '../../config/formatDate';
import '../../styles/components/message.scss'


function Message({ list, loading, mediaLoaded }) {
    const profile = useSelector(state => state.auth.data)
    const scrollRef = useRef()


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [loading, list])


    return (
        <>
            {loading ? (
                <div className='h-full flex justify-center items-center'>
                    <i className='bx bx-loader-circle bx-spin text-main-color text-[24px]'></i>
                </div>
            ) : (
                <ul className='p-2 pb-0'>
                    {list.map((item, index) => {
                        return (
                            <li className={`w-full ${item.sender.id === profile.id ? "me" : "you"} mb-3`} key={index} ref={scrollRef}>
                                <div className='box'>
                                    <Link to={`/thanh-vien/${item.sender.id}`} className='avatar block'>
                                        <img src={item.sender.avatar} alt={item.sender.avatar} className='w-full' />
                                    </Link>
                                    <div className='flex-1'>
                                        <div className='content'>
                                            {item.content && (
                                                <p className='text'>{item.content}</p>
                                            )}
                                            {item.record && (
                                                <audio
                                                    className={`h-[35px] ${item.sender.id === profile.id ? "ml-[11px]" : ""}`}
                                                    controls
                                                >
                                                    <source src={item.record} />
                                                </audio>
                                            )}
                                            {item.video && (
                                                <video
                                                    className={`${item.sender.id === profile.id ? "ml-[11px]" : ""}`}
                                                    controls>

                                                    <source src={item.video} />
                                                </video>
                                            )}
                                            {item.image && (
                                                <div>
                                                    <img src={item.image} alt="" className={`max-w-[300px] sm:max-w-[200px] object-cover ${item.sender.id === profile.id ? "ml-[11px]" : ""}`} />
                                                </div>
                                            )}

                                            {item.sticker && (
                                                <div className={`${item.sender.id === profile.id ? "text-right" : ""}`}>
                                                    <img src={item.sticker} alt="" className={`w-[120px] sm:w-[70px] inline-block object-cover`} />
                                                </div>
                                            )}

                                        </div>
                                        <div className='px-[10px] time'>
                                            <span className='txt'>{formatDate(item.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            
                        )
                    })}
                    {list.length === 0 && (
                        <li className='text-center txt'>Chưa có tin nhắn nào!</li>
                    )}
                    {mediaLoaded && (
                        <li className='text-right'>
                            <span className='inline-block txt bg-[#eee] px-[10px] py-[3px] mb-[3px] rounded-lg'>
                                Đang tải file phương tiện, vui lòng đợi...
                            </span>
                        </li>
                    )}
                </ul>
            )}

        </>

    )
}

export default Message;
