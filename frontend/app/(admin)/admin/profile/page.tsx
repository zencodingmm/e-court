'use client';

import React from 'react';

import Image from 'next/image';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Profile = () => {
    return (
        <div>
            <h1 className='text-2xl underline mb-6'>Profile</h1>
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

                <div className='flex-1 p-fluid formgrid grid my-5'>
                    <div className='field col-12'>
                        <label>Username</label>
                        <InputText />
                    </div>

                    <div className='field col-12'>
                        <label>Password</label>
                        <InputText />
                    </div>

                    <div className='field col-12 flex justify-content-center'>
                        <Button
                            label='Change'
                            className='w-auto'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
