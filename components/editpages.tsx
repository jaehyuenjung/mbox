import { NextPage } from "next";


const Editpages = () =>{
    return(
        <div id={'pagescroll'} className={'min-w-[150px] min-h-[920px] right-0 w-[200px] h-full p-2 bg-slate-100 overflow-y-scroll '}>
                            <div className={'w-full text-center font-bold text-[15px] '}>Pages</div>
                            {page.map((val,key,)=>{
                                return(
                                    <div key={key} className={'relative self-center my-2 cursor-pointer bg-white border-gray-300 rounded-xl border-[1px]'}
                                    
                                        >
                                        <div className={' flex flex-col '}>
                                            <div className={'flex justify-between items-center px-[3px] h-[28px] bg'}>
                                                <div>
                                                    {key+1}Page
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                                                    onClick={(e)=>{  
                                                        setpage(page.filter(data=>data.id!==val.id))
                                                        setpagelength(page.length)
                                                    }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[100px] w-auto bg-white border-gray-300 border-t-[1px] rounded-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                                                onClick={()=>{
                                                    if(page[key].img.length==0){
                                                        setid(1)
                                                        setimg('/noimage.jpg');
                                                        settitle('사진 제목');
                                                        setdescript('사진 내용');
                                                        setimgwidth(0);
                                                        setimgheight(0);
                                                        setimgexists(false);
                                                    }else{
                                                        setid(page[key].img[0].id);
                                                        setimg(page[key].img[0].src);
                                                        settitle(page[key].img[0].title);
                                                        setdescript(page[key].img[0].descript);
                                                        setimgwidth(page[key].img[0].width);
                                                        setimgheight(page[key].img[0].height);
                                                        if(page[key].img[0].src=='/noimage.jpg'){
                                                            setimgexists(false);
                                                        }else{
                                                            setimgexists(true);
                                                        }
                                                        setid(page[key].img[page[key].img.length-1].id+1)
                                                    }

                                                    if(pagelength<=page.length){
                                                        page[pageindex].img=imglist;
                                                        console.log(pagelength,'s',pageindex)
                                                    }
                                                    setpageindex(key)
                                                    setimglist(page[key].img)
                                                }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className={'flex justify-center items-center w-full h-[100px] my-2 rounded-xl font-bold bg-gray-300 cursor-pointer'}
                                onClick={()=>{
                                    setpagelength(page.length);
                                    setpage(pre=>[...pre,{id:pageid,img:[],src:'/noimage.jpg'}]);
                                    setpageid(pageid=>pageid+1);
                                    setimg('/noimage.jpg');
                                    settitle('사진 제목');
                                    setdescript('사진 내용');

                                } }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[80%] w-[80%]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
    );
}

export default Editpages;