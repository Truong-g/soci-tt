

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRightBarAction } from '../../redux/actions/modalActions';

function ButtonShowContactUser() {
    const toggleRightbar = useSelector(state => state.modal.rightBar)
    const [widthScreen, setWidthScreen] = useState(window.innerWidth)
    const dispatch = useDispatch()
    useEffect(() => {

        const handleResizeWidth = () => {
            setWidthScreen(window.innerWidth)
        }

        window.addEventListener('resize', handleResizeWidth)

        return () => {
            window.removeEventListener('resize', handleResizeWidth)
        }

    }, [])
    return (

        <>
            {widthScreen <= 640 && (
                <button 
                className={`w-[50px] h-[50px] rounded-full bg-[#cdcdcd] fixed bottom-[86px] ${toggleRightbar ? "right-[70vw]" : "right-0"} sm:mr-5 shadow-sm flex justify-center items-center transition-all`}
                onClick={() => dispatch(toggleRightBarAction(!toggleRightbar))}
                >
                    <i className='bx bxs-edit text-[25px] text-[#222]' ></i>
                </button>
            )}
        </>

    )
}

export default ButtonShowContactUser;
