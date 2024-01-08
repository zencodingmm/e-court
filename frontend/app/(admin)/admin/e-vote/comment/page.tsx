'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { EVote, EVoteResult } from '../../../../../types/ecourt';
import axiosInstance from '../../../../../utils/axiosInstance';

const Comment = () => {
    const router = useRouter();
    const [evote, setEvote] = useState<EVote | undefined>();
    const [data, setData] = useState<EVoteResult[] | undefined>();
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const confirmDelete = (id: number | undefined) => {
        confirmDialog({
            header: 'Delete Confirmation',
            message: 'Do you want to delete this record',
            contentClassName: 'border-noround',
            acceptClassName: 'p-button-danger',
            accept() {
                onDeleteHandler(id).catch(error => console.log(error));
            }
        });
    };

    const onDeleteHandler = async (id: number | undefined) => {
        try {
            const response = await axiosInstance.delete(`/api/e_vote_result/${id}`);
            const { message } = response.data;
            if (response.status === 200) {
                if (page * 10 === totalRecord) {
                    setPage(prevState => prevState - 1);
                }
                fetchData().catch(error => console.log(error));

                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
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

    const fetchEVote = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/e_vote');
            const { data } = response.data;

            if (response.status === 200) {
                if (data) {
                    setEvote(prevState => ({ ...prevState, e_vote_id: data.e_vote_id }) as EVote);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchEVote().catch(error => console.log(error));
    }, [fetchEVote]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/api/e_vote_result?id=${evote?.e_vote_id}&page=${page}&page_size=${rows}`);
            const { data, totalRecord } = response.data;

            console.log(data);

            if (response.status === 200) {
                setData(data);
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            if (page > 0) {
                setPage(prevState => prevState - 1);
                setFirst(prevState => prevState - 1);
            }

            setIsLoading(false);
            setData(undefined);
            setTotalRecord(0);
            console.log(error);
        }
    }, [rows, page, evote]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    const votingTemplate = (data: EVoteResult) => {
        if (data.result === 'support') {
            return <span>ထောက်ခံပါသည်</span>;
        }

        if (data.result === 'neutral') {
            return <span>ကြားနေ</span>;
        }

        if (data.result === 'not_support') {
            return <span>မထောက်ခံပါ</span>;
        }
    };

    return (
        <div>
            <Toast ref={toastRef} />
            <h1 className='text-2xl underline mb-6'>အကြုံပြုချက်များ</h1>
            <ConfirmDialog />

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
                            header='No'
                            body={(_, options) => options.rowIndex + 1}
                        />
                        <Column
                            field='user_code'
                            header='Code Code'
                        />
                        <Column
                            field='username'
                            header='အမည်'
                        />
                        <Column
                            field='user_rank'
                            header='ရာထူး'
                        />
                        <Column
                            field='result'
                            header='မဲဆန္ဒ'
                            body={votingTemplate}
                        />
                        <Column
                            field='comment'
                            header='အကြုံပြုချက်'
                            style={{ maxWidth: '40rem' }}
                        />
                        <Column
                            align='center'
                            body={(data: EVoteResult) => (
                                <Button
                                    icon='pi pi-trash'
                                    text
                                    rounded
                                    severity='danger'
                                    onClick={() => confirmDelete(data.voting_result_id)}
                                />
                            )}
                        />
                    </DataTable>
                )}
            </div>
        </div>
    );
};

export default Comment;
