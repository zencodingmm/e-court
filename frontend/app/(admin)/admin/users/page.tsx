'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { OnChangeEvent, User, UserType } from '../../../../types/ecourt';
import axiosInstance from '../../../../utils/axiosInstance';

const Users = () => {
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
            const response = await axiosInstance.post('/api/user', userData);
            const { message } = response.data;

            if (response.status === 201) {
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
                restoreDefaultState();
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

    return (
        <div>
            <Toast ref={toastRef} />
            <h1 className='text-2xl underline mb-6'>အသုံးပြုသူများထည့်သွင်းရန်</h1>

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
                            label='Submit'
                            className='w-auto'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Users;
