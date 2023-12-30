'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { OnChangeEvent, User, UserType } from '../../../../../types/ecourt';
import axiosInstance from '../../../../../utils/axiosInstance';

const UpdateById = () => {
    const router = useRouter();
    const { id } = useParams();

    const [userData, setUserData] = useState<User>({
        user_code: '',
        user_name: '',
        user_rank: '',
        locked: false,
        user_type_id: undefined,
        type: '',
        description: ''
    });
    const [userTypeData, setUserTypeData] = useState<UserType[] | []>([]);

    const dropdownValue = userTypeData.find(value => value.user_type_id === userData.user_type_id);
    const toastRef = useRef<Toast>(null);

    const restoreDefaultState = () => {
        setUserData({
            user_code: '',
            user_name: '',
            user_rank: '',
            locked: false,
            user_type_id: undefined,
            type: '',
            description: ''
        });
    };

    const onChangeHandler = (e: OnChangeEvent) => {
        setUserData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(`/api/user/${id}`, userData);
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
                setUserData(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    useEffect(() => {
        fetchUser().catch(error => console.log(error));
    }, [fetchUser]);

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
                        <label htmlFor='user_name'>Username</label>
                        <InputText
                            value={userData.user_name}
                            name='user_name'
                            id='user_name'
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
                            label='Update'
                            className='w-auto'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateById;