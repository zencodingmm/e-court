'use client';

import React, { useState } from 'react';

import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const cases = [
    {
        id: '1',
        desc: 'Id cupidatat excepteur dolore ut duis consectetur officia amet pariatur cillum ex labore laboris aliquip. Duis Lorem quis dolore eu reprehenderit excepteur consectetur eiusmod minim commodo magna. Cillum adipisicing ullamco nulla officia culpa. Sit culpa ex id in dolor ad sit elit et tempor aliqua. Proident dolor laboris duis esse amet exercitation. Qui ut reprehenderit cupidatat laborum adipisicing reprehenderit. Qui tempor anim nulla aliquip Lorem adipisicing culpa veniam irure amet aliqua nulla.Id cupidatat excepteur dolore ut duis consectetur officia amet pariatur cillum ex labore laboris aliquip. Duis Lorem quis dolore eu reprehenderit excepteur consectetur eiusmod minim commodo magna. Cillum adipisicing ullamco nulla officia culpa. Sit culpa ex id in dolor ad sit elit et tempor aliqua. Proident dolor laboris duis esse amet exercitation. Qui ut reprehenderit cupidatat laborum adipisicing reprehenderit. Qui tempor anim nulla aliquip Lorem adipisicing culpa veniam irure amet aliqua nulla.',
        created_at: new Date()
    },
    {
        id: '2',
        desc: 'Id cupidatat excepteur dolore ut duis consectetur officia amet pariatur cillum ex labore laboris aliquip. Duis Lorem quis dolore eu reprehenderit excepteur consectetur eiusmod minim commodo magna. Cillum adipisicing ullamco nulla officia culpa. Sit culpa ex id in dolor ad sit elit et tempor aliqua. Proident dolor laboris duis esse amet exercitation. Qui ut reprehenderit cupidatat laborum adipisicing reprehenderit. Qui tempor anim nulla aliquip Lorem adipisicing culpa veniam irure amet aliqua nulla.Id cupidatat excepteur dolore ut duis consectetur officia amet pariatur cillum ex labore laboris aliquip. Duis Lorem quis dolore eu reprehenderit excepteur consectetur eiusmod minim commodo magna. Cillum adipisicing ullamco nulla officia culpa. Sit culpa ex id in dolor ad sit elit et tempor aliqua. Proident dolor laboris duis esse amet exercitation. Qui ut reprehenderit cupidatat laborum adipisicing reprehenderit. Qui tempor anim nulla aliquip Lorem adipisicing culpa veniam irure amet aliqua nulla.',
        created_at: new Date()
    },
    {
        id: '3',
        desc: 'Id cupidatat excepteur dolore ut duis consectetur officia amet pariatur cillum ex labore laboris aliquip. Duis Lorem quis dolore eu reprehenderit excepteur consectetur eiusmod minim commodo magna. Cillum adipisicing ullamco nulla officia culpa. Sit culpa ex id in dolor ad sit elit et tempor aliqua. Proident dolor laboris duis esse amet exercitation. Qui ut reprehenderit cupidatat laborum adipisicing reprehenderit. Qui tempor anim nulla aliquip Lorem adipisicing culpa veniam irure amet aliqua nulla.Id cupidatat excepteur dolore ut duis consectetur officia amet pariatur cillum ex labore laboris aliquip. Duis Lorem quis dolore eu reprehenderit excepteur consectetur eiusmod minim commodo magna. Cillum adipisicing ullamco nulla officia culpa. Sit culpa ex id in dolor ad sit elit et tempor aliqua. Proident dolor laboris duis esse amet exercitation. Qui ut reprehenderit cupidatat laborum adipisicing reprehenderit. Qui tempor anim nulla aliquip Lorem adipisicing culpa veniam irure amet aliqua nulla.',
        created_at: new Date()
    },
    {
        id: '4',
        desc: 'Id cupidatat excepteur dolore ut duis consectetur officia amet pariatur cillum ex labore laboris aliquip. Duis Lorem quis dolore eu reprehenderit excepteur consectetur eiusmod minim commodo magna. Cillum adipisicing ullamco nulla officia culpa. Sit culpa ex id in dolor ad sit elit et tempor aliqua. Proident dolor laboris duis esse amet exercitation. Qui ut reprehenderit cupidatat laborum adipisicing reprehenderit. Qui tempor anim nulla aliquip Lorem adipisicing culpa veniam irure amet aliqua nulla.Id cupidatat excepteur dolore ut duis consectetur officia amet pariatur cillum ex labore laboris aliquip. Duis Lorem quis dolore eu reprehenderit excepteur consectetur eiusmod minim commodo magna. Cillum adipisicing ullamco nulla officia culpa. Sit culpa ex id in dolor ad sit elit et tempor aliqua. Proident dolor laboris duis esse amet exercitation. Qui ut reprehenderit cupidatat laborum adipisicing reprehenderit. Qui tempor anim nulla aliquip Lorem adipisicing culpa veniam irure amet aliqua nulla.',
        created_at: new Date()
    }
];

const casePdfs = [
    {
        id: 1,
        name: 'case-1.pdf'
    },
    {
        id: 2,
        name: 'case-2.pdf'
    },
    {
        id: 3,
        name: 'case-3.pdf'
    },
    {
        id: 4,
        name: 'case-4.pdf'
    }
];

