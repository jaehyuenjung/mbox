export function BackBtn() {
    return(
        <button id={"backbtn"}  
        className={'fixed top-[6px] left-[5px] rounded-sm w-[50px] h-[30px] bg-white cursor-pointer rounded-sm'}
        >뒤로</button>
    );
}
  
export function AddBtn({ addclick}:any) {
    return(
    <button 
    className={'fixed top-[6px] left-[60px] w-[50px] h-[30px] bg-white cursor-pointer rounded-sm'}
        id={"addbtn1"} onClick={addclick}>추가</button>
    );
}
  
export  function RemoveBtn({removeclick}:any) {
    return(
        <button 
        className={'fixed top-[6px] left-[115px] w-[50px] h-[30px] bg-white cursor-pointer rounded-sm'}
        id={"removebtn1"} onClick={removeclick} >삭제</button>
    );
}

export function Leftpage({prepage}:any){
    return(
        <div className={`fixed left-[0px]  w-[50px] h-[50px]  cursor-pointer` }
            style={{top: '50%',
            background: 'url(../왼쪽화살표.png)',
            backgroundSize: '100% 100%',
            opacity:'0.5',
        }}
        onClick={prepage}
        >
        </div>
    );
}

export function Rightpage({nextpage}:any){
    return(
        <div className={'nextbtn'}
        //fixed right-[0px]  w-[50px] h-[50px]  cursor-pointer'}
        style={{top:'50%',
        background: 'url(../오른쪽화살표.png)',
        backgroundSize: '100% 100%',
        opacity:'0.5',}}
        onClick={nextpage}
        ></div>
    );
}