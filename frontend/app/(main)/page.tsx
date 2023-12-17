import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const items = [
    { title: 'Lib', link: '/lib' },
    { title: 'Case Flow', link: '/case' },
    { title: 'Other', link: 'other' }
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

            <div className={`w-full grid ${cases.length > 1 ? 'justify-content-around' : 'justify-content-between'} gap-5 lg:gap-0 border-top-2 border-bottom-2 py-5 lg:px-5`}>
                {items.map(item => (
                    <Link
                        href={item.link}
                        className='col-12 md:col-5 lg:col-3 p-card p-5 cursor-pointer hover:surface-200 flex
                        justify-content-center align-items-center shadow-4'
                        key={item.title}
                    >
                        <span className='text-lg text-center text-900 font-bold'>{item.title}</span>
                    </Link>
                ))}
            </div>

            <div className={`w-full grid gap-5 ${cases.length > 1 && 'justify-content-around'} my-5 lg:px-5`}>
                {cases.map(value => (
                    <Link
                        href={`/case/${value.id}`}
                        className='col-12 md:col-5 p-card p-5 cursor-pointer hover:surface-200 shadow-4'
                        key={value.id}
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
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
