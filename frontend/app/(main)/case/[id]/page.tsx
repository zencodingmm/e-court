'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { EDocAttachment, EDocument } from '../../../../types/ecourt';
import axiosInstance from '../../../../utils/axiosInstance';

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

const CaseById = () => {
    const router = useRouter();
    const { id } = useParams();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<DialogData>();
    const [cases, setCases] = useState<EDocument | undefined>();
    const [attachment, setAttachment] = useState<EDocAttachment[] | undefined>();

    const fetchCase = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/e_doc/search?case_id=${id}`);
            const { data } = response.data;

            if (response.status === 200) {
                setCases(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    useEffect(() => {
        fetchCase().catch(error => console.log(error));
    }, [fetchCase]);

    const fetchAttachment = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/attachment/search?case_id=${id}`);
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
            <Button
                icon='pi pi-arrow-left'
                className='mb-6'
                rounded
                onClick={() => router.back()}
            />
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
                <div className='w-full'>
                    <div className='w-full flex flex-column gap-4 md:gap-0 md:flex-row justify-content-between'>
                        <div className='text-lg text-800 font-bold border-bottom-1 md:border-bottom-none pb-3 md:pb-0'>
                            တင်သွင်းလွှာအမှတ် : <span className='font-normal'>{cases?.case_no}</span>
                        </div>

                        {cases?.created_at && (
                            <div className='text-lg text-800 font-bold border-bottom-1 md:border-bottom-none pb-3 md:pb-0'>
                                တင်သွင်းသည့်ရက်စွဲ : <span className='font-normal'>{cases?.date_of_submittion ? new Date(cases.date_of_submittion).toLocaleDateString() : 'ထည့်သွင်းထားခြင်းမရှိပါ။'}</span>
                            </div>
                        )}
                    </div>
                    <div className='my-5'>
                        <div className='text-lg text-800 font-bold md:my-3 border-bottom-1 md:border-bottom-none pb-3 md:pb-0'>
                            တင်သွင်းသည့်ပုဂ္ဂိုလ်/ဌာန/အဖွဲ့အစည်း : <span className='font-normal text-lg'>{cases?.submitting_person ? cases.submitting_person : 'ထည့်သွင်းထားခြင်းမရှိပါ။'}</span>
                        </div>
                    </div>

                    <div className='my-5'>
                        <div className='text-lg text-800 font-bold my-3 border-bottom-1 pb-3'>တင်သွင်းသည့်အကြောင်းအရာ</div>

                        {cases?.description_of_submittion && <span className='font-normal'>{cases?.description_of_submittion}</span>}

                        {!cases?.description_of_submittion && <span className='font-normal'>ထည့်သွင်းထားခြင်းမရှိပါ။</span>}
                    </div>

                    <div className='my-5'>
                        <div className='text-lg text-800 font-bold my-3 border-bottom-1 pb-3'>ခုံရုံး၏အနက်အဓိပ္ပာယ်ဖွင့်ဆိုလိုသည့်အကြောင်း</div>

                        {cases?.interpretation_of_tribunal && <span className='font-normal'>{cases?.interpretation_of_tribunal}</span>}

                        {!cases?.interpretation_of_tribunal && <span className='font-normal'>ထည့်သွင်းထားခြင်းမရှိပါ။</span>}
                    </div>

                    <div className='md:my-5 md:border-bottom-1 md:pb-3 md:flex justify-content-between'>
                        <div className='text-lg text-800 font-bold border-bottom-1 md:border-bottom-none pb-3 md:pb-0 my-5 md:my-0'>
                            တင်သွင်းလွှာတင်သွင်းသည့်နေ့ : <span className='font-normal'>{cases?.date_of_submission ? new Date(cases.date_of_submission).toLocaleDateString() : 'ထည့်သွင်းထားခြင်းမရှိပါ။'}</span>
                        </div>

                        <div className='text-lg text-800 font-bold border-bottom-1 md:border-bottom-none pb-3 md:pb-0 my-5 md:my-0'>
                            အပြီးသတ်ဆုံးဖြတ်သည့်နေ့ : <span className='font-normal'>{cases?.date_of_decision ? new Date(cases.date_of_decision).toLocaleDateString() : 'ထည့်သွင်းထားခြင်းမရှိပါ။'}</span>
                        </div>
                    </div>

                    <div className='my-5'>
                        <div className='text-lg text-800 font-bold my-3 border-bottom-1 pb-3'>မည်သို့ဆုံးဖြတ်သည်</div>

                        <span className='font-normal'>{cases?.decided}</span>

                        <span className='font-normal'>ထည့်သွင်းထားခြင်းမရှိပါ။</span>
                    </div>
                </div>
                <div className='col-12 bg-gray-50 border-round-2xl px-5 shadow-2 border-1'>
                    <h1 className='text-xl my-4 font-bold border-bottom-1 pb-5 text-center'>အမှုသွား/အမှုလာမှတ်တမ်းများ</h1>
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
                                                        url: `${process.env.NEXT_PUBLIC_CASES_URL}/${item.file_name}`
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
                                                            url: `${process.env.NEXT_PUBLIC_CASES_URL}/${item.file_name}`
                                                        });
                                                        setIsVisible(true);
                                                    }}
                                                >
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_CASES_URL}/${item.file_name}`}
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
                                                            url: `${process.env.NEXT_PUBLIC_CASES_URL}/${item.file_name}`
                                                        });
                                                        setIsVisible(true);
                                                    }}
                                                >
                                                    <video
                                                        src={`${process.env.NEXT_PUBLIC_CASES_URL}/${item.file_name}`}
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
        </div>
    );
};

export default CaseById;
