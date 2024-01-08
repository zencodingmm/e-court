/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';

import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { OnChangeEvent } from '../../../../types/ecourt';

const Login = () => {
    const router = useRouter();
    const [isCardLogin, setIsCardLoign] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        user_code: ''
    });
    const [isError, setIsError] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const { data, status } = useSession();

    const onChangeHandler = (e: OnChangeEvent) => {
        setIsError(false);
        setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const loginHandler = async () => {
        try {
            const result = await signIn('credentials', {
                username: formData.username,
                password: formData.password,
                user_code: formData.user_code,
                redirect: false
            });

            if (result?.ok === false) {
                setIsError(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            if (data?.user.type && data?.user.type === 'admin') {
                router.replace('/admin');
            }

            if (data?.user.type && data?.user.type !== 'admin') {
                router.replace('/');
            }
        }
    }, [data, status]);

    return (
        <div className='h-screen flex-1 flex justify-content-center align-items-center'>
            <div className='card col-10 md:col-7 lg:col-4'>
                <h1 className='text-3xl mb-5'>Login</h1>

                <div className='p-fluid'>
                    {isCardLogin && (
                        <div className='field'>
                            <label>User Code</label>
                            <InputText
                                type='password'
                                onChange={e => setFormData(prevState => ({ ...prevState, user_code: e.target.value }))}
                            />
                        </div>
                    )}

                    {!isCardLogin && (
                        <div className='field'>
                            <label htmlFor='username'>Username</label>
                            <InputText
                                value={formData.username}
                                id='username'
                                name='username'
                                onChange={onChangeHandler}
                                className={isError ? 'p-invalid' : ''}
                            />
                        </div>
                    )}

                    {!isCardLogin && (
                        <div className='field'>
                            <label htmlFor='password'>Password</label>
                            <div className='p-inputgroup'>
                                <InputText
                                    value={formData.password}
                                    id='password'
                                    name='password'
                                    type={!isShowPassword ? 'password' : 'text'}
                                    onChange={onChangeHandler}
                                    className={isError ? 'p-invalid' : ''}
                                />
                                <Button
                                    icon={!isShowPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}
                                    severity='secondary'
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                />
                            </div>
                        </div>
                    )}

                    <Button
                        label='Login'
                        className='text-lg mt-3'
                        onClick={() => loginHandler()}
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
