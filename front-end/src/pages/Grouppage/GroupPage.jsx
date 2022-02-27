import React from 'react';
import GroupGrid from '../../components/Groupgrid/GroupGrid';
import MemberHeader from '../../components/Memberheader/MemberHeader';

function GroupPage() {
  return (
    <section className='sm:mb-[76px]'>
      <div className='mb-3'>
        <MemberHeader title={"Tất cả nhóm"} />
      </div>
      <div>
        <GroupGrid />
      </div>
    </section>
  )
}

export default GroupPage;
