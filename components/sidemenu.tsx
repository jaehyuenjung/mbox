import React from 'react';

interface Imenu{
    title : string;
    context: string;
    btnsave: (event: any)=>void;
    titleupdate: (event: { target: { value: React.SetStateAction<string>; };}) => void;
    contextupdate:(event: { target: { value: React.SetStateAction<string>; };}) => void;
    imgload: (event: any) => void;
    checked: boolean;
    inputclick : ()=>void
}

function SideMenu({title, context, btnsave, titleupdate, contextupdate, imgload, inputclick}:Imenu){
    return(
      <div className={'form-check1 fixed top-[0px] right-[0px]'}>
        <input  type={"checkbox"} id={"menuicon"} onClick={inputclick} 
        />
        <label htmlFor={"menuicon"}
          >
          <span ></span>
          <span ></span>
          <span ></span>
        </label>
        <div className={'sidebar rounded-lg'}>
          <p style={{lineHeight:'33.99px'}}> 배경 효과 선택
            <label id={'toggle'}><input type={'checkbox'} id={'checkbox'} /><span className={'toggleslider round'}/></label>
          </p>
          <h3 className={'font-bold pt-[5px] pb-[5px] text-[18px]'}>제목</h3>
          <textarea className={'border border-solid border-[#666666]'} id="infotitle" style={{resize:'none'}} value={`${title}`} cols={26} rows={5} placeholder={"제목을 입력하세요."} onChange={titleupdate}></textarea>
          <h3 className={'font-bold pt-[5px] pb-[5px] text-[18px]'}>내용</h3>
          <textarea className={'border border-solid border-[#666666]'} id="infocontent" style={{resize:'none'}} value={`${context}`} cols={26} rows={5} placeholder={"내용을 입력하세요."} onChange={contextupdate}></textarea>
          {/* <h3 className={'font-bold pt-[5px] pb-[5px] text-[18px]'}>가로길이</h3>
          <p className={'pt-[5px] pb-[5px]'}>{xsize}</p>
          <h3 className={'font-bold pt-[5px] pb-[5px] text-[18px]'}>세로길이</h3>
          <p className={'pt-[5px] pb-[5px]'}>{ysize}</p> */}
          <input id={"loadimg"} type={'file'} onChange={imgload}/>
          <button className={'absolute bottom-[20px] right-[15px] w-[45px] bg-[#eeeeee] h-auto border rounded-[5px] border-solid border-[#666666] '}
          
          id={"savebtn"} onClick={btnsave}>저장</button>
        </div>
      </div>
    );
  }

  export default SideMenu;