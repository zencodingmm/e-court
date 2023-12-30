'use client';

import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';

const Setting = () => {
    return (
        <div>
            <h1 className='text-2xl underline mb-6'>Setting</h1>

            <div className='card'>
                <div className='col-12'>
                    <h1 className='text-lg'>Live Streaming Link (ထည့်ရန်)</h1>
                    <div className=''>
                        <InputTextarea className='col-12' autoResize rows={4} />
                        <div className="flex-1 flex justify-content-end mt-5">
                            <Button label='Save' />
                        </div>
                    </div>
                </div>

                <hr />

                <div className='col-12 flex flex-column gap-4'>
                    <h1 className='text-lg'>Button Link ( Dashboard အတွက် ခလုတ်များထည့်သွင်းရန် )</h1>
                    <div className='p-inputgroup flex-1'>
                        <label className='p-inputgroup-addon col md:col-2'>E-Lib Link</label>
                        <InputText />

                        <Button label='Save' />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label className='p-inputgroup-addon col md:col-2'>Case Flow Link</label>
                        <InputText />

                        <Button label='Save' />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label className='p-inputgroup-addon col md:col-2'>Other Link (1)</label>
                        <InputText />

                        <Button label='Save' />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label className='p-inputgroup-addon col md:col-2'>Other Link (2)</label>
                        <InputText />

                        <Button label='Save' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;
