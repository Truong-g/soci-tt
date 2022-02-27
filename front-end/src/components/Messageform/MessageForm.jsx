


import React, { useEffect, useRef, useState } from 'react';
import Picker from 'emoji-picker-react';
import SoundWaves from '../Soundwave/SoundWaves';
import StickerGrid from '../Stickergrid/StickerGrid';



function MessageForm({ onAdd }) {
    const [text, setText] = useState("")
    const [showSticker, setShowSticker] = useState(false)
    const [showRecordComp, setShowRecordComp] = useState(false)
    const [showPicker, setShowPicker] = useState(false);
    const [cursorPosition, setCursorPosition] = useState()
    const inputRef = useRef()




    const handleSubmit = (e) => {
        e.preventDefault()
        setShowPicker(false)
        if (text.length > 0) {
            onAdd({ text: text, image: null, video: null, record: null, sticker: null }, "text")
            setText("")
        }
    }

    const setRecoder = () => {
        setShowRecordComp(true)
        var device = navigator.mediaDevices.getUserMedia({ audio: true });
        var items = [];
        device.then((stream) => {
            var recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => {
                items.push(e.data);
                if (recorder.state == "inactive") {
                    var blob = new Blob(items, { type: "audio/webm" });
                    onAdd({ text: null, image: null, video: null, record: blob, sticker: null }, "record")
                }
            };
            recorder.start();
            setTimeout(() => {
                recorder.stop();
                setShowRecordComp(false)
            }, 3500);
        });
    }

    const handleMedia = (e) => {
        const file = e.target.files[0]
        if (file.type === "image/jpg" || file.type === "image/jepg" || file.type === "image/png") {
            onAdd({ text: null, image: file, video: null, record: null, sticker: null }, "image")

        }
        if (file.type === "video/mp4" || file.type === "video/avi" || file.type === "video/mov") {
            onAdd({ text: null, image: null, video: file, record: null, sticker: null }, "video")
        }
    }

    const onEmojiClick = (event, { emoji }) => {
        event.stopPropagation()
        const ref = inputRef.current
        ref.focus()
        const start = text.substring(0, ref.selectionStart)
        const end = text.substring(ref.selectionStart)
        const newMsg = start + emoji + end
        setText(newMsg);
        setCursorPosition(start.length + emoji.length)
        setShowPicker(true)
    };

    useEffect(() => {
        inputRef.current.selectionEnd = cursorPosition
    }, [cursorPosition])



    return (
        <div className="w-full h-full px-[10px] flex items-center relative">
            <div className="flex items-center mr-3">
                <button
                    onClick={() => setRecoder()}
                    className={`w-[35px] h-[35px] rounded-full flex justify-center items-center text-[#666] text-[18px] mr-2 ${showRecordComp ? "bg-[#ddd]" : "bg-[#eee]"}`}>
                    <i className='bx bx-microphone'></i>
                </button>
                <button
                    className="w-[35px] h-[35px] rounded-full flex justify-center items-center bg-[#eee] text-[#666] text-[18px]m mr-2 relative cursor-pointer overflow-hidden">
                    <i className='bx bx-image-alt'></i>
                    <input type="file" className='absolute top-0 left-0 right-0 bottom-0 opacity-0 appearance-none cursor-pointer block ' onChange={handleMedia} />
                </button>
                <button
                    onClick={() => setShowSticker(!showSticker)}
                    className="w-[35px] h-[35px] rounded-full flex justify-center items-center bg-[#eee] text-[#666] text-[18px]">
                    <i className='bx bx-sticker' ></i>
                </button>
            </div>
            <div className="flex-1 h-full">
                <form className="flex items-center h-full"
                    onSubmit={handleSubmit}
                >
                    <div className="relative flex-1 h-[35px] bg-main-color-dim rounded-[20px]">
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full h-full bg-transparent outline-none rounded-[20px] pl-[16px] pr-[30px] text-[13px] text-[#444] font-[600]"
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                        />
                        <i
                            onClick={() => {
                                setShowPicker(!showPicker)
                                inputRef.current.focus()
                            }}
                            className='bx bx-happy-alt absolute right-[5px] top-1/2 translate-y-[-50%] text-main-color text-[24px]'>

                            <div className={`absolute right-0 bottom-[calc(100%_+_10px)] shadow-lg ${showPicker ? "block" : "hidden"} w-[300px]`}>
                                <Picker
                                    pickerStyle={{ width: '100%' }}
                                    onEmojiClick={onEmojiClick} />
                            </div>

                        </i>
                    </div>
                    <button className="w-[35px] h-[35px] text-[28px] text-main-color ml-1"><i className='bx bxs-send' ></i></button>
                </form>
            </div>
            {showRecordComp && (
                <div className='absolute bottom-full left-0 right-0'>
                    <SoundWaves />
                </div>
            )}

            {showSticker && (
                <div className='absolute bottom-full left-0 right-0 w-full overflow-x-scroll bg-white hide-scroll-x'>
                    <StickerGrid onSelect={onAdd} onShow={setShowSticker} />
                </div>
            )}
        </div>
    )
}

export default MessageForm;
