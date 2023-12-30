'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

const Login = () => {
    const router = useRouter();
    const [isCardLogin, setIsCardLoign] = useState(false);

    return (
        <div className='h-screen flex-1 flex justify-content-center align-items-center'>
            <div className='card col-10 md:col-7 lg:col-4'>
                <h1 className='text-3xl mb-5'>Login</h1>

                <div className='p-fluid'>
                    {isCardLogin && (
                        <div className='field'>
                            <label>User Code</label>
                            <InputText type='password' />
                        </div>
                    )}

                    {!isCardLogin && (
                        <div className='field'>
                            <label>Username</label>
                            <InputText />
                        </div>
                    )}

                    {!isCardLogin && (
                        <div className='field'>
                            <label>Password</label>
                            <InputText />
                        </div>
                    )}

                    <Button
                        label='Login'
                        className='text-lg mt-3'
                        onClick={() => router.push('/')}
                    />
                </div>

                <Divider
                    align='center'
                    className='my-6'
                    style={{ height: 1, background: '#000' }}
                >
                    <b>OR</b>
                </Divider>

                <a
                    className='flex-1 text-lg flex gap-3 justify-content-center align-items-center cursor-pointer'
                    onClick={() => setIsCardLoign(!isCardLogin)}
                >
                    <i className='pi pi-id-card text-3xl'></i>
                    {!isCardLogin && <span>Login in with RFID/NFC Card</span>}
                    {isCardLogin && <span>Login in with username and password</span>}
                </a>
            </div>
        </div>
    );
};

export default Login;
