import {useLocation} from 'react-router-dom'

function StoryDetail() {
  const location= useLocation()
  const { link, user } = location.state
   return (
    <section className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-[#000] flex justify-center items-center">
      <div className="w-[250px]">
        <div className="w-full border-[5px] pt-[154%] relative bg-center bg-cover bg-no-repeat rounded-md"
          style={{backgroundImage: `url("${link}")`}}>
        </div>
      </div>
    </section>
  )
}

export default StoryDetail;
