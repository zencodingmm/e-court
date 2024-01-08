'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';

import Image from 'next/image';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

import { OnChangeEvent, User, UserType } from '../../../../../types/ecourt';
import axiosInstance from '../../../../../utils/axiosInstance';

const UpdateById = () => {
    const router = useRouter();
    const { id } = useParams();

    const [userData, setUserData] = useState<User>({
        user_code: '',
        username: '',
        password: '',
        user_rank: '',
        locked: false,
        user_type_id: undefined,
        type: '',
        description: '',
        user_image: null
    });
    const [userTypeData, setUserTypeData] = useState<UserType[] | []>([]);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const dropdownValue = userTypeData.find(value => value.user_type_id === userData.user_type_id);
    const toastRef = useRef<Toast>(null);

    const restoreDefaultState = () => {
        setUserData({
            user_code: '',
            username: '',
            password: '',
            user_rank: '',
            locked: false,
            user_type_id: undefined,
            type: '',
            description: '',
            user_image: null
        });
    };

    const onChangeHandler = (e: OnChangeEvent) => {
        setUserData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(`/api/user/${id}`, userData, { headers: { 'Content-Type': 'multipart/form-data' } });
            const { message } = response.data;

            if (response.status === 200) {
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
                restoreDefaultState();
                router.back();
            }
        } catch (error: any) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response.data.error,
                life: 3000
            });
        }
    };

    const fetchUserTypeData = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/user_type');
            const { data } = response.data;

            if (response.status === 200) {
                setUserTypeData(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchUserTypeData().catch(error => console.log(error));
    }, [fetchUserTypeData]);

    const fetchUser = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/user/search?id=${id}`);
            const { data } = response.data;

            if (response.status === 200) {
                setUserData({ ...data, password: '' });
            }
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    useEffect(() => {
        fetchUser().catch(error => console.log(error));
    }, [fetchUser]);

    const profileTemplate = () => {
        if (userData?.user_image === undefined || userData?.user_image === null) {
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

        if (userData.user_image?.objectURL) {
            return (
                <Image
                    src={userData.user_image.objectURL}
                    alt='user profile'
                    style={{ objectFit: 'cover' }}
                    className='w-full h-full'
                    width={1920}
                    height={1080}
                    priority={true}
                />
            );
        }

        if (typeof userData.user_image === 'string') {
            return (
                <Image
                    src={`${process.env.NEXT_PUBLIC_USERS_URL}/${userData.user_image}`}
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
            <Toast ref={toastRef} />

            <div className='flex align-items-center gap-5 mb-6'>
                <Button
                    icon='pi pi-fw pi-arrow-left'
                    rounded
                    onClick={() => router.back()}
                />
                <h1 className='text-2xl mb-5 underline'>အသုံးပြုသူများပြင်ဆင်ရန်</h1>
            </div>

            <div className='card'>
                <form
                    className='p-fluid formgrid grid'
                    onSubmit={onSubmitHandler}
                >
                    <div className='field col-12 flex flex-column align-items-center'>
                        <div className='w-10rem h-10rem border-3 border-circle overflow-hidden relative my-3'>{profileTemplate()}</div>

                        <div>
                            <FileUpload
                                mode='basic'
                                onSelect={e => setUserData(prevState => ({ ...prevState, user_image: e.files[0] }) as User)}
                                uploadOptions={{ style: { display: 'none' } }}
                            />
                        </div>
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='user_code'>User Code</label>
                        <InputText
                            value={userData.user_code}
                            name='user_code'
                            id='user_code'
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label>User Type</label>
                        <Dropdown
                            value={dropdownValue}
                            options={userTypeData}
                            optionLabel='type'
                            onChange={e => {
                                setUserData(prevState => ({
                                    ...prevState,
                                    user_type_id: e.value.user_type_id,
                                    type: e.value.type,
                                    description: e.value.description
                                }));
                            }}
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='username'>Username</label>
                        <InputText
                            value={userData.username}
                            name='username'
                            id='username'
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <label htmlFor='password'>Password</label>
                        <div className='p-inputgroup'>
                            <InputText
                                value={userData.password}
                                name='password'
                                id='password'
                                onChange={onChangeHandler}
                                type={showPassword ? 'text' : 'password'}
                            />
                            <Button
                                type='button'
                                icon={showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}
                                severity='secondary'
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                    </div>

                    <div className='field col-12'>
                        <label>User Rank</label>
                        <InputText
                            value={userData.user_rank}
                            name='user_rank'
                            id='user_rank'
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='col-12 flex align-items-center gap-3 mt-3'>
                        <Checkbox
                            checked={userData.locked}
                            id='locked'
                            name='locked'
                            onChange={e =>
                                setUserData(prevState => ({
                                    ...prevState,
                                    locked: e.target.checked as boolean
                                }))
                            }
                        />
                        <label>Locked</label>
                    </div>

                    <div className='col-12 mt-3 flex justify-content-end align-items-center'>
                        <Button
                            type='submit'
                            label='Submit'
                            className='w-auto'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateById;