const caseImages = [
    { id: 1, name: '/assets/images/case-images/ff_x_t3_002-791416377.JPG' },
    { id: 2, name: '/assets/images/case-images/Nikon-200-500mm-sample-img4-185133429.jpg' },
    { id: 3, name: '/assets/images/case-images/Nikon-D5500-sample-images-2-1088992695.jpg' },
    { id: 4, name: '/assets/images/case-images/sample-5-3357837222.jpg' }
];

const caseVideos = [
    { id: 1, name: '/assets/videos/sample.mp4' },
    { id: 2, name: '/assets/videos/sample.mp4' },
    { id: 3, name: '/assets/videos/sample.mp4' }
];

interface DialogData {
    type: 'video' | 'image' | 'pdf';
    filename: string;
}

const CaseById = () => {
    const router = useRouter();
    const { id } = useParams();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<DialogData>();

    const foundCase = cases.find(value => value.id === id);

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
                    {dialogData?.type === 'video' && (
                        <video
                            className='w-full h-full'
                            autoPlay={true}
                            controls
                        >
                            <source src='/assets/videos/sample.mp4' />
                        </video>
                    )}

                    {dialogData?.type === 'image' && (
                        <Image
                            src={dialogData.filename}
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
                            တင်သွင်းလွှာအမှတ် : <span className='font-normal'>{foundCase?.id}</span>
                        </div>

                        {foundCase?.created_at && (
                            <div className='text-lg text-800 font-bold border-bottom-1 md:border-bottom-none pb-3 md:pb-0'>
                                တင်သွင်းသည့်ရက်စွဲ : <span className='font-normal'>{new Date(foundCase?.created_at).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <div className='my-5'>
                        <div className='text-lg text-800 font-bold md:my-3 border-bottom-1 md:border-bottom-none pb-3 md:pb-0'>
                            တင်သွင်းသည့်ပုဂ္ဂိုလ် : <span className='font-normal text-lg'>maung maung</span>
                        </div>
                    </div>

                    <div className='my-5'>
                        <div className='text-lg text-800 font-bold my-3 border-bottom-1 pb-3'>တင်သွင်းသည့်အကြောင်းအရာ</div>

                        <span className='font-normal'>{foundCase?.desc}</span>
                    </div>

                    <div className='my-5'>
                        <div className='text-lg text-800 font-bold my-3 border-bottom-1 pb-3'>ခုံရုံး၏အနက်အဓိပ္ပာယ်ဖွင့်ဆိုလိုသည့်အကြောင်း</div>

                        <span className='font-normal'>ထည့်သွင်းထားခြင်းမရှိပါ။</span>
                    </div>

                    <div className='md:my-5 md:border-bottom-1 md:pb-3 md:flex justify-content-between'>
                        <div className='text-lg text-800 font-bold border-bottom-1 md:border-bottom-none pb-3 md:pb-0 my-5 md:my-0'>
                            တင်သွင်းလွှာတင်သွင်းသည့်နေ့ : <span className='font-normal'>{new Date().toLocaleDateString()}</span>
                        </div>

                        <div className='text-lg text-800 font-bold border-bottom-1 md:border-bottom-none pb-3 md:pb-0 my-5 md:my-0'>
                            အပြီးသတ်ဆုံးဖြတ်သည့်နေ့ : <span className='font-normal'>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className='my-5'>
                        <div className='text-lg text-800 font-bold my-3 border-bottom-1 pb-3'>မည်သို့ဆုံးဖြတ်သည်</div>

                        <span className='font-normal'>{foundCase?.desc}</span>
                    </div>
                </div>

                <div className='col-12 bg-gray-50 border-round-2xl px-5 shadow-2 border-1'>
                    <h1 className='text-xl my-4 font-bold border-bottom-1 pb-5 text-center'>အမှုသွား/အမှုလာမှတ်တမ်းများ</h1>
                    <div className='col-12 my-5 border-bottom-1'>
                        <h4 className='text-lg'>PDF Documents</h4>

                        <div className='flex-1 grid my-5'>
                            {casePdfs.map(item => (
                                <div
                                    className='col-12 md:col-4'
                                    key={item.id}
                                >
                                    <div className='bg-white p-card p-5 shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'>
                                        <i className='pi pi-fw pi-file-pdf text-2xl text-red-800'></i>
                                        <span className='ml-2 text-lg text-800'>{item.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='col-12 my-5 border-bottom-1'>
                        <h4 className='text-lg'>Images</h4>

                        <div className='flex-1 grid my-5'>
                            {caseImages.map(item => (
                                <div
                                    className='col-12 md:col-4'
                                    key={item.id}
                                >
                                    <div
                                        className='p-2 bg-white p-card shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'
                                        onClick={() => {
                                            setDialogData({ type: 'image', filename: item.name });
                                            setIsVisible(true);
                                        }}
                                    >
                                        <Image
                                            src={item.name}
                                            alt={item.name}
                                            className='w-full h-18rem border-round-lg'
                                            width={1920}
                                            height={1080}
                                            priority={true}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='col-12 my-5'>
                        <h4 className='text-lg'>Videos</h4>

                        <div className='flex-1 grid my-5'>
                            {caseVideos.map(item => (
                                <div
                                    className='col-12 md:col-4'
                                    key={item.id}
                                >
                                    <div
                                        className='bg-white p-card shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'
                                        onClick={() => {
                                            setDialogData({ type: 'video', filename: item.name });
                                            setIsVisible(true);
                                        }}
                                    >
                                        <video className='col-12'>
                                            <source src={item.name} />
                                        </video>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseById;
