import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const items = [
    { title: 'Lib', link: '/lib' },
    { title: 'Case Flow', link: '/case' },
    { title: 'Live Streaming', link: 'live-streaming' },
    { title: 'Other-1', link: 'other-1' },
    { title: 'Other-2', link: 'other-2' },
    { title: 'E-Vote', link: 'e-vote' }
];

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

const Dashboard = () => {
    return (
        <div className='card flex flex-column align-items-center'>
            <div className='border-3 border-circle overflow-hidden relative my-3'>
                <Image
                    src='/assets/images/user-profile.jpg'
                    alt='user profile'
                    style={{ objectFit: 'cover' }}
                    width={150}
                    height={150}
                    priority={true}
                />
                <div
                    className='absolute bg-gray-700 bottom-0 w-full h-3rem text-white flex justify-content-center align-items-center hover:text-black hover:bg-gray-500 cursor-pointer'
                    style={{ zIndex: 100 }}
                >
                    <span className='pi pi-fw pi-pencil text-2xl'></span>
                </div>
            </div>

            <div className='w-full flex flex-column justify-content-center align-items-center gap-3 my-4'>
                <span className='font-bold text-xl'>
                    No : <span className='font-medium'>123</span>
                </span>
                <span className='font-bold text-xl'>အဖွဲ့ဝင် - ၁</span>
            </div>

            <div className='w-full grid border-top-2 border-bottom-2 py-5 lg:px-5'>
                {items.map(item => (
                    <div
                        className='col-4'
                        key={item.title}
                    >
                        <Link
                            href={item.link}
                            className='p-card p-5 cursor-pointer hover:surface-200 flex
                        justify-content-center align-items-center shadow-4'
                        >
                            <span className='text-lg text-center text-900 font-bold'>{item.title}</span>
                        </Link>
                    </div>
                ))}
            </div>

            <div className='flex-1 grid py-5 lg:px-5'>
                {cases.map(value => (
                    <div
                        className='col-6'
                        key={value.id}
                    >
                        <Link
                            className='block p-card p-5 cursor-pointer hover:surface-200 shadow-4'
                            href={`/case/${value.id}`}
                        >
                            <h1
                                className='text-xl font-bold border-bottom-1 pb-2'
                                style={{ borderBottomStyle: 'dashed' }}
                            >
                                <span className='pi pi-fw pi-book'></span> Case No : <span>{value.id}</span>
                            </h1>
                            <p className='text-lg'>{value.desc}</p>
                            <span className='text-gray-600'>{new Date(value.created_at).toLocaleDateString()}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
