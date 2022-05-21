/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { BaseProps } from "@components/layout";
import { NextPage } from "next";
import { useCallback, useState,useEffect} from 'react';

import dynamic from "next/dynamic";
import Imgaddbtn from "@components/editimgadd";
import Dropzone, { useDropzone } from "react-dropzone";
import { PulseLoader } from "react-spinners";
import { Droppable } from "react-beautiful-dnd";

const Canvas2 = dynamic(() => import("@components/canvas2"), { ssr: false });

const Edit: NextPage<BaseProps> = ({}) => {
   
    const [imglist, setimglist] = useState([
    {
        id:1,
        src:'/앨범1.jpg',
        title:'1',
        descript:'흰색',
        width:200,
        height:200,
    },{
        id:2,
        src:'/앨범2.jpg',
        title:'2',
        descript:'호색',
        width:200,
        height:200,
    },{
        id:3,
        src:'/앨범3.jpg',
        title:'3',
        descript:'보라',
        width:200,
        height:200,
    },{
        id:4,
        src:'/images.jpg',
        title:'4',
        descript:'파란거',
        width:200,
        height:200,
    },{
        id:5,
        src:'/앨범3.jpg',
        title:'5',
        descript:'보라ㄷ',
        width:200,
        height:200,
    },{
        id:6,
        src:'/앨범3.jpg',
        title:'6',
        descript:'보라보라',
        width:200,
        height:200,
    },]);
    const [page, setpage] = useState([{id:1,img:imglist, src:'/noimage.jpg'}]);
    const [title, settitle] = useState('사진제목');
    const [descript, setdescript] = useState('사진내용');
    const [img, setimg] = useState('/noimage.jpg');
    const [index, setindex] = useState(0);
    const [pageindex, setpageindex] = useState(0);
    const [id ,setid] = useState(7);
    const [pageid, setpageid] =useState(2);
    const [pagelength, setpagelength] = useState(0);   
    const [imgwidth, setimgwidth] = useState(0);
    const [imgheight, setimgheight] = useState(0); 
    const [imgcheck, setimgcheck] = useState(false);
    const [imgexists, setimgexists] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles)
        setimg(URL.createObjectURL(acceptedFiles[0]));
        setimgcheck(true);
      }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const imgload = (event:any) => {
        if(event.target.files[0]!=undefined){
            setimg(URL.createObjectURL(event.target.files[0]))
        }
    }
    
    const update_title =(event:any)=>{
        settitle(event.target.value)
    }

    const update_descript =(event:any)=>{
        setdescript(event.target.value)
    }

    const update_width =(event:any)=>{
        setimgwidth(event.target.value)
    }

    const update_height =(event:any)=>{
        setimgheight(event.target.value)
    }

    const update_widthheight=(width:number,height:number)=>{
        setimgwidth(width);
        setimgheight(height);
    }

    const btnsave = () =>{
        imglist[index].title=title;
        imglist[index].descript=descript;
        imglist[index].src = img;
        imglist[index].width = imgwidth;
        imglist[index].height = imgheight;
        settitle('');
        setdescript('');
        if(img!=='/noimage.jpg'){
            setimg('/noimage.jpg'); 
        }
        setimgcheck(false);    
    }

    const addimgbtn= () =>{
        setimglist(pre=>[...pre,{id:id,src:'/noimage.jpg',title:'사진 제목',descript:'사진 내용',width:100,height:100}]);
        setid(id=>id+1);

    }


