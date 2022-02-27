import { Link } from "react-router-dom";
import GridPhoto from "../Gridphoto/GridPhoto";




function GroupSideBar({ infor }) {

    return (
        <div className="w-[260px] sm:w-full">
            <div className="w-full bg-white rounded-[10px] overflow-hidden shadow-sm mb-4">
                <div
                    className="w-full pt-[45%] bg-center bg-cover bg-no-repeat relative"
                    style={{ backgroundImage: `url("${infor.group_bg}")` }}
                >
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] sm:w-[110px] h-[80px] sm:h-[110px] border-white border-[4px] rounded-[10px] overflow-hidden">
                        <img src={infor.group_avatar} alt="" />
                    </div>
                </div>
                <div className="pt-[45px] sm:pt-[60px]">
                    <div className="px-[10px]">
                        <h3 className="text-[15px] text-center font-[600] text-[#333]">{infor.group_name}</h3>
                        <div className="txt"><strong>Số lượng thành viên: </strong>{infor.member.length}</div>
                        <div className="mt-[10px] flex items-center justify-between">
                            <div className="flex cursor-pointer">
                                {infor.member.slice(0, 5).map((item, index) => {
                                    if (index <= 4) {
                                        return (
                                            <div className={`w-[30px] h-[30px] overflow-hidden rounded-full relative -left-${index * 10}px`} key={index}>
                                                <img src={item.avatar} alt="" className="w-full" />
                                            </div>
                                        )

                                    } else {
                                        return (
                                            <div
                                                className={`w-[30px] h-[30px] overflow-hidden rounded-full relative -left-${index * 10}px`}
                                                key={index}
                                            >
                                                <img src={item.avatar} alt="" className="w-full" />
                                                <div className="absolute top-0 left-0 bottom-0 right-0 bg-[#00000099] flex justify-center items-center">
                                                    <i className='bx bx-dots-horizontal-rounded text-white' ></i>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                            <button className="w-[4rem] py-[3px] bg-main-color text-white rounded-[20px] justify-center items-center flex">
                                <i className='bx bx-plus' ></i>
                                <span className="text-[13px] font-[600]">Mời</span>
                            </button>
                        </div>
                        <div className="my-3 text-center">
                            <button className="px-[1rem] py-[0.4rem] bg-[#ddd] rounded-[20px] text-[#777] text-[13px] font-[600]">Rời khỏi nhóm</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                <h2 className='txt-bold-m mb-4'>Giới thiệu</h2>
                <p className='txt mb-[10px]'>{infor.intro}</p>
            </div>
            <div>
                {/* <GridPhoto /> */}
            </div>
            <div>
                <div className='w-full bg-white p-3 drop-shadow-lg rounded-[10px] mb-4'>
                    <div className='flex justify-between items-center mb-1'>
                        <span className="text-[13px] text-[#333] font-[600]">Sự kiện</span>
                        <Link to="" className='text-main-color text-[13px] font-[500]'>Tất cả</Link>
                    </div>
                    <ul className='p-2 grid grid-cols-1 gap-4'>
                        <li className='flex items-center'>
                            <div className='w-[55px] h-full mr-3 flex justify-center items-center bg-emerald-500 rounded-[3px]'>
                                <div className='py-2'>
                                    <span className='text-[14px] font-[600] uppercase leading-none block text-white'>APR</span>
                                    <h4 className='text-[16px] font-[700] uppercase leading-none block text-white'>22</h4>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <h4 className='txt-bold-m mb-1'>Meeting with clients</h4>
                                <p className='txt h-[36px] overflow-text'>41 madison ave, floor 24 new work,ddddddd NY 10010</p>
                            </div>
                        </li>
                        <li className='flex items-center'>
                            <div className='w-[55px] h-full mr-3 flex justify-center items-center bg-emerald-500 rounded-[3px]'>
                                <div className='py-2'>
                                    <span className='text-[14px] font-[600] uppercase leading-none block text-white'>APR</span>
                                    <h4 className='text-[16px] font-[700] uppercase leading-none block text-white'>22</h4>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <h4 className='txt-bold-m mb-1'>Meeting with clients</h4>
                                <p className='txt h-[36px] overflow-text'>41 madison ave, floor 24 new work,ddddddd NY 10010</p>
                            </div>
                        </li>
                        <li className='flex items-center'>
                            <div className='w-[55px] h-full mr-3 flex justify-center items-center bg-emerald-500 rounded-[3px]'>
                                <div className='py-2'>
                                    <span className='text-[14px] font-[600] uppercase leading-none block text-white'>APR</span>
                                    <h4 className='text-[16px] font-[700] uppercase leading-none block text-white'>22</h4>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <h4 className='txt-bold-m mb-1'>Meeting with clients</h4>
                                <p className='txt h-[36px] overflow-text'>41 madison ave, floor 24 new work,ddddddd NY 10010</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default GroupSideBar;
