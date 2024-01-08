'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import axiosInstance from '../../../../utils/axiosInstance';
import { EVote } from '../../../../types/ecourt';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Checkbox } from 'primereact/checkbox';

const EVotePage = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [inputValue, setInputValue] = useState<string>('');
    const [data, setData] = useState<EVote[] | undefined>();
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/e_vote', { description: inputValue });
            const { message } = response.data;

            if (response.status === 201) {
                setIsSubmitted(true);
                fetchData().catch(error => console.log(error));
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 300 });
            }
        } catch (error: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.error });
        }
    };

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
            const response = await axiosInstance.delete(`/api/e_vote/${id}`);
            const { message } = response.data;

            if (response.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 300 });
            }
        } catch (error: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.error });
        }
    };

    const onChangeCheckboxHandler = async (value: boolean | undefined, data: EVote) => {
        try {
            const response = await axiosInstance.put(`/api/e_vote/${data.e_vote_id}`, { ...data, current: value });

            if (response.status === 201) {
                fetchData().catch(error => console.log(error));
            }
        } catch (error: any) {
            confirmDialog({
                header: 'Duplicate',
                message: error.response.data.error,
                contentClassName: 'border-noround',
                acceptClassName: 'p-button-danger',
                acceptLabel: 'Turn on',
                async accept() {
                    const response = await axiosInstance.put(`/api/e_vote/${data.e_vote_id}?force=${true}`, { ...data, current: value });

                    if (response.status === 201) {
                        fetchData().catch(error => console.log(error));
                    }
                }
            });
        }
    };

    const routeHandler = async () => {
        try {
            const response = await axiosInstance.get(`/api/e_vote/search?desc=${inputValue}`);
            const { data } = response.data;

            if (response.status === 200) {
                router.push(`${pathname}/${data.e_vote_id}/attachment`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await axiosInstance.get(`/api/e_vote?page=${first}&page_size=${rows}`);
            const { data, totalRecord: count } = response.data;

            if (response.status === 200) {
                setData(data);
                setTotalRecord(count);
                setIsLoading(false);
            }
        } catch (error) {
            if (first > 0) {
                setFirst(prevState => prevState - 10);
            }

            setData(undefined);
            setTotalRecord(0);
            setIsLoading(false);
        }
    }, [first, rows]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    return (
        <div>
            <Toast ref={toastRef} />
            <ConfirmDialog />
            <h1 className='text-2xl underline mb-6'>E-Vote</h1>

            <div className='card'>
                <form
                    className='p-fluid formgrid grid'
                    onSubmit={onSubmitHandler}
                >
                    <div className='field col-12'>
                        <label>မဲပေးလိုသည့်အကြောင်းအရာ</label>
                        <InputTextarea
                            value={inputValue}
                            autoResize
                            style={{ maxHeight: '10rem', minHeight: '10rem' }}
                            onChange={e => setInputValue(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex-1 flex justify-content-end gap-5'>
                        <Button
                            type='button'
                            label='Attachment'
                            className='w-auto'
                            disabled={!isSubmitted}
                            onClick={routeHandler}
                        />
                        <Button
                            type='submit'
                            label='Save'
                            className='w-auto'
                        />
                        <Button
                            type='button'
                            label='Reset'
                            className='w-auto'
                            severity='danger'
                            onClick={() => setInputValue('')}
                        />
                    </div>
                </form>

                <div className='mt-6'>
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
                            }}
                        >
                            <Column
                                body={(data: EVote) => (
                                    <Checkbox
                                        checked={data.current}
                                        onChange={e => onChangeCheckboxHandler(e.checked, data)}
                                    />
                                )}
                            />
                            <Column
                                header='No'
                                body={(_, options) => options.rowIndex + 1}
                            />
                            <Column
                                field='description'
                                header='Vote Description'
                            />
                            <Column
                                field='created_at'
                                header='Created Date'
                                body={data => new Date(data.created_at).toLocaleDateString()}
                            />

                            <Column
                                align='center'
                                body={(data: EVote) => (
                                    <Button
                                        icon='pi pi-pencil'
                                        rounded
                                        text
                                        severity='secondary'
                                        onClick={() => router.push(`${pathname}/${data.e_vote_id}`)}
                                    />
                                )}
                            />
                            <Column
                                align='center'
                                body={(data: EVote) => (
                                    <Button
                                        icon='pi pi-trash'
                                        rounded
                                        text
                                        severity='danger'
                                        onClick={() => confirmDelete(data.e_vote_id)}
                                    />
                                )}
                            />
                        </DataTable>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EVotePage;
