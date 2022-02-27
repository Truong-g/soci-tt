import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CardPost from '../../components/Cardpost/CardPost';
import FormComment from '../../components/Formcomment/FormComment';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { handleReactionPostActions, increaseCommentActions } from '../../redux/actions/postActions';

function PostDetail() {
    const { postId } = useParams()
    const profile = useSelector(state => state.auth.data)
    const socket = useSelector(state => state.socket.server)
    const posts = useSelector(state => state.post.data)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [reply, setReply] = useState(null)
    const [data, setData] = useState(posts.find(post => post.id === postId))

    const dispatch = useDispatch()
    const navigate = useNavigate()



    useEffect(() => {
        getAllComments()
    }, [])


    useEffect(() => {
        socket.on("get comment", (result) => {
            console.log(result);
            if (result.parent_id == 0) {
                setComments(prev => [result, ...prev])
            } else {
                setComments(prev => {
                    const index = prev.findIndex(item => item.id === result.parent_id)
                    prev[index].child_comments = [...prev[index].child_comments, result]
                    return [...prev]
                })
            }
        })
    }, [])

    const getAllComments = async () => {
        setLoading(true)
        const reqOptions = createHeaders("GET", true)
        try {
            const response = await fetch(`${baseURL}/comment/post/${data.id}`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setComments(resBody.data)
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
        }
    }


    const handleReactionRequest = async (postId, typeReaction) => {
        const data = {
            type: "post",
            typeReaction: typeReaction,
            tableId: postId
        }

        dispatch(handleReactionPostActions({
            ...data,
            user_id: profile.id
        }))

        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/post/reaction`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    // process socket noitification
                    console.log(resBody);
                }
            } else {
                localStorage.removeItem("access_jwt")
                navigate("/dang-nhap")
            }
        } catch (error) {
            localStorage.removeItem("access_jwt")
            navigate("/dang-nhap")
        }
    }

    const createComment = async (content) => {
        setLoading(true)
        const datas = {
            content: content,
            postId: data.id,
            type: "post",
            parentId: reply ? reply.id : "0",
            selfId: data.sender.id
        }
        const reqOptions = createHeaders("POST", true, datas)
        try {
            const response = await fetch(`${baseURL}/comment/post`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                dispatch(increaseCommentActions(data.id))
                if (resBody.errCode === 0) {
                    if (resBody.data.parent_id == 0) {
                        setComments(prev => [resBody.data, ...prev])
                    } else {
                        setComments(prev => {
                            const index = prev.findIndex(item => item.id === resBody.data.parent_id)
                            prev[index].child_comments = [...prev[index].child_comments, resBody.data]
                            return [...prev]
                        })
                    }
                    socket.emit("send comment", {...resBody.data, self_id: data.sender.id})
                    setLoading(false)
                }
            } else {
                setLoading(false)
                localStorage.removeItem("access_jwt")
                navigate("/dang-nhap")
            }
        } catch (error) {
            setLoading(false)
            localStorage.removeItem("access_jwt")
            navigate("/dang-nhap")
        }

    }


    return (
        <section className='sm:mb-[76px]'>
            <div className='w-full'>
                <CardPost data={data} onReaction={handleReactionRequest} selfId={profile.id} />
            </div>
            <div className='w-full bg-white rounded-[5px] p-5'>
                <div className='flex justify-end items-center mb-3'>
                    <div className='inline-flex items-center cursor-pointer'>
                        <span className='txt-bold-s'>Bình luận nổi bật</span>
                        <span className='text-[16px] ml-1 text-[#333]'>
                            <i className='bx bxs-down-arrow' ></i>
                        </span>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className='flex items-center'>
                        <div className='w-[40px] h-[40px] rounded-full overflow-hidden mr-3'>
                            <img src={profile.avatar}
                                alt={profile.avatar}
                                className="w-full"
                            />
                        </div>
                        <div className='flex-1'>
                            <FormComment onEnter={createComment} parent={reply} setParent={setReply} />
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    {loading ? (
                        <div className='text-center'>
                            <i className='bx bx-loader-circle bx-spin text-[24px] text-[#333]' ></i>
                        </div>
                    ) : (
                        <>
                            {comments.length === 0 && (
                                <p className='text-center txt-bold-m'>Không có bình luận nào</p>
                            )}
                        </>
                    )}
                    <ul>
                        {/* comment parent */}
                        {comments.map((item, index) => {
                            return (
                                <li className='w-full mb-3' key={index}>
                                    <div className='flex'>
                                        <div className='w-[30px] h-[30px] rounded-full overflow-hidden mr-2'>
                                            <img src={item.user.avatar} alt={item.user.avatar} className="w-full" />
                                        </div>
                                        <div className='flex-1'>
                                            <p className='txt'>
                                                <strong>{item.user.fullname}: </strong>
                                                {item.content}
                                            </p>
                                            <div className='flex mt-1 items-center'>
                                                <div className='flex justify-center items-center'>
                                                    <button className='text-[1.2rem] mr-1'><i className='bx bxs-like'></i></button>
                                                    <span className='txt-bold-s'>3 lượt thích</span>
                                                </div>
                                                <button className='txt-bold-s ml-4' onClick={() => setReply(item)}>Phản hồi</button>
                                            </div>
                                        </div>
                                    </div>


                                    {/* comment child */}
                                    {item.child_comments.length > 0 && (
                                        <ul className='ml-[3rem] mt-1'>
                                            {item.child_comments.map((item2, index2) => {
                                                return (
                                                    <li className='w-full mb-1' key={index2}>
                                                        <div className='flex'>
                                                            <div className='w-[30px] h-[30px] rounded-full overflow-hidden mr-2'>
                                                                <img src={item2.user.avatar} alt="" className={item2.user.avatar} />
                                                            </div>
                                                            <div className='flex-1'>
                                                                <p className='txt'>
                                                                    <strong>{item2.user.fullname}: </strong>
                                                                    {item2.content}
                                                                </p>
                                                                <div className='flex mt-1 items-center'>
                                                                    <div className='flex justify-center items-center'>
                                                                        <button className='text-[1.2rem] mr-1'><i className='bx bxs-like'></i></button>
                                                                        <span className='txt-bold-s'>3 lượt thích</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}

                                        </ul>
                                    )}


                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default PostDetail;
