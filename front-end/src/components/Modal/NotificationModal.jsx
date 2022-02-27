

import { useDispatch, useSelector } from 'react-redux';
import { setNotificationModal } from '../../redux/actions/modalActions';
import './backdrop.scss'

function NotificationModal() {
    const dispatch = useDispatch()
    const notiModal = useSelector(state => state.modal.modalNotification)
    

    return (
        <div className='backdrop_container'>
            <div className={`notification_modal_box ${notiModal.type}`}>
                <div className="notification_modal_box_main">
                    <div className="notification_modal_box_main_icon">
                        {notiModal.type === "error" && (<i className="fas fa-exclamation-triangle"></i>)}
                        {notiModal.type === "warning" && (<i className="fas fa-exclamation-circle"></i>)}
                        {notiModal.type === "infor" && (<i className="fas fa-frown"></i>)}
                    </div>
                    <div className="notification_modal_box_main_title">
                        <span className="title">{notiModal.type === "error" ? "Lỗi!" : "Cảnh báo!"}</span>
                    </div>
                    <div className="notification_modal_box_main_message">
                        <span className="message">{notiModal.message}</span>
                    </div>
                </div>
                <button
                 className='notification_modal_box_btn'
                 onClick={() => dispatch(setNotificationModal(null))}
                 >OK</button>
            </div>
        </div>
    )
}

export default NotificationModal;
