'use client';

import React, { useState, useRef } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import axiosInstance from '../../../../utils/axiosInstance';

import { EDocument, OnChangeEvent } from '../../../../types/ecourt';

const EDoc = () => {
    const router = useRouter();
    const pathname = usePathname();
    const toastRef = useRef<Toast>(null);

    const [formData, setFormData] = useState<EDocument>({
        case_no: '',
        date_of_submittion: new Date(),
        description_of_submittion: '',
        submitting_person: '',
        interpretation_of_tribunal: '',
        date_of_submission: undefined,
        date_of_decision: undefined,
        decided: '',
        current: false
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const onChangeHandler = (e: OnChangeEvent) => {
        setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onResetHander = () => {
        setFormData({
            case_no: '',
            date_of_submittion: new Date(),
            description_of_submittion: '',
            submitting_person: '',
            interpretation_of_tribunal: '',
            date_of_submission: undefined,
            date_of_decision: undefined,
            decided: '',
            current: false
        });
        setIsSubmitted(false);
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/e_doc', formData);
            const { message } = response.data;

            if (response.status === 201) {
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
                setIsSubmitted(true);
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

    const routeHandler = async () => {
        try {
            const response = await axiosInstance.get(`/api/e_doc/search?case_no=${formData.case_no}`);
            const { data } = response.data;

            if (response.status === 200) {
                router.push(`${pathname}/${data.case_id}/attachment`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Toast ref={toastRef} />
            <h1 className='text-2xl underline mb-6'>တင်သွင်းလွှာ</h1>

            <form
                className='card p-fluid form-grid grid'
                onSubmit={onSubmitHandler}
            >
                <div className='field col-12 md:col-6'>
                    <label htmlFor='case_no'>တင်သွင်းလွှာအမှတ်</label>
                    <InputText
                        value={formData.case_no}
                        id='case_no'
                        name='case_no'
                        onChange={onChangeHandler}
                        required={true}
                    />
                </div>

                <div className='field col-12 md:col-6'>
                    <label htmlFor='date_of_submittion'>တင်သွင်းသည့်ရက်စွဲ</label>
                    <Calendar
                        inputId='date_of_submittion'
                        name='date_of_submittion'
                        showIcon
                        value={formData.date_of_submittion}
                        onChange={onChangeHandler}
                        required={true}
                    />
                </div>

                <div className='field col-12'>
                    <label htmlFor='description_of_submittion'>တင်သွင်းသည့်အကြောင်းအရာ</label>
                    <InputTextarea
                        id='description_of_submittion'
                        name='description_of_submittion'
                        value={formData.description_of_submittion}
                        rows={5}
                        autoResize
                        style={{ maxHeight: '10rem' }}
                        onChange={onChangeHandler}
                    />
                </div>

                <div className='field col-12'>
                    <label htmlFor='submitting_person'>တင်သွင်းသည့်ပုဂ္ဂိုလ်/ဌာန/အဖွဲ့အစည်း</label>
                    <InputText
                        value={formData.submitting_person}
                        id='submitting_person'
                        name='submitting_person'
                        onChange={onChangeHandler}
                    />
                </div>

                <div className='field col-12'>
                    <label htmlFor='interpretation_of_tribunal'>ခုံရုံး၏အနက်အဓိပ္ပာယ်ဖွင့်ဆိုလိုသည့်အကြောင်း</label>
                    <InputTextarea
                        value={formData.interpretation_of_tribunal}
                        id='interpretation_of_tribunal'
                        name='interpretation_of_tribunal'
                        rows={5}
                        autoResize
                        style={{ maxHeight: '10rem' }}
                        onChange={onChangeHandler}
                    />
                </div>

                <div className='col-12'>
                    <div className='field col-12 lg:flex lg:align-items-center lg:gap-3'>
                        <label
                            htmlFor='date_of_submission'
                            className='col-12 lg:col-3'
                        >
                            တင်သွင်းလွှာတင်သွင်းသည့်နေ့
                        </label>
                        <Calendar
                            value={formData.date_of_submission}
                            inputId={'date_of_submission'}
                            name={'date_of_submission'}
                            className='col'
                            showIcon
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='field col-12 lg:flex lg:align-items-center lg:gap-3'>
                        <label
                            htmlFor='date_of_decision'
                            className='col-12 lg:col-3'
                        >
                            အပြီးသတ်ဆုံးဖြတ်သည့်နေ့
                        </label>
                        <Calendar
                            value={formData.date_of_decision}
                            inputId={'date_of_decision'}
                            name={'date_of_decision'}
                            className='col'
                            showIcon
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='field col-12'>
                        <label
                            htmlFor={'decided'}
                            className='col-12 lg:col-3'
                        >
                            မည်သို့ဆုံးဖြတ်သည်
                        </label>
                        <InputTextarea
                            value={formData.decided}
                            id={'decided'}
                            name={'decided'}
                            rows={5}
                            autoResize
                            style={{ maxHeight: '10rem' }}
                            onChange={onChangeHandler}
                        />
                    </div>
                </div>

                <div className='col-12 flex justify-content-end align-items-center gap-5'>
                    <Button
                        type='button'
                        icon='pi pi-fw pi-link'
                        className='w-auto'
                        label='Attachement'
                        disabled={!isSubmitted}
                        onClick={() => routeHandler()}
                    />
                    <Button
                        className='w-auto'
                        type='submit'
                        label='Submit'
                    />
                    <Button
                        type='button'
                        label='Reset'
                        className='w-auto'
                        severity='danger'
                        onClick={() => onResetHander()}
                    />
                </div>
            </form>
        </div>
    );
};

export default EDoc;
