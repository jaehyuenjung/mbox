
const Imgaddbtn = ({addimgbtn,imglist}:any) =>{
    if(imglist<10){
        return(
                <button className={'w-full h-[200px] my-2 rounded-xl font-bold bg-gray-300'}
                    onClick={
                        addimgbtn
                    }
                    >
                </button>
            );
    }else{
        return null;
    }
    
}

export default Imgaddbtn;