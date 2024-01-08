'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useParams, usePathname } from 'next/navigation';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import axiosInstance from '../../../../../utils/axiosInstance';
import { EVote, OnChangeEvent } from '../../../../../types/ecourt';

const EVoteById = () => {
    const router = useRouter();
    const { id } = useParams();
    const pathname = usePathname();

    const [data, setData] = useState<EVote | undefined>();

    const toastRef = useRef<Toast>(null);

    const onChangeHandler = (e: OnChangeEvent) => {
        setData(prevState => (prevState ? { ...prevState, description: e.target.value } : prevState));
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`/api/e_vote/${id}`, data);

            if (response.status === 201) {
                fetchData().catch(error => console.log(error));
                router.back();
            }
        } catch (error: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.error });
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/e_vote/search?id=${id}`);
            const { data } = response.data;

            if (response.status === 200) {
                setData(data);
            }
        } catch (error) {}
    }, [id]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    return (
        <div>
            <div className='flex align-items-center gap-5 mb-6'>
                <Button
                    icon='pi pi-fw pi-arrow-left'
                    rounded
                    onClick={() => router.back()}
                />
                <h1 className='text-2xl mb-5 underline'>E-Vote ပြင်ဆင်ရန်</h1>
            </div>

            <div className='card'>
                <form
                    className='p-fluid formgrid grid'
                    onSubmit={onSubmitHandler}
                >
                    <div className='field col-12'>
                        <label>မဲပေးလိုသည့်အကြောင်းအရာ</label>
                        <InputTextarea
                            id='description'
                            name='description'
                            value={data?.description}
                            autoResize
                            style={{ maxHeight: '10rem', minHeight: '10rem' }}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>

                    <div className='flex-1 flex justify-content-end gap-3'>
                        <Button
                            type='button'
                            label='Attachment'
                            className='w-auto'
                            onClick={() => router.push(`${pathname}/attachment`)}
                        />
                        <Button
                            type='submit'
                            label='Update'
                            className='w-auto'
                        />

                        <Button
                            type='button'
                            label='Cancel'
                            severity='danger'
                            className='w-auto'
                            onClick={() => router.back()}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EVoteById;
