import React,{useMemo} from 'react';

function Tooltip({title, context, visible, x, y }:any){
    if(!visible){
      return null;
    }
    return(
      <div className={'bg-[rgb(51,51,51)] opacity-[0.8] w-auto h-auto fixed p-[5px] rounded-[10px]'} 
      style={{
        left:`${x+30}px`,
        top:`${y-40}px`,
        maxWidth  :'300px',
        }}>
          <p style={{font:'bold', color:'#ffffff', fontSize:'1em'}}>제목<br/>
          {/* </p><p id="infotitle"  style={{color:'#ffffff', fontSize:'15'}}> */}
            {`${title}`}</p>
          <p style={{font:'bold', color:'#ffffff', fontSize:'15'}}>내용<br/>
          {/* </p><p id="infocontent"  style={{color:'#ffffff', fontSize:'15'}}> */}
            {`${context}`}</p>
      </div>
      );
}
 
export default React.memo(Tooltip);