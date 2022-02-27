

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CardPost from '../../components/Cardpost/CardPost';
import FormPost from '../../components/Formpost/FormPost';
import UserHeader from '../../components/Userheader/UserHeader';
import UserSideBar from '../../components/Usersidebar/UserSideBar';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { handleReactionPostActions } from '../../redux/actions/postActions';

function UserPage() {
    const profile = useSelector(state => state.auth.data)
    const homePosts = useSelector(state => state.post.data)
    const [posts, setPosts] = useState([])
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userId } = useParams()

    useEffect(() => {
        getPostByUser()
        getInforUser()

        return () => {
            setUser(null)
            setPosts([])
        }
    }, [])

    const getPostByUser = async () => {
        const reqOptions = createHeaders("GET", true)
        try {
            const response = await fetch(`${baseURL}/post/${userId}`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setPosts(resBody.data.data)
                }
            } else {
                localStorage.removeItem("access_jwt")
                if (navigate) {
                    navigate("/dang-nhap")
                }
            }
        } catch (error) {
            localStorage.removeItem("access_jwt")
            if (navigate) {
                navigate("/dang-nhap")
            }
        }
    }

    const handleReactionRequest = async (postId, typeReaction) => {
        const data = {
            type: "post",
            typeReaction: typeReaction,
            tableId: postId
        }

        const checkExists = homePosts.findIndex(item => item.id === postId)
        if (checkExists != -1) {
            dispatch(handleReactionPostActions({
                ...data,
                user_id: profile.id
            }))
        }

        handleReactionUserPage(posts, { ...data, user_id: profile.id })

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

    const handleReactionUserPage = (dataArrays, actionData) => {
        const copyData = [...dataArrays]
        const indexData = dataArrays.findIndex(item => item.id === actionData.tableId)
        const selectReactionData = dataArrays.find(item => item.id === actionData.tableId)
        let selectReaction = dataArrays.find(item => item.id === actionData.tableId).reaction

        const index1 = selectReaction.findIndex(item => item.user_id === actionData.user_id && item.type_reaction === actionData.typeReaction)
        if (index1 != -1) {
            selectReaction.splice(index1, 1)
        } else {
            const index2 = selectReaction.findIndex(item => item.user_id === actionData.user_id)
            if (index2 != -1) {
                selectReaction[index2] = { ...selectReaction[index2], type_reaction: actionData.typeReaction }
            } else {
                selectReaction = [...selectReaction, { user_id: actionData.user_id, type_reaction: actionData.typeReaction, created_at: new Date(), updated_at: new Date() }]
            }

        }
        selectReactionData.reaction = selectReaction
        copyData[indexData] = selectReactionData
        setPosts(copyData)
    }

    const getInforUser = async () => {
        const reqOptions = createHeaders("GET", true)
        try {
            const response = await fetch(`${baseURL}/user/${userId}`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {
                    setUser(resBody.data)
                }
            } else {
                localStorage.removeItem("access_jwt")
                if (navigate) {
                    navigate("/dang-nhap")
                }
            }
        } catch (error) {
            localStorage.removeItem("access_jwt")
            if (navigate) {
                navigate("/dang-nhap")
            }
        }
    }

    return (
        <section className='sm:mb-[76px]'>
            <div>
                <UserHeader user={user} targetId={userId} />
            </div>
            <div className='mt-[155px] sm:mt-[214px]'>
                <div className='flex sm:flex-col'>
                    <div className='mr-[16px] sm:mr-0'>
                        <UserSideBar user={user} userId={userId} />
                    </div>
                    <div className='flex-1'>
                        {profile.id === userId && (
                            <div className=' mb-5'>
                                <FormPost />
                            </div>

                        )}

                        <div>
                            {posts.map((item, index) => {
                                return <CardPost data={item} key={index} onReaction={handleReactionRequest} selfId={profile.id} />
                            })}


                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default UserPage;
