

import { useDispatch, useSelector } from 'react-redux';
import { notificationModalAction } from '../../redux/actions/modalActions';

function NotificationModal() {
    const notifications = useSelector(state => state.modal.notificationData)
    const dispatch = useDispatch()

    let type = "green"
    let icon = "bx bx-check"

    if(notifications.type === "warning"){
        type = "#FFCD00"
        icon = "bx bx-question-mark"
        
    }
    if(notifications.type === "error"){
        type = "#FF0000"
        icon = "bx bx-error-circle"
    }
    if(notifications.type === "success"){
        type = "#00FF00"
        icon = "bx bx-check"
    }

    return (
        <div
            class="fixed top-[50%] left-[50%] z-[100] -translate-x-[50%] -translate-y-[50%] p-5 border w-96 shadow-lg rounded-md bg-white"
        >
            <div class="mt-3 text-center">
                <div
                    class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" style={{background: `${type}20`}}
                >
                    <i className={`${icon} text-[30px]`} style={{color: type}}></i>
                </div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Thất bại</h3>
                <div class="mt-2 px-7 py-3">
                    <p class="text-sm text-gray-500">
                        {notifications.message}
                    </p>
                </div>
                <div class="items-center px-4 py-3">
                    <button
                        onClick={ () => dispatch(notificationModalAction(null))}
                        id="ok-btn"
                        class="px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm" style={{background: type}}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotificationModal;
