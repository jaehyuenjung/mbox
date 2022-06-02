import useMutation from "@libs/client/useMutation";
import { convertURLtoFile } from "@libs/client/utils";
import { ResponseType } from "@libs/server/withHandler";
import { Pagination, Photo } from "@prisma/client";
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
import { KeyedMutator, mutate } from "swr";
import Input from "./input";

const EditCanvas = dynamic(() => import("@components/edit-canvas"), {
    ssr: false,
});

interface PhotoFormProps {
    photo: Photo;
    onChangePhoto: (deletedId: number, newPhoto: Photo) => void;
}

interface IForm {
    title: string;
    description?: string;
    image: FileList;
}

interface CreatePhotoResponse extends ResponseType {
    photo: Photo;
}

const noImagePath = "/noimage.jpg";

const PhotoForm: NextPage<PhotoFormProps> = ({ photo, onChangePhoto }) => {
    const router = useRouter();
    const { register, handleSubmit, setError, reset, setValue } =
        useForm<IForm>();
    const [createPhoto, { loading, data: createdPhoto, reset: photoReset }] =
        useMutation<CreatePhotoResponse>(
            `/api/albums/me/${router.query.id}/photos`,
            "POST"
        );
    const [photoWidth, setPhotoWidth] = useState(200);
    const [photoHeight, setPhotoHeight] = useState(200);

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
            setNewUrl(noImagePath);
            setImagExist(false);
        }
    }, [photo, setValue]);

    const [newUrl, setNewUrl] = useState(photo ? photo.imagePath : noImagePath);
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

    useEffect(() => {
        if (createdPhoto && createdPhoto.ok && createdPhoto.photo) {
            if (newUrl && photo) {
                const { photo: newPhoto } = createdPhoto;
                (async () => {
                    // const { uploadURL } = await (
                    //     await fetch(`/api/files`)
                    // ).json();

                    // const file = await convertURLtoFile(newUrl);

                    // const form = new FormData();
                    // form.append("file", file, `${Date.now()}`);
                    // const {
                    //     result: { id },
                    // } = await (
                    //     await fetch(uploadURL, { method: "POST", body: form })
                    // ).json();

                    // await fetch(
                    //     `/api/albums/me/${router.query.id}/photos/${newPhoto.id}`,
                    //     {
                    //         method: "POST",
                    //         headers: {
                    //             "Content-Type": "application/json",
                    //         },
                    //         body: JSON.stringify({
                    //             imagePath: `https://imagedelivery.net/aJlyv1nzGO481jzicZKViQ/${id}/public`,
                    //         }),
                    //     }
                    // );

                    await fetch(
                        `/api/albums/me/${router.query.id}/photos/${newPhoto.id}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                imagePath:
                                    "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg",
                            }),
                        }
                    );
                })();
                newPhoto.imagePath = newUrl;
                onChangePhoto(photo.id, newPhoto);
                photoReset();
            }
        }
    }, [createdPhoto, newUrl, photo, router, onChangePhoto, photoReset]);

    const onValid = async ({ title, description }: IForm) => {
        const dataForm: any = {
            width: photoWidth,
            height: photoHeight,
            title,
            paginationId: photo.paginationId,
        };
        if (description != photo?.description && description) {
            const regex = /#[^\s#]+/g;
            const tags = description.match(regex);

            dataForm.description = description.split(regex).join(" ");
            if (tags) dataForm.tags = tags.join(" ");
        }

        if (newUrl && newUrl !== noImagePath) {
            if (!loading) {
                console.log("!!");
                createPhoto(dataForm);
                reset();
            }
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
                        url={newUrl!}
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
                                    src={newUrl!}
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
