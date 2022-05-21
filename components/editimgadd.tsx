
const Imgaddbtn = ({addimgbtn,imglist}:any) =>{
    if(imglist<10){
        return(
            <div className={'flex justify-center items-center w-full h-[200px] my-2 rounded-xl font-bold bg-gray-300 cursor-pointer'}
            onClick={addimgbtn }
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[80%] w-[80%]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </div>
                // <button className={'w-full h-[200px] my-2 rounded-xl font-bold bg-gray-300'}
                //         onClick={
                //             addimgbtn
                //         }
                //     >
                // </button>
            );
    }else{
        return null;
    }
    
}

export default Imgaddbtn;