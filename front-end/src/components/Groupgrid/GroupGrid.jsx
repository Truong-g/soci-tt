import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import checkOwnGroup from '../../config/checkOwnGroup';

function GroupGrid() {
    const profile = useSelector(state => state.auth.data)
    const groups = useSelector(state => state.group.data)
    return (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-1'>

            <div className='w-full rounded-[10px] overflow-hidden bg-[#ddd] h-[206.6px] shadow-sm flex justify-center items-center'>
                <Link to="/nhom/tao-nhom" className='w-[70px] h-[70px] rounded-full bg-[#fff] flex justify-center items-center'>
                    <i className='bx bx-plus text-[24px] text-[#333]'></i>
                </Link>
            </div>
            {groups.map((item, index) => {
                return (
                    <Link
                        to={`/nhom/${item.id}`}
                        className={`block w-full rounded-[10px] overflow-hidden bg-white shadow-sm ${checkOwnGroup(profile, item) === 2 && "pointer-events-none"}`} key={index}
                        state={{inforGroup: item}}
                    >
                        <div
                            className="w-full pt-[30%] bg-center bg-no-repeat bg-cover relative"
                            style={{ backgroundImage: `url("${item.group_bg}")` }}
                        >
                            <div className='absolute top-full left-[10px] -translate-y-1/2 w-[70px] sm:w-[50px] h-[70px] sm:h-[50px] border-[5px] border-white rounded-full overflow-hidden'>
                                <div className='pt-[100%] bg-cover bg-no-repeat bg-center w-full'
                                    style={{ backgroundImage: `url('${item.group_avatar}')` }}
                                ></div>
                            </div>
                        </div>
                        <div className='pb-[20px]'>
                            <div className='ml-[90px] sm:ml-[70px] py-2'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex flex-col'>
                                        <h3 className='text-[13px] text-[#333] font-[600] leading-none mb-1'>{item.group_name}</h3>
                                        <p className='txt leading-none'>{item.member.find(mem => mem.id === item.group_admin).email}</p>
                                    </div>
                                    <button className={`px-[10px] py-[5px] mr-[10px] rounded-[30px] text-[13px] font-[600] ${checkOwnGroup(profile, item) === 2 ? "bg-main-color text-white" : "bg-[#ddd] text-[#333]"}`}>
                                        {checkOwnGroup(profile, item) === 1 && "Nhóm của bạn"}
                                        {checkOwnGroup(profile, item) === 2 && "Tham gia"}
                                        {checkOwnGroup(profile, item) === 3 && "Đã tham gia"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            })}


        </div>
    )
}

export default GroupGrid;
