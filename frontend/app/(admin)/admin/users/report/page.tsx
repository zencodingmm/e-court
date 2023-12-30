'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';

import { User } from '../../../../../types/ecourt';
import axiosInstance from '../../../../../utils/axiosInstance';

const UserReport = () => {
    const router = useRouter();
    const [data, setData] = useState<User[] | undefined>();
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const onDeleteHandler = async (id: number | undefined) => {
        try {
            const response = await axiosInstance.delete(`/api/user/${id}`);
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
            console.log('working...');
            const response = await axiosInstance.get(`/api/user?page=${page}&page_size=${rows}`);
            const { data, totalRecord } = response.data;

            if (response.status === 200) {
                setData(data);
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            setData(undefined);
            setTotalRecord(0);
            console.log(error);
        }
    }, [rows, page]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    return (
        <div>
            <Toast ref={toastRef} />
            <h1 className='text-2xl underline mb-6'>အသုံးပြုသူများစာရင်း</h1>

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
                    >
                        <Column
                            header='No'
                            body={(_, options) => options.rowIndex + 1}
                        />
                        <Column
                            field='user_code'
                            header='Code Number'
                        />
                        <Column
                            field='user_name'
                            header='အမည်'
                        />
                        <Column
                            field='type'
                            header='အသုံးပြုသူအမျိုးအစား'
                        />
                        <Column
                            field='user_rank'
                            header='ရာထူး'
                        />
                        <Column
                            field='locked'
                            header='Locked'
                            body={data => (
                                <Tag
                                    value={data.locked ? 'locked' : 'unlocked'}
                                    severity={data.locked ? 'warning' : 'success'}
                                />
                            )}
                        />
                        <Column
                            align='center'
                            body={data => (
                                <Button
                                    icon='pi pi-pencil'
                                    text
                                    rounded
                                    onClick={() => router.push(`/admin/users/${data.user_id}`)}
                                />
                            )}
                        />
                        <Column
                            align='center'
                            body={data => (
                                <Button
                                    icon='pi pi-trash'
                                    text
                                    rounded
                                    severity='danger'
                                    onClick={() => onDeleteHandler(data.user_id)}
                                />
                            )}
                        />
                    </DataTable>
                )}
            </div>
        </div>
    );
};

export default UserReport;
