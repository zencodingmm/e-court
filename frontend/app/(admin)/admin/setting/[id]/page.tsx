'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

import { OnChangeEvent, Setting } from '../../../../../types/ecourt';
import axiosInstance from '../../../../../utils/axiosInstance';

const SettingByID = () => {
    const router = useRouter();
    const { id } = useParams();
    const [formData, setFormData] = useState<Setting>({
        live_streaming_link: '',
        e_lib_link: '',
        case_flow_link: '',
        other_1: '',
        other_2: '',
        current: false
    });
    const toastRef = useRef<Toast>(null);

    const onChangeHandler = (e: OnChangeEvent) => {
        setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(`/api/setting/${id}`, formData);
            const { message } = response.data;

            if (response.status === 201) {
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
                setFormData({
                    live_streaming_link: '',
                    e_lib_link: '',
                    case_flow_link: '',
                    other_1: '',
                    other_2: '',
                    current: false
                });
                router.back();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/setting/search?setting_id=${id}`);
            const { data } = response.data;

            if (response.status === 200) {
                setFormData(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    return (
        <div>
            <Toast ref={toastRef} />

            <div className='col flex align-items-center gap-4'>
                <Button
                    icon='pi pi-fw pi-arrow-left'
                    rounded
                    onClick={() => router.back()}
                />
                <h1 className='text-2xl underline mb-5'>Setting</h1>
            </div>

            <form
                className='card'
                onSubmit={onSubmitHandler}
            >
                <div className='col-12'>
                    <label
                        className='text-lg font-semibold block mb-3'
                        htmlFor='live_streaming_link'
                    >
                        Live Streaming Link (ထည့်ရန်)
                    </label>
                    <div>
                        <InputTextarea
                            id='live_streaming_link'
                            name='live_streaming_link'
                            className='col-12'
                            autoResize
                            style={{ maxHeight: '10rem' }}
                            value={formData.live_streaming_link}
                            onChange={onChangeHandler}
                        />
                    </div>
                </div>

                <hr />

                <div className='col-12 flex flex-column gap-4'>
                    <h1 className='text-lg'>Button Link ( Dashboard အတွက် ခလုတ်များထည့်သွင်းရန် )</h1>
                    <div className='p-inputgroup flex-1'>
                        <label
                            className='p-inputgroup-addon col md:col-2'
                            htmlFor='e_lib_link'
                        >
                            E-Lib Link
                        </label>
                        <InputText
                            id='e_lib_link'
                            name='e_lib_link'
                            value={formData.e_lib_link}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label
                            className='p-inputgroup-addon col md:col-2'
                            htmlFor='case_flow_link'
                        >
                            Case Flow Link
                        </label>
                        <InputText
                            id='case_flow_link'
                            name='case_flow_link'
                            value={formData.case_flow_link}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label
                            className='p-inputgroup-addon col md:col-2'
                            htmlFor='other_1'
                        >
                            Other Link (1)
                        </label>
                        <InputText
                            id='other_1'
                            name='other_1'
                            value={formData.other_1}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label
                            className='p-inputgroup-addon col md:col-2'
                            htmlFor='other_2'
                        >
                            Other Link (2)
                        </label>
                        <InputText
                            id='other_2'
                            name='other_2'
                            value={formData.other_2}
                            onChange={onChangeHandler}
                        />
                    </div>
                </div>

                <div className='col-12 flex justify-content-end gap-3'>
                    <Button
                        type='button'
                        label='Cancel'
                        severity='danger'
                        onClick={() => router.back()}
                    />
                    <Button
                        label='Update'
                        type='submit'
                    />
                </div>
            </form>
        </div>
    );
};

export default SettingByID;