<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
</svg>
    return (
            <div id={'editpage'} className={' w-full h-full flex overflow-y-scroll m-auto'}>
                <div id={'imgscroll'} className={'min-w-[230px] min-h-[920px] w-[320px] h-full p-2 bg-slate-100 overflow-y-scroll '}>
                    <div className={'w-full text-center font-bold text-[15px] '}>Images</div>
                    {imglist.map((val,key,)=>{
                        return(
                            <div key={key} className={'relative self-center my-2 cursor-pointer bg-white border-gray-300 rounded-xl border-[1px]'}>
                                <div className={' flex flex-col '}>
                                    <div className={'flex justify-between items-center px-[3px] h-[28px] bg'}>
                                        <div>
                                            {val.title}
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                                            onClick={(e)=>{  
                                                setimglist(imglist.filter((data)=>data.id!==val.id));
                                            }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                    <img className={'w-auto h-[200px] border-gray-300 border-t-[1px]  rounded-xl'} src={val.src}
                                        onClick={()=>{
                                            setindex(key);
                                            settitle(val.title);
                                            setdescript(val.descript);
                                            setimg(val.src);
                                            setimgwidth(val.width);
                                            setimgheight(val.height);
                                            document.getElementById('imginput').value='';
                                            setimgcheck(false);
                                            if(val.src!=='/noimage.jpg'){
                                                setimgexists(true);
                                            }else{
                                                setimgexists(false);
                                            };

                                        }}
                                    />

                                </div>
                                
                                
                            </div>
                        );
                    })}
                    <Imgaddbtn addimgbtn={addimgbtn} imglist={imglist.length}/>
                </div>

                <div className={' right-0 top-0 w-[80%] h-full bg-slate-600 min-h-[920px] min-w-[780px]'}>
                    <div className={'flex p-5 flex-col space-y-5 left-0 top-0 w-[96%] h-[96%] bg-slate-200 m-[2%] rounded-3xl'}>
                        <div className={'self-center'}>
                            <div className={' w-[600px] h-[400px] bg-zinc-400'}>  
                                <Canvas2 img={[img]} update_w_h={update_widthheight}/>
                            </div>
                        </div>
                        <div className={'flex flex-row w-[100%] h-[55%]  space-x-1 '}>
                            <div className={'flex flex-col w-full h-[100%] rounded-3xl border-gray-400 border-solid border-[1px] p-3'}>
                                <div className={'text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400'}>
                                    이미지 업로드
                                </div>
                                <div {...getRootProps()} className={'relative self-center w-full h-full bg-white rounded-md cursor-pointer'}>
                                    <input {...getInputProps()} id={'imginput'} type={'file'} onChange={imgload} />{
                                        imgexists?
                                        <img className={'absolute text-center w-full h-full m-auto'}  src={img}/>:
                                        imgcheck?
                                        <img className={'absolute text-center w-full h-full m-auto'}  src={img}/>:
                                        isDragActive ?
                                        <div className={'absolute top-[50%] text-center w-full h-auto m-auto'}><PulseLoader  color="#cccccc" size={20} margin="1px" /></div> :
                                        <div className={'absolute top-[50%] text-center  w-full h-auto m-auto'}><p>이곳에 이미지를 끌어오세요</p></div>
                                    }
                                </div>   
                            </div>
                            <div className={'flex flex-col w-full space-y-1'}>
                                <div className={'flex flex-col w-full h-[37.5%] rounded-3xl border-gray-400 border-solid border-[1px] p-3'}>
                                    <div className={'text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400'}>제목 입력</div>
                                    <textarea className={'resize-none w-full h-full rounded-md'}  onChange={update_title} value={title}></textarea>
                                </div>
                                <div className={'flex flex-col w-full h-[37.5%] rounded-3xl border-gray-400 border-solid border-[1px] p-3'}>
                                    <div className={'text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400'}>내용 입력</div>
                                    <textarea className={'resize-none w-full h-full rounded-md'} onChange={update_descript} value={descript}></textarea>
                                </div>
                                <div className={'flex flex-row  w-full h-[25%] rounded-3xl border-gray-400 border-solid border-[1px] p-3 space-x-1'}>
                                    <div className={'flex flex-col w-[100%]'}>
                                        <div className={' text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400'}>가로 길이</div>
                                        <input className={'ml-2 w-auto'} disabled={true} type={'number'} onChange={update_width} value={imgwidth} ></input>
                                    </div>
                                    <div className={'flex flex-col w-[100%]'}>
                                        <div className={'text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400'}>세로 길이</div>
                                        <input className={'ml-2 w-auto'} disabled={true} type={'number'} onChange={update_height} value={imgheight} ></input>
                                    </div>
                                    
                                </div>
                            </div>    
                        </div>
                        <button className={' w-[100%] h-[5%] rounded-3xl text-[20px] font-bold bg-slate-50 border-[1px] border-gray-400 border-solid'}
                            onClick={btnsave}
                            >저장
                        </button>
                    </div>
                </div>

                <div id={'pagescroll'} className={'min-w-[230px] min-h-[920px]  w-[320px] h-full p-2 bg-slate-100 overflow-y-scroll '}>
                    <div className={'w-full text-center font-bold text-[15px] '}>Pages</div>
                    {page.map((val,key,)=>{
                        let a = false;
                        if(val.img.length==0){
                            a=false;
                        }else{
                            a=true;
                        }
                        return(
                            <div key={key} className={'relative self-center my-2 cursor-pointer bg-white border-gray-300 rounded-xl border-[1px]'}>
                                <div className={' flex flex-col '}>
                                    <div className={'flex justify-between items-center px-[3px] h-[28px] bg'}>
                                        <div>
                                            {key+1}Page
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                                            onClick={(e)=>{  
                                                setpage(page.filter(data=>data.id!==val.id))
                                            }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[200px] w-auto bg-white border-gray-300 border-t-[1px] rounded-xl" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
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
                    <div className={'flex justify-center items-center w-full h-[200px] my-2 rounded-xl font-bold bg-gray-300 cursor-pointer'}
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
            </div>
    );
};

export default Edit;