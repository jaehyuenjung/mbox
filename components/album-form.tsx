import useMutation from "@libs/client/useMutation";
import { convertURLtoFile } from "@libs/client/utils";
import { Album } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import Input from "./input";

const noImagePath = "/noimage.jpg";

interface IForm {
    title: string;
    description?: string;
    password?: string;
    image: FileList;
    newUrl?: string;
}

interface AlbumResponse {
    ok: boolean;
    album?: Album;
}

interface AlbumFormProps {
    data: Album[];
    album?: Album;
}

const AlbumForm: NextPage<AlbumFormProps> = ({ data, album }) => {
    const { register, handleSubmit, reset, setValue } = useForm<IForm>();

    const [
        createAlbum,
        { loading: createLoading, data: createdData, reset: createReset },
    ] = useMutation<AlbumResponse>("/api/albums/me", "POST");

    const [
        updateAlbum,
        { loading: updateLoading, data: updatedData, reset: updateReset },
    ] = useMutation<AlbumResponse>(`/api/albums/me/${album?.id}`, "POST");

    const [newUrl, setNewUrl] = useState<string>();
    const [imagExist, setImagExist] = useState(false);
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
    const onValid = ({ title, description, password }: IForm) => {
        setImagExist(false);

        const dataForm: any = { title, newUrl };
        if (description) {
            const regex = /#[^\s#]+/g;
            const tags = description.match(regex);

            dataForm.description = description.split(regex).join(" ");
            if (tags) dataForm.tags = tags.join(" ");
            console.log(dataForm.description);
            console.log(dataForm.tags);
        }
        if (password) dataForm.password = password;

        if (!createLoading && !album) {
            createAlbum(dataForm);
        } else if (!updateLoading && album) {
            updateAlbum(dataForm);
        }
        reset();
    };

    useEffect(() => {
        if (createdData && createdData.ok && createdData.album) {
            const { album: newAlbum } = createdData;
            if (newUrl && newUrl !== noImagePath) {
                (async () => {
                    const { uploadURL } = await (
                        await fetch(`/api/files`)
                    ).json();

                    const file = await convertURLtoFile(newUrl);

                    const form = new FormData();
                    form.append("file", file, `${Date.now()}`);
                    const {
                        result: { id },
                    } = await (
                        await fetch(uploadURL, { method: "POST", body: form })
                    ).json();

                    await fetch(`/api/albums/me/${newAlbum.id}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            imagePath: `https://imagedelivery.net/aJlyv1nzGO481jzicZKViQ/${id}/public`,
                        }),
                    });
                })();
                newAlbum.imagePath = newUrl;
            }
            mutate(
                "/api/albums/me",
                { ok: true, albums: [...data, newAlbum] },
                false
            );
            createReset();
        }
    }, [createdData, data, newUrl, createReset]);

    useEffect(() => {
        if (album && updatedData && updatedData.ok && updatedData.album) {
            const { album: newAlbum } = updatedData;
            if (newUrl && newUrl !== album.imagePath) {
                (async () => {
                    const { uploadURL } = await (
                        await fetch(`/api/files`)
                    ).json();

                    const file = await convertURLtoFile(newUrl);

                    const form = new FormData();
                    form.append("file", file, `${Date.now()}`);
                    const {
                        result: { id },
                    } = await (
                        await fetch(uploadURL, { method: "POST", body: form })
                    ).json();

                    await fetch(`/api/albums/me/${album.id}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            imagePath: `https://imagedelivery.net/aJlyv1nzGO481jzicZKViQ/${id}/public`,
                        }),
                    });
                })();
                newAlbum.imagePath = newUrl;
            }
            const newData = [...data];
            const index = newData.findIndex((a) => a.id === newAlbum.id);
            newData[index] = newAlbum;
            mutate("/api/albums/me", { ok: true, albums: newData }, false);
            updateReset();
        }
    }, [updatedData, data, newUrl, updateReset, album]);

    useEffect(() => {
        if (album) {
            setValue("title", album.title);
            setValue(
                "description",
                album.description
                    ? album.description + (album.tags ? "\n" + album.tags : "")
                    : ""
            );
        }
    }, [album, setValue]);

    return (
        <form
            onSubmit={handleSubmit(onValid)}
            className="h-full w-full flex items-center justify-center space-x-4  overflow-hidden"
        >
            <div className="h-full aspect-square overflow-hidden">
                <div
                    {...getRootProps()}
                    className="relative w-full h-full flex items-center justify-center"
                >
                    <input
                        {...getInputProps()}
                        {...register("image")}
                        type="file"
                        onChange={imgload}
                    />
                    {album || imagExist ? (
                        <Image
                            src={
                                album ? album.imagePath! : newUrl || noImagePath
                            }
                            className="object-fill"
                            layout="fill"
                            alt=""
                        />
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <svg
                                aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
                                color="#262626"
                                fill="#262626"
                                height="77"
                                role="img"
                                viewBox="0 0 97.6 77.3"
                                width="96"
                            >
                                <path
                                    d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                                    fill="currentColor"
                                ></path>
                                <path
                                    d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                                    fill="currentColor"
                                ></path>
                                <path
                                    d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                                    fill="currentColor"
                                ></path>
                            </svg>

                            <div className="select-none">사진을 넣어주세요</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 space-y-4 flex flex-col self-start">
                <div className="space-y-2">
                    <Input
                        type="text"
                        id="title"
                        register={register("title", {
                            required: true,
                        })}
                        label="제목"
                    />
                </div>

                <div className="space-y-2">
                    <Input
                        type="content"
                        id="descrption"
                        register={register("description")}
                        required={false}
                        label="설명"
                    />
                </div>
                <div className="space-y-2">
                    <Input
                        type="password"
                        id="password"
                        register={register("password")}
                        required={false}
                        label="비밀번호"
                    />
                </div>
                <input
                    type="submit"
                    className="w-1/6 m-auto text-center p-2 bg-black text-white rounded-md cursor-pointer"
                    value="저장"
                />
            </div>
        </form>
    );
};

export default AlbumForm;
