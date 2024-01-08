'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { EDocAttachment } from '../../../../../types/ecourt';
import axiosInstance from '../../../../../utils/axiosInstance';

interface DialogData {
    type: 'video' | 'image' | 'pdf';
    filename: string;
    url: string;
}

enum FileType {
    image = 'image',
    pdf = 'pdf',
    video = 'video'
}

const EVotingAttachment = () => {
    const router = useRouter();
    const { id } = useParams();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<DialogData>();
    const [attachment, setAttachment] = useState<EDocAttachment[] | undefined>();

    const fetchAttachment = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/e_vote_attachment/search?e_vote_id=${id}`);
            const { data } = response.data;

            if (response.status === 200) {
                setAttachment(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    useEffect(() => {
        fetchAttachment().catch(error => console.log(error));
    }, [fetchAttachment]);

    return (
        <div>
            <div className='col flex align-items-center gap-4'>
                <Button
                    icon='pi pi-fw pi-arrow-left'
                    rounded
                    onClick={() => router.back()}
                />
                <h1 className='text-xl underline mb-5'>E-Vote Attachments</h1>
            </div>

            <div
                className='card cus-h-screen overflow-y-scroll'
                style={{ scrollBehavior: 'smooth' }}
            >
                <Dialog
                    visible={isVisible}
                    onHide={() => setIsVisible(false)}
                    className='video-layout'
                    contentClassName='border-noround-top'
                    header={dialogData?.filename.split('/')[dialogData.filename.split('/').length - 1]}
                >
                    {dialogData?.type === 'pdf' && (
                        <iframe
                            src={dialogData.url}
                            className='w-full h-full'
                        />
                    )}

                    {dialogData?.type === 'video' && (
                        <video
                            src={dialogData.url}
                            className='w-full h-full'
                            autoPlay={true}
                            controls
                        />
                    )}

                    {dialogData?.type === 'image' && (
                        <Image
                            src={dialogData.url}
                            alt={dialogData.filename}
                            className='w-full'
                            width={1920}
                            height={1080}
                            priority
                        />
                    )}
                </Dialog>

                <div className='col-12 my-5 border-bottom-1'>
                    <h4 className='text-lg'>PDF Documents</h4>

                    <div className='flex-1 grid my-5'>
                        {attachment &&
                            attachment.map(
                                item =>
                                    item.file_type.includes(FileType.pdf) && (
                                        <div
                                            className='col-12 md:col-4'
                                            key={item.attachment_id}
                                            onClick={() => {
                                                setDialogData({
                                                    type: 'pdf',
                                                    filename: item.file_name.split('/')[1],
                                                    url: `${process.env.NEXT_PUBLIC_EVOTES_URL}/${item.file_name}`
                                                });
                                                setIsVisible(true);
                                            }}
                                        >
                                            <div className='bg-white p-card p-5 shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'>
                                                <i className='pi pi-fw pi-file-pdf text-2xl text-red-800'></i>
                                                <span className='text-lg text-800'>{item.file_name.split('/')[1].length > 10 ? `${item.file_name.split('/')[1].substring(0, 10)}...` : item.file_name.split('/')[1]}</span>
                                            </div>
                                        </div>
                                    )
                            )}
                    </div>
                </div>

                <div className='col-12 my-5 border-bottom-1'>
                    <h4 className='text-lg'>Images</h4>

                    <div className='flex-1 grid my-5'>
                        {attachment &&
                            attachment.map(
                                item =>
                                    item.file_type.includes(FileType.image) && (
                                        <div
                                            className='col-12 md:col-4'
                                            key={item.attachment_id}
                                        >
                                            <div
                                                className='p-2 h-18rem bg-white p-card shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'
                                                onClick={() => {
                                                    setDialogData({
                                                        type: 'image',
                                                        filename: item.file_name.split('/')[1],
                                                        url: `${process.env.NEXT_PUBLIC_EVOTES_URL}/${item.file_name}`
                                                    });
                                                    setIsVisible(true);
                                                }}
                                            >
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_EVOTES_URL}/${item.file_name}`}
                                                    alt={item.file_name}
                                                    className='w-full h-full border-round-lg'
                                                    width={1920}
                                                    height={1080}
                                                    priority={true}
                                                />
                                            </div>
                                        </div>
                                    )
                            )}
                    </div>
                </div>

                <div className='col-12 my-5'>
                    <h4 className='text-lg'>Videos</h4>

                    <div className='flex-1 grid my-5'>
                        {attachment &&
                            attachment.map(
                                item =>
                                    item.file_type.includes(FileType.video) && (
                                        <div
                                            className='col-12 md:col-4'
                                            key={item.attachment_id}
                                        >
                                            <div
                                                className='bg-white p-card shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'
                                                onClick={() => {
                                                    setDialogData({
                                                        type: 'video',
                                                        filename: item.file_name.split('/')[1],
                                                        url: `${process.env.NEXT_PUBLIC_EVOTES_URL}/${item.file_name}`
                                                    });
                                                    setIsVisible(true);
                                                }}
                                            >
                                                <video
                                                    src={`${process.env.NEXT_PUBLIC_EVOTES_URL}/${item.file_name}`}
                                                    className='col-12'
                                                />
                                            </div>
                                        </div>
                                    )
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EVotingAttachment;
