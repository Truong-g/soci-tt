

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import FormStory from '../Formstory/FormStory';

function HomeGridStory() {
  const listStory = useSelector(state => state.story.data)
  const [showForm, setShowForm] = useState(false)
  return (
    <div className='w-full'>
      {showForm && (
        <FormStory onShow={setShowForm} />
      )}
      <div className="grid grid-cols-4 sm:max-w-[1024px] overflow-x-scroll sm:grid-cols-[110px_110px_110px_110px] hide-scroll-x  gap-x-[10px]">
        <div
          className="h-[190px] pt-[154%] w-full overflow-hidden rounded-[5px] bg-cover bg-center bg-no-repeat relative bg-[#555]"
        >
          <div className="absolute bottom-0 left-0 right-0">
            <div
              className="w-[50px] h-[50px] mx-auto rounded-full bg-white flex justify-center items-center text-main-color text-[26px]"
              onClick={() => setShowForm(true)}
            >
              <i className='bx bx-plus'></i>
            </div>
            <p className="text-center text-[13px] font-[600] mb-3 mt-2 text-white">Thêm story</p>
          </div>
        </div>
        {listStory.slice(0, 3).map((item, index) => {
          return (
            <div
              key={index}
              style={{ backgroundImage: `url("${item.link}")` }}
              className='h-[190px] pt-[154%] block w-full overflow-hidden rounded-[5px] bg-cover bg-center bg-no-repeat relative'>
              <Link
                state={item}
                to="/story/chi-tiet"
                className="absolute top-0 left-0 right-0 bottom-0"
              >
              </Link>
              <Link to={`/thanh-vien/${item.user_id}`} className="absolute bottom-0 left-0 right-0">
                <div className="w-[50px] h-[50px] mx-auto rounded-full border-2 border-red-600 flex justify-center items-center text-main-color text-[26px] overflow-hidden">
                  <img src={item.user.avatar} alt="" className="w-full" />
                </div>
                <p className="text-center text-[13px] font-[600] mb-3 mt-2 text-white">{item.user.fullname}</p>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default HomeGridStory;
