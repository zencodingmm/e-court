'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

import { EDocument } from '../../../../../types/ecourt';

import axiosInstance from '../../../../../utils/axiosInstance';

const Report = () => {
    const router = useRouter();
    const [data, setData] = useState<EDocument[] | undefined>(undefined);
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const onDeleteHandler = async (id: number | undefined) => {
        try {
            const response = await axiosInstance.delete(`/api/e_doc/${id}`);
            const { message } = response.data;

            if (response.status === 200) {
                if (page * 10 === totalRecord) {
                    setPage(prevState => prevState - 1);
                }

                fetchData().catch(error => console.log(error));
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
            }
        } catch (error: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.error, life: 3000 });
        }
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/api/e_doc?page=${page}&page_size=${rows}`);
            const { data, totalRecord } = response.data;

            if (response.status === 200) {
                setData(data);
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            setData(undefined);
            setTotalRecord(0);
            setIsLoading(false);
            console.log(error);
        }
    }, [page, rows]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    return (
        <div>
            <Toast ref={toastRef} />
            <h1 className='text-2xl underline mb-6'>တင်သွင်းလွှာများ</h1>

            <div className='card'>
                {isLoading && (
                    <div className='col flex justify-content-center align-items-center'>
                        <ProgressSpinner
                            style={{ width: '50px', height: '50px' }}
                            strokeWidth='8'
                            fill='var(--surface-ground)'
                            animationDuration='.5s'
                        />
                    </div>
                )}
                {!isLoading && (
                    <DataTable
                        value={data}
                        rows={rows}
                        first={first}
                        totalRecords={totalRecord}
                        rowsPerPageOptions={[10, 30, 50, 100]}
                        lazy={true}
                        paginator={true}
                        showGridlines={true}
                        onPage={e => {
                            setFirst(e.first);
                            setRows(e.rows);
                            setPage(e.page as number);
                        }}
                        tableStyle={{ minWidth: '100rem' }}
                    >
                        <Column
                            field='case_no'
                            header='တင်သွင်းလွှာအမှတ်'
                        />
                        <Column
                            field='submitting_person'
                            header='တင်သွင်းသည့်ပုဂ္ဂိုလ်/ဌာန/အဖွဲ့အစည်း'
                            body={options => (options.submitting_person ? options.submitting_person : 'ထည့်သွင်းထားခြင်းမရှိပါ')}
                        />
                        <Column
                            field='date_of_submittion'
                            header='တင်သွင်းသည့်ရက်စွဲ'
                            body={options => new Date(options.date_of_submittion).toLocaleDateString()}
                        />
                        <Column
                            field='description_of_submittion'
                            header='တင်သွင်းသည့်အကြောင်းအရာ'
                            style={{ maxWidth: '40rem' }}
                        />

                        <Column
                            align='center'
                            body={data => (
                                <Button
                                    label='View'
                                    onClick={() => router.push(`/admin/e-doc/${data.case_id}`)}
                                />
                            )}
                        />
                        <Column
                            align='center'
                            body={data => (
                                <Button
                                    icon='pi pi-trash'
                                    rounded
                                    severity='danger'
                                    onClick={() => onDeleteHandler(data.case_id)}
                                />
                            )}
                        />
                    </DataTable>
                )}
            </div>
        </div>
    );
};

export default Report;
