import { BaseProps } from "@components/layout";
import { NextPage } from "next";
import { useState } from 'react';

import dynamic from "next/dynamic";

const Canvas2 = dynamic(() => import("@components/canvas2"), { ssr: false });

const Edit: NextPage<BaseProps> = ({}) => {
    const [imglist, setimglist] = useState([
    {
        id:1,
        src:'/앨범1.jpg',
        title:'1',
        descript:'흰색',
    },{
        id:2,
        src:'/앨범2.jpg',
        title:'2',
        descript:'호색',
    },{
        id:3,
        src:'/앨범3.jpg',
        title:'3',
        descript:'보라',
    },{
        id:4,
        src:'/images.jpg',
        title:'4',
        descript:'파란거',
    },{
        id:5,
        src:'/앨범3.jpg',
        title:'5',
        descript:'보라ㄷ',
    },{
        id:6,
        src:'/앨범3.jpg',
        title:'6',
        descript:'보라보라',
    },]);
    const [title, settitle] = useState('사진제목');
    const [descript, setdescript] = useState('사진내용');
    const [img, setimg] = useState('/noimage.jpg');
    const [index, setindex] = useState(0);
    const [id ,setid] = useState(7);
    const [re, setre] =useState(0);

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

    const btnsave = () =>{
            imglist[index].title=title;
            imglist[index].descript=descript;
            imglist[index].src = img;
            setre(re=>re+1);
    }

    const addbtn= () =>{
        setimglist(pre=>[...pre,{id:id,src:img,title:title,descript:descript}])
    }

    // const imgclick = (index: number, title: string, descript: string) =>{
    //     console.log(index,title,descript);
    //     //setindex(index)
    //     // settitle(title)
    //     // setdescript(descript)
    // }

    return (
        <div className={'w-screen h-screen flex '}>
            <div className={'relative left-0 top-0 w-[320px] h-full p-2 bg-slate-100 overflow-y-scroll '}>
                {imglist.map((key,i,val)=>{
                    return(
                        // eslint-disable-next-line react/jsx-key
                        <div>
                        <img className={'left-[50%] w-[240px] h-[200px] my-2 rounded-xl'} src={key.src}
                        onClick={(e)=>{
                            setindex(i)
                            settitle(key.title)
                            setdescript(key.descript)
                            setimg(key.src)
                            document.getElementById('imginput').value=''
                        }}/>
                        <button className={'absolute'}>삭제</button>
                        </div>
                    );
                })}
                <button className={'left-[50%] w-[240px] h-[200px] my-2 rounded-xl font-bold bg-gray-300'}
                onClick={
                    addbtn
                }>+</button>
            </div>

            <div className={' right-0 top-0 w-[80%] h-full bg-slate-600'}>
                <div className={'flex pt-5 pl-5 flex-col space-y-5 left-0 top-0 w-[96%] h-[96%] bg-slate-200 m-[2%] rounded-3xl'}>
                    <div className={'self-center'}>
                        <div className={' w-[500px] h-[300px] bg-zinc-400'}>  
                            {/* <Canvas2 img={[img]}/> */}
                        </div>
                        {/* <img src={img} className={'absolute right-[2%] top-[2%] w-[35%] h-[35%] bg-zinc-400'}/> */}
                    </div>
                    <div className={' w-[96%] h-[15%] rounded-3xl border-gray-400 border-solid border-[1px] p-3'}>
                        <div className={'text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400'}>제목 입력</div>
                        <input type={'text'} onChange={update_title} value={title}></input>
                    </div>
                    <div className={' w-[96%] h-[15%] rounded-3xl border-gray-400 border-solid border-[1px] p-3'}>
                        <div className={'text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400'}>내용 입력</div>
                        <input type={'text'} onChange={update_descript} value={descript}></input>
                    </div>
                    <div className={' w-[96%] h-[15%] rounded-3xl border-gray-400 border-solid border-[1px] p-3'}>
                        <div className={'text-[20px] font-bold w-full border-b-[1px] m-1 border-solid border-gray-400'}>이미지 업로드</div>
                        <input id={'imginput'} type={'file'} onChange={imgload} ></input>
                    </div>
                    <button className={' w-[96%] h-[4%] rounded-3xl text-[20px] font-bold bg-slate-50 border-[1px] border-gray-400 border-solid'}
                    onClick={btnsave}>저장</button>
                </div>
            </div>
            <div> 가나다라</div>
        </div>
    );
};

export default Edit;