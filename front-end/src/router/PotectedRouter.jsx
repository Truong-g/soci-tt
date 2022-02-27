import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { getProfileActions } from '../redux/actions/authActions'

function PotectedRouter() {
    const token = localStorage.getItem("access_jwt")

    return (
        <>
            {!token ? (<Navigate to="/dang-nhap" />) : <Outlet />}
        </>
    )

}

export default PotectedRouter;
