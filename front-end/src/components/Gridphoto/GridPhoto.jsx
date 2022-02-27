

import { Link } from 'react-router-dom';
import '../../styles/components/text.scss'

function GridPhoto({ list }) {
    return (
        <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
            <div className='flex justify-between items-center mb-1'>
                <span className="text-[13px] text-[#333] font-[600]">Ảnh</span>
                <Link to="" className='text-main-color text-[13px] font-[500]'>Tất cả</Link>
            </div>
            <div className='grid grid-cols-2 gap-3 mt-5'>
                {list.map((item, index) => {
                    return (
                        <Link
                            key={index}
                            className='pt-[80%] bg-center bg-cover bg-no-repeat w-full overflow-hidden rounded-[5px] block'
                            to={`/anh/${item.id}`}
                            style={{ backgroundImage: `url("${item.link}")` }}
                            state={{link: item.link, user_id: item.user_id, id: item.id}}
                        >
                        </Link>
                    )
                })}
            </div>
            <div className='mt-[20px]'>
                <button className='h-[40px] rounded-[20px] w-[100%] bg-[#ddd] flex justify-center items-center'>
                    <i className="bx bx-edit mr-2"></i>
                    <span className='txt'>Thêm</span>
                </button>
            </div>
        </div>
    )
}

export default GridPhoto;
