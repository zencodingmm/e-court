'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import { Dialog } from 'primereact/dialog';

const cases = [
    {
        id: '1',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date()
    },
    {
        id: '2',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date()
    },
    {
        id: '3',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date()
    },
    {
        id: '4',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
    const { id } = useParams();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<DialogData>();

    const findedCase = cases.find(value => value.id === id);

    console.log(id);

    return (
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
            <div className='w-full border-bottom-2'>
                <div className='w-full flex justify-content-between'>
                    <div className='text-xl text-800 font-bold'>
                        Case No : <span className='font-normal text-lg'>{findedCase?.id}</span>
                    </div>

                    {findedCase?.created_at && (
                        <div className='text-xl text-800 font-bold'>
                            Date : <span className='font-normal text-lg'>{new Date(findedCase?.created_at).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                <div className='my-5'>
                    <div className='text-xl text-800 font-bold my-3'>
                        Desc : <span className='font-normal text-lg'>{findedCase?.desc}</span>
                    </div>
                </div>
            </div>

            <div className='w-full my-5 border-bottom-2'>
                <h4 className='text-xl font-bold'>PDF Documents</h4>

                <div className='w-full grid gap-5 my-5'>
                    {casePdfs.map(item => (
                        <div
                            className='col-12 md:col-3 bg-gray-200 p-card p-5 shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'
                            key={item.id}
                        >
                            <i className='pi pi-fw pi-file-pdf text-2xl text-red-800'></i>
                            <span className='ml-2 text-lg text-800'>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full my-5 border-bottom-2'>
                <h4 className='text-xl font-bold'>Images</h4>

                <div className='w-full grid gap-5 my-5'>
                    {caseImages.map(item => (
                        <div
                            className='col-12 md:col-5 lg:col-3 bg-gray-200 p-card shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'
                            key={item.id}
                            onClick={() => {
                                setDialogData({ type: 'image', filename: item.name });
                                setIsVisible(true);
                            }}
                        >
                            <Image
                                src={item.name}
                                alt={item.name}
                                className='w-full h-15rem md:h-10rem border-round-lg'
                                width={1920}
                                height={1080}
                                priority={true}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full my-5 border-bottom-2'>
                <h4 className='text-xl font-bold'>Videos</h4>

                <div className='w-full grid gap-5 my-5'>
                    {caseVideos.map(item => (
                        <div
                            className='col-12 md:col-5 bg-gray-200 p-card shadow-1 flex align-items-center hover:bg-gray-100 cursor-pointer hover:text-blue-500 hover:shadow-4'
                            key={item.id}
                            onClick={() => {
                                setDialogData({ type: 'video', filename: item.name });
                                setIsVisible(true);
                            }}
                        >
                            <video className='w-full'>
                                <source src={item.name} />
                            </video>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CaseById;
