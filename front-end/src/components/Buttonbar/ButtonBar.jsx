import { useRef } from 'react'
import '../../styles/components/buttonbar.scss'

function ButtonBar({isActive}) {
    const divRef = useRef()
    return (
        <div
            className={`buttonbar${isActive ? " active" : ""}`}
            ref={divRef}
        >
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}

export default ButtonBar;
