'use client';

import React, { useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const EFilling = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitted(true);
    };

    return (
        <div>
            <div>
                <h1 className='text-2xl mb-5 underline'>တင်ပြလွှာ</h1>
            </div>

            <form
                className='card p-fluid form-grid grid'
                onSubmit={onSubmitHandler}
            >
                <div className='field col-12 md:col-6'>
                    <label className=''>တင်သွင်းလွှာအမှတ်</label>
                    <InputText />
                </div>

                <div className='field col-12 md:col-6'>
                    <label>တင်သွင်းသည့်ရက်စွဲ</label>
                    <Calendar showIcon />
                </div>

                <div className='field col-12'>
                    <label>တင်သွင်းသည့်အကြောင်းအရာ</label>
                    <InputTextarea
                        rows={5}
                        autoResize
                        style={{ maxHeight: '10rem' }}
                    />
                </div>

                <div className='field col-12'>
                    <label>တင်သွင်းသည့်ပုဂ္ဂိုလ်/ဌာန/အဖွဲ့အစည်း</label>
                    <InputText />
                </div>

                <div className='field col-12'>
                    <label>ခုံရုံး၏အနက်အဓိပ္ပာယ်ဖွင့်ဆိုလိုသည့်အကြောင်း</label>
                    <InputTextarea
                        rows={5}
                        autoResize
                        style={{ maxHeight: '10rem' }}
                    />
                </div>

                <div className='col-12'>
                    <div className='field col-12 lg:flex lg:align-items-center lg:gap-3'>
                        <label className='col-12 lg:col-3'>တင်သွင်းလွှာတင်သွင်းသည့်နေ့</label>
                        <Calendar
                            className='col'
                            showIcon
                        />
                    </div>

                    <div className='field col-12 lg:flex lg:align-items-center lg:gap-3'>
                        <label className='col-12 lg:col-3'>အပြီးသတ်ဆုံးဖြတ်သည့်နေ့</label>
                        <Calendar
                            className='col'
                            showIcon
                        />
                    </div>

                    <div className='field col-12'>
                        <label className='col-12 lg:col-3'>မည်သို့ဆုံးဖြတ်သည်</label>
                        <InputTextarea
                            rows={5}
                            autoResize
                            style={{ maxHeight: '10rem' }}
                        />
                    </div>
                </div>

                <div className='col-12 flex justify-content-end align-items-center gap-5'>
                    <div className='md:col-2'>
                        <Button
                            icon='pi pi-fw pi-link'
                            label='Attachement'
                            disabled={!isSubmitted}
                            onClick={() => router.push(pathname + '/attachment')}
                        />
                    </div>
                    <div className='md:col-2'>
                        <Button
                            type='submit'
                            label='Submit'
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EFilling;
