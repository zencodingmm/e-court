'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const report = [
    { id: '1', person: 'Maung Maung', created_at: new Date(), desc: 'lorem ipsum' },
    { id: '2', person: 'Aung Aung', created_at: new Date(), desc: 'hello world' },
    { id: '3', person: 'Zaw Zaw', created_at: new Date(), desc: 'ipsum lorem' },
    { id: '4', person: 'Kyaw Kyaw', created_at: new Date(), desc: 'world hello' }
];

const Report = () => {
    const router = useRouter();

    return (
        <div>
            <h1 className='text-2xl underline'>တင်ပြလွှာများ</h1>

            <div className='card'>
                <DataTable
                    value={report}
                    showGridlines
                >
                    <Column
                        field='id'
                        header='တင်သွင်းလွှာအမှတ်'
                    />
                    <Column
                        field='person'
                        header='တင်သွင်းသည့်ပုဂ္ဂိုလ်'
                    />
                    <Column
                        field='created_at'
                        header='တင်သွင်းသည့်ရက်စွဲ'
                        body={options => new Date(options.created_at).toLocaleDateString()}
                    />
                    <Column
                        field='desc'
                        header='တင်သွင်းသည့်အကြောင်းအရာ'
                    />

                    <Column
                        align='center'
                        body={() => (
                            <Button
                                label='View'
                                onClick={() => router.push('/admin/e-filling')}
                            />
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default Report;
