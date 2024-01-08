'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { useSession } from 'next-auth/react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';

import { OnChangeEvent, User } from '../../../../types/ecourt';
import axiosInstance from '../../../../utils/axiosInstance';
import { Checkbox } from 'primereact/checkbox';

const Profile = () => {
    const { data: session } = useSession();
    const [user, setUser] = useState<User | undefined>({
        user_code: '',
        username: '',
        password: '',
        user_rank: '',
        locked: false,
        user_type_id: undefined,
        type: '',
        description: ''
    });
    const [password, setPassword] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);

    const fileuploadRef = useRef<FileUpload>(null);

    const onChangeHandler = (e: OnChangeEvent) => {
        setUser(prevState => ({ ...prevState, [e.target.name]: e.target.value }) as User);
    };

    const fetchData = useCallback(async () => {
        try {
            if (session) {
                const response = await axiosInstance.get(`/api/user/search?user_code=${session?.user.user_code}`);
                const { data } = response.data;

                if (response.status === 200) {
                    setUser(data);
                }
            }
        } catch (error) {}
    }, [session]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    const profileTemplate = () => {
        if (user?.user_image === undefined || user?.user_image === null) {
            return (
                <Image
                    src='/assets/images/user-profile.jpg'
                    alt='user profile'
                    style={{ objectFit: 'cover' }}
                    className='w-full h-full'
                    width={1920}
                    height={1080}
                    priority={true}
                />
            );
        }

        if (user.user_image?.objectURL) {
            return (
                <Image
                    src={user.user_image.objectURL}
                    alt='user profile'
                    style={{ objectFit: 'cover' }}
                    className='w-full h-full'
                    width={1920}
                    height={1080}
                    priority={true}
                />
            );
        }

        if (typeof user.user_image === 'string') {
            return (
                <Image
                    src={`${process.env.NEXT_PUBLIC_USERS_URL}/${user.user_image}`}
                    alt='user profile'
                    style={{ objectFit: 'cover' }}
                    className='w-full h-full'
                    width={1920}
                    height={1080}
                    priority={true}
                />
            );
        }
    };

    return (
        <div>
            <h1 className='text-2xl underline mb-6'>Profile</h1>
            <div className='card flex flex-column align-items-center'>
                <div className='field col-12 flex flex-column align-items-center'>
                    <div className='w-10rem h-10rem border-3 border-circle overflow-hidden relative my-3'>{profileTemplate()}</div>

                    {/* <div>
                        <FileUpload
                            ref={fileuploadRef}
                            mode='basic'
                            onSelect={e => setUser(prevState => ({ ...prevState, user_image: e.files[0] }) as User)}
                            uploadOptions={{ style: { display: 'none' } }}
                        />
                    </div> */}
                </div>

                <div className='col-7 p-fluid formgrid grid my-5'>
                    <div className='field col-12'>
                        <label htmlFor='user_code'>User Code</label>
                        <InputText
                            value={user?.user_code}
                            id='user_code'
                            name='user_code'
                            onChange={onChangeHandler}
                            readOnly
                        />
                    </div>

                    <div className='field col-12'>
                        <label htmlFor='username'>Username</label>
                        <InputText
                            value={user?.username}
                            id='username'
                            name='username'
                            onChange={onChangeHandler}
                            readOnly
                        />
                    </div>

                    {isChangePassword && (
                        <div className='field col-12'>
                            <label htmlFor='old_password'>Old Password</label>
                            <InputText
                                type={!isShowPassword ? 'password' : 'text'}
                                value={password?.old_password}
                                id='old_password'
                                name='old_password'
                                onChange={onChangeHandler}
                            />
                        </div>
                    )}

                    {isChangePassword && (
                        <div className='field col-12'>
                            <label htmlFor='new_password'>New Password</label>
                            <InputText
                                type={!isShowPassword ? 'password' : 'text'}
                                value={password?.new_password}
                                id='new_password'
                                name='new_password'
                                onChange={onChangeHandler}
                            />
                        </div>
                    )}

                    {isChangePassword && (
                        <div className='field col-12'>
                            <label htmlFor='confirm_password'>Confirm New Password</label>
                            <InputText
                                type={!isShowPassword ? 'password' : 'text'}
                                value={password?.confirm_password}
                                id='confirm_password'
                                name='confirm_password'
                                onChange={onChangeHandler}
                            />
                        </div>
                    )}

                    {isChangePassword && (
                        <div className='col-12 flex align-items-center gap-3 my-3'>
                            <Checkbox
                                checked={isShowPassword}
                                onChange={e => setIsShowPassword(e.target.checked as boolean)}
                            />
                            <label>Show Password</label>
                        </div>
                    )}

                    {/* <div className='field col-12 flex justify-content-center gap-5'>
                        <Button
                            label='Change Password'
                            className='w-auto'
                            onClick={() => setIsChangePassword(!isChangePassword)}
                        />
                        <Button
                            label='Save'
                            className='w-auto'
                        />
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
