import useMutation from "@libs/client/useMutation";
import { convertURLtoFile } from "@libs/client/utils";
import { Photo } from "@prisma/client";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import Input from "./input";

const EditCanvas = dynamic(() => import("@components/edit-canvas"), {
    ssr: false,
});

interface PhotoFormProps {
    photo?: Photo;
    no?: number;
}

interface IForm {
    title: string;
    description?: string;
    image: FileList;
}

const PhotoForm: NextPage<PhotoFormProps> = ({ photo, no }) => {
    const router = useRouter();
    const { register, handleSubmit, setError, reset, setValue } =
        useForm<IForm>();
    const [createOrUpdatePhoto, { loading }] = useMutation<ResponseType>(
        `/api/photos/me/${router.query.id}`,
        "POST"
    );
    const [photoWidth, setPhotoWidth] = useState(0);
    const [photoHeight, setPhotoHeight] = useState(0);

    useEffect(() => {
        if (photo && photo.id) {
            setValue("title", photo.title);
            setValue(
                "description",
                (photo.description ? photo.description : "") +
                    (photo.tags ? `\n${photo.tags}` : "")
            );
            setNewUrl(photo.imagePath);
            setImagExist(true);
            setPhotoWidth(photo.width);
            setPhotoHeight(photo.height);
        } else {
            setValue("title", "");
            setValue("description", "");
            setNewUrl("/noimage.jpg");
            setImagExist(false);
        }
    }, [photo, setValue]);

    const [newUrl, setNewUrl] = useState(
        photo ? photo.imagePath : "/noimage.jpg"
    );
    const [imagExist, setImagExist] = useState(!!photo);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: useCallback((acceptedFiles) => {
            const url = URL.createObjectURL(acceptedFiles[0]);
            setNewUrl(url);
            setImagExist(true);
        }, []),
    });

    const imgload = (event: any) => {
        if (event.target.files[0] != undefined) {
            const url = URL.createObjectURL(event.target.files[0]);
            setNewUrl(url);
            setImagExist(true);
        }
    };

    const onValid = async ({ title, description, image }: IForm) => {
        const dataForm: any = { width: photoWidth, height: photoHeight };
        if (title != photo?.title) dataForm.title = title;
        if (description != photo?.description && description) {
            const regex = /#[^\s#]+/g;
            const tags = description.match(regex);

            dataForm.description = description.split(regex).join(" ");
            if (tags) dataForm.tags = tags.join(" ");
        }

        if (newUrl !== "/noimage.jpg") {
            if (newUrl !== photo?.imagePath) {
                // const { uploadURL } = await (
                //     await fetch(`/api/files`)
                // ).json();

                // const file = await convertURLtoFile(newUrl);

                // const form = new FormData();
                // form.append("file", file, `${name}#${user.id}`);
                // const {
                //     result: { id },
                // } = await (
                //     await fetch(uploadURL, { method: "POST", body: form })
                // ).json();

                // dataForm.imagePath = id;

                dataForm.imagePath =
                    "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg";
            }

            if (photo && photo.id && dataForm && !loading) {
                console.log(dataForm);
                createOrUpdatePhoto({ ...dataForm, photoId: photo.id, no });
            } else if (dataForm && !loading) {
                createOrUpdatePhoto({ ...dataForm, no });
            }
            location.reload();
        } else {
            setError("image", {}, { shouldFocus: true });
            alert("이미지를 넣어주세요!");
        }
    };

    const onPhotoResize = (newWidth: number, newHeight: number) => {
        setPhotoWidth(newWidth);
        setPhotoHeight(newHeight);
    };

    return (
        <>
            <div className="relative w-[40%] aspect-square mx-auto bg-black">
                {photo && (
                    <EditCanvas
                        key={photo.id}
                        photo={photo}
                        url={newUrl}
                        onResize={onPhotoResize}
                    />
                )}
            </div>
            <form
                onSubmit={handleSubmit(onValid)}
                className="flex flex-col space-y-1"
            >
                <div className="flex  flex-1 space-x-1">
                    <div className="flex flex-col w-full h-full rounded-3xl border-gray-400 border-[1px] p-3">
                        <div className="text-sm font-bold w-full py-2 border-solid border-gray-400">
                            이미지 업로드
                        </div>
                        <div
                            {...getRootProps()}
                            className="relative flex justify-center items-center w-full h-full bg-white rounded-md cursor-pointer"
                        >
                            <input
                                {...getInputProps()}
                                {...register("image")}
                                type="file"
                                accept="image/*"
                                onChange={imgload}
                            />
                            {imagExist ? (
                                <Image
                                    src={newUrl}
                                    className="object-fill"
                                    layout="fill"
                                    alt=""
                                />
                            ) : (
                                <div className="absolute">
                                    이곳에 이미지를 끌어오세요
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col w-full h-full space-y-1">
                        <div className="rounded-3xl border-gray-400 border-[1px] p-3 space-y-2">
                            <Input
                                register={register("title", { required: true })}
                                label="제목"
                                type="text"
                                id="title"
                                required
                                placeholder="제목을 입력하세요.."
                            />
                        </div>
                        <div className="rounded-3xl border-gray-400 border-[1px] p-3 space-y-2">
                            <Input
                                register={register("description")}
                                label="내용"
                                type="content"
                                id="description"
                                required={false}
                                placeholder="내용을 입력하세요.."
                            />
                        </div>
                    </div>
                </div>
                <input
                    type="submit"
                    className="rounded-3xl border-gray-400 border-[1px] p-1 text-center cursor-pointer"
                    value="저장"
                />
            </form>
        </>
    );
};

export default PhotoForm;
