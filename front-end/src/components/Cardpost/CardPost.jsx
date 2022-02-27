import { useState } from "react";
import { Link } from "react-router-dom";
import checkActiveReaction from "../../config/checkActiveReaction";
import formatDate from "../../config/formatDate";
import handleReactions from "../../config/handleReactions";




function CardPost({ data, onReaction, selfId }) {
    const [loadedMedia, setLoadedMedia] = useState(false)
    const [showAction, setShowAction] = useState(false)

    return (
        <div className="w-full p-5 bg-white rounded-[10px] shadow-md mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link to={`/thanh-vien/${data?.sender.id}`} className="w-[50px] h-[50px] overflow-hidden rounded-full block">
                        <img src={data?.sender.avatar} alt="" className="w-full" />
                    </Link>
                    <div className="flex flex-col ml-2">
                        <h4 className="text-[15px] text-[#333] font-[600]">{data?.sender.fullname}</h4>
                        <span className="txt">{data && formatDate(data.created_at)}</span>
                    </div>
                </div>
                <button className='w-[40px] h-[40px] rounded-full bg-[#eee] flex justify-center items-center text-[#444] text-[22px]'>
                    <i className='bx bx-dots-horizontal-rounded' ></i>
                </button>
            </div>
            <div className="my-3">
                <p className="text-[13px] text-[#555] font-[600]">{data?.content}</p>
            </div>
            {data?.media && (
                <div className={`w-full overflow-hidden flex justify-center items-center rounded-[10px] mb-3 relative ${!loadedMedia && "h-[15rem]"}`}>
                    {data?.media.type_child === "post_image" && (
                        <img src={data?.media.link} alt={data?.media.link} className="w-full" onLoad={() => setLoadedMedia(true)} />

                    )}

                    {data?.media.type_child === "post_video" && (
                        <video
                            width="100%"
                            height="100%"
                            controls
                            onLoadedData={() => setLoadedMedia(true)}
                        >
                            <source src={data?.media.link} type="video/mp4"
                            />
                        </video>
                    )}
                    {!loadedMedia && (
                        <div className="w-full absolute top-0 left-0 right-0 bottom-0 bg-[#999999]"></div>
                    )}
                </div>
            )}

            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div
                            className="flex items-center cursor-pointer relative"
                            onClick={() => setShowAction(!showAction)}
                        >
                            <div className="flex items-center">
                                <div className="w-[25px] h-[25px] rounded-full bg-main-color flex justify-center items-center text-white text-[16px]">
                                    <i className='bx bx-like' ></i>
                                </div>
                                {data && handleReactions(data.reaction).heart > 0 && (
                                    <div className="w-[25px] h-[25px] rounded-full bg-red-600 flex justify-center items-center text-white text-[16px]">
                                        <i className='bx bx-heart'></i>
                                    </div>
                                )}

                                {data && handleReactions(data.reaction).haha > 0 && (
                                    <div className="w-[25px] h-[25px] rounded-full bg-amber-500 flex justify-center items-center text-white text-[16px]">
                                        <i className='bx bx-laugh'></i>
                                    </div>
                                )}
                                {data && handleReactions(data.reaction).angry > 0 && (
                                    <div className="w-[25px] h-[25px] rounded-full bg-orange-700 flex justify-center items-center text-white text-[16px]">
                                        <i className='bx bxs-angry'></i>
                                    </div>
                                )}
                            </div>
                            <span className={`${data && checkActiveReaction(data.reaction, selfId) ? "text-[13px] text-main-color font-[600] ml-1" : "txt-bold-m ml-1"}`}>{data && handleReactions(data.reaction).total} Like</span>
                            {showAction && (
                                <div className="absolute bottom-[calc(100%_+_10px)] left-0 p-2 bg-white rounded-[0.7rem] shadow-md w-[10rem]">
                                    <div className="w-full flex justify-between items-center cursor-default">
                                        <button
                                        onClick={() => onReaction(data?.id, "like", data?.sender.id)}
                                        className="text-main-color flex justify-center items-center text-[1.3rem]"><i className='bx bxs-like'></i></button>
                                        <button
                                        onClick={() => onReaction(data?.id, "heart", data?.sender.id)}
                                        className="text-red-600 flex justify-center items-center text-[1.3rem]"><i className='bx bxs-heart' ></i></button>
                                        <button
                                        onClick={() => onReaction(data?.id, "haha", data?.sender.id)}
                                        className="text-yellow-500 flex justify-center items-center text-[1.3rem]"><i className='bx bxs-laugh'></i></button>
                                        <button
                                        onClick={() => onReaction(data?.id, "angry", data?.sender.id)}
                                        className="text-orange-700 flex justify-center items-center text-[1.3rem]"><i className='bx bxs-angry'></i></button>
                                    </div>
                                </div>
                            )}

                        </div>
                        <Link to={`/bai-viet/${data?.id}`} className="flex items-center ml-4 cursor-pointer">
                            <i className='bx bx-message-rounded text-[22px] text-[#333]'></i>
                            <span className="txt-bold-m ml-1">{data?.comment} Comments</span>
                        </Link>
                    </div>
                    <div className="flex items-center cursor-pointer">
                        <i className='bx bx-share-alt text-[22px] text-[#333]'></i>
                        <span className="txt-bold-m ml-1 sm:hidden">Shares</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardPost;
