'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';

const Attachment = () => {
    const router = useRouter();

    return (
        <div>
            <div className='col flex align-items-center gap-4'>
                <Button
                    icon='pi pi-fw pi-arrow-left'
                    rounded
                    onClick={() => router.back()}
                />
                <h1 className='text-xl mb-5'>အမှုသွား/အမှုလာမှတ်တမ်းများ</h1>
            </div>
            <form className='card p-fluid form-grid grid'>
                <div className='field col-12'>
                    <FileUpload
                        mode='advanced'
                        multiple
                        uploadOptions={{ style: { display: 'none' } }}
                    />
                </div>

                <div className='field col-12'>
                    <label>အကြောင်းအရာထည့်သွင်းရန်</label>
                    <InputText />
                </div>

                <Button
                    label='Submit'
                    className='w-auto ml-auto'
                />
            </form>

            <div className='card p-fluid grid'>
                <div className='field col-12 md:col-4 lg:col-3'>
                    <label>အကြောင်းအရာ</label>
                    <InputText className='col-12' />
                </div>

                <div className='field col-12 md:col-4 lg:col-3'>
                    <label>ရက်စွဲ</label>
                    <Calendar showIcon />
                </div>

                <div className='field col-12 md:col-4 lg:col-3'>
                    <label>ဖိုင်အမည်</label>
                    <InputText className='col-12' />
                </div>

                <div className='field flex justify-content-center align-items-end col-12 md:col-4 lg:col gap-2'>
                    <Button label='Download' />
                    <Button
                        label='Delete'
                        severity='danger'
                    />
                </div>
            </div>
        </div>
    );
};

export default Attachment;
