

import React from 'react'

function StickerGrid({onSelect, onShow}) {

    const handleSelectSticker = (e) => {
        onSelect({text: null, image: null, video: null, record: null, sticker: e.target.src}, "sticker")
        onShow(false)
    }

  return (
    <div className='flex bg-white shadow-[0px_-7px_8px_-7px_rgba(0,0,0,0.46)]'>
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642640678/0143745c08bceda801209252c0831b_iqzytn.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642640711/201812132353599393_qtxpmm.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642640745/tenor_rt8gsa.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642640761/v2-b1c9db9b268d575564b6ce60939dabda_b_ppigg4.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642640822/f64f253a1cb2077e796bc30abc13d506_w1pzdh.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642640873/dab9192028a1ec678b159a176633552e_ctpe3h.jpg" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642640901/febaeafc6efd90e86e1dc26f3ae6c3f9_qrpwmx.jpg" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642640981/a1d979cb75f3e6ce356d8cb623522647_fzq4ug.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641017/tenor_zj1rkp.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641027/6a8a93567a289f00b8ed65fd1cfe3bff_flqah5.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641064/tenor_vqxxmv.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641076/AW3625423_18_stvysi.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641163/source_utha3k.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641202/R_txyuv1.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641231/R_ayqvlz.gif" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641269/5084b3d6db5fbcb3026fc445ec08df8e_vyqu7l.png" className='w-[80px] block px-[5px]' />
        <img onClick={handleSelectSticker} src="https://res.cloudinary.com/dwfjhv7mr/image/upload/v1642641318/17f364c5e6324eb6369076c55955409a-10_tl2p5h.gif" className='w-[80px] block px-[5px]' />
    </div>
  )
}

export default StickerGrid