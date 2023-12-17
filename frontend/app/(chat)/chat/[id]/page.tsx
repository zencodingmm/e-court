'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Avatar } from 'primereact/avatar';
import { useParams } from 'next/navigation';
import { Badge } from 'primereact/badge';

const ChatById = () => {
    const { id } = useParams();

    const users = [
        { username: 'maung maung', id: 1, active: true },
        { username: 'aung aung', id: 2, active: true },
        { username: 'zaw zaw', id: 3, active: false },
        { username: 'kyaw kyaw', id: 4, active: false },
        { username: 'Hla Hla', id: 5, active: true },
        { username: 'Mya Mya', id: 6, active: false }
    ];

    const findUser = users.find(user => user.id === Number(id));

    return (
        <div className='w-full cus-h-screen bg-gray-100 border-round-2xl shadow-1 overflow-hidden'>
            <div className='w-full h-5rem bg-gray-300 flex justify-content-start align-items-center px-5'>
                <div className='flex column-gap-4 align-items-center'>
                    <Avatar
                        label={findUser?.username.charAt(0).toUpperCase()}
                        size='large'
                        className='bg-indigo-600 text-white p-overlay-badge'
                        shape='circle'
                    >
                        <Badge
                            className='p-small-badge'
                            severity='success'
                        ></Badge>
                    </Avatar>
                    <span className='text-lg text-900'>{findUser?.username}</span>
                </div>
            </div>
            <div className='w-full relative bg-gray-100 chat-box'></div>

            <form className='w-full h-10rem bg-gray-100 relative'>
                <div className='w-full absolute bottom-0 left-0 mb-5 flex column-gap-4 align-items-end px-5'>
                    <InputTextarea
                        autoResize
                        className='col-10'
                        style={{ maxHeight: '100px' }}
                    />
                    <Button
                        type='button'
                        icon='pi pi-fw pi-link'
                        rounded
                        severity='info'
                    />
                    <Button
                        type='submit'
                        icon='pi pi-fw pi-arrow-up'
                        rounded
                    />
                </div>
            </form>
        </div>
    );
};

export default ChatById;
