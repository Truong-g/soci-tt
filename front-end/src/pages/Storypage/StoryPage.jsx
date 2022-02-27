import React from 'react';
import MemberHeader from '../../components/Memberheader/MemberHeader';
import StoryGrid from '../../components/Storygrid/StoryGrid';

function StoryPage() {
  return (
    <section className='sm:mb-[76px]'>
      <div className='mb-3'>
        <MemberHeader title={"Tất cả story"} />
      </div>
      <div>
          <StoryGrid />
      </div>
    </section>
  )
}

export default StoryPage;
