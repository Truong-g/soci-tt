

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MemberGrid from '../../components/Membergrid/MemberGrid';
import MemberHeader from '../../components/Memberheader/MemberHeader';
import createHeaders from '../../config/createHeaders';
import { baseURL } from '../../constants/constants';
import { acceptFriendActions, addFriendActions, cancelFriendActions } from '../../redux/actions/friendActions';

function MemberPage() {
    const profile = useSelector(state => state.auth.data)
    const users = useSelector(state => state.user.data)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleAddFriend = async (user) => {
        dispatch(addFriendActions({
            ...user,
            passive_id: user.id,
            active_id: profile.id,
            status_friend: 2
        }))
        const data = {
            user_id: user.id
        }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/friends/send-request`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {

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
    const handleAcceptFriend = async (user) => {
        dispatch(acceptFriendActions({
            profileId: profile.id,
            userId: user.id
        }))

        const data = {
            user_id: user.id
        }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/friends/accept-request`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {

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
    const handleCancelFriend = async (user) => {
        dispatch(cancelFriendActions(user.id))
        const data = {
            user_id: user.id
        }
        const reqOptions = createHeaders("POST", true, data)
        try {
            const response = await fetch(`${baseURL}/friends/unfrimate`, reqOptions)
            if (response.ok) {
                const resBody = await response.json()
                if (resBody.errCode === 0) {

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

    return (
        <section className='sm:mb-[76px]'>
            <div className='mb-3'>
                <MemberHeader />
            </div>
            <div>
                {users.length === 0 && (
                    <div className='flex py-[10px] justify-center items-center'>
                        <span className='txt'>Không có người dùng nào!</span>
                    </div>
                )}
                {users.length > 0 && (
                    <MemberGrid
                        data={users}
                        handleAddFriend={handleAddFriend}
                        handleAcceptFriend={handleAcceptFriend}
                        handleCancelFriend={handleCancelFriend}
                    />
                )}
            </div>
        </section>
    )
}

export default MemberPage;
