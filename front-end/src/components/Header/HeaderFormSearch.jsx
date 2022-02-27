import 'boxicons'

function HeaderFormSearch({ showMobile, setShowMobile }) {

    return (
        <div
            className={`ml-3 sm:ml-0 sm:fixed ${showMobile ? "top-[0] sm:block" : "top-[-56px] sm:hidden"} sm:shadow-sm sm:shadow-stone-700/30 sm:w-[100vw] md:fixed md:bottom-full md:w-[100vw] lg:fixed lg:bottom-full lg:w-[100vw] sm:z-20`}
        >
            <form action="" className="w-[350px] h-11 sm:h-14 relative rounded-3xl sm:rounded-none bg-[#cccccc70] sm:bg-[#fff]  sm:w-[100%]">
                <span className='w-10 text-[1.1rem] text-[#a0a0a0] h-10 flex justify-center items-center absolute left-0 top-1/2 translate-y-[-50%] sm:hidden'>
                    <i className='bx bx-search'></i>
                </span>
                <input type="text" className='outline-none border-none w-full h-full bg-transparent pl-12 text-[12px] font-weightMain pr-3 sm:pl-2'
                    onBlur={() => setShowMobile(false)}
                    placeholder='Tìm kiếm...' />
            </form>
        </div>
    );
}

export default HeaderFormSearch;
