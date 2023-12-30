'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { Toast } from 'primereact/toast';

import axiosInstance from '../../../../utils/axiosInstance';
import { EVote } from '../../../../types/ecourt';
import { ProgressSpinner } from 'primereact/progressspinner';

const EVotePage = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [data, setData] = useState<EVote[] | undefined>();
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
                fetchData().catch(error => console.log(error));
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 300 });
                setInputValue('');
            }
        } catch (error: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.error });
        }
    };

    const onUpdateHandler = async (e: DataTableRowEditCompleteEvent) => {
        try {
            const { newData } = e;

            const response = await axiosInstance.put(`/api/e_vote/${newData.e_vote_id}`, newData);
            const { message } = response.data;

            if (response.status === 200) {
                fetchData().catch(error => console.log(error));
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 300 });
            }
        } catch (error: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.error });
        }
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

    const InputTextEditor = (option: ColumnEditorOptions) => (
        <InputTextarea
            value={option.value}
            className='col-12'
            autoResize
            onChange={e => option.editorCallback?.(e.target.value)}
        />
    );

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

                    <div className='flex-1 flex justify-content-end'>
                        <Button
                            type='submit'
                            label='Save'
                            className='w-auto'
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
                            editMode='row'
                            onRowEditComplete={onUpdateHandler}
                        >
                            <Column
                                header='No'
                                body={(_, options) => options.rowIndex + 1}
                            />
                            <Column
                                field='description'
                                header='Vote Description'
                                editor={InputTextEditor}
                            />
                            <Column
                                field='created_at'
                                header='Created Date'
                                body={data => new Date(data.created_at).toLocaleDateString()}
                            />

                            <Column
                                align='center'
                                rowEditor
                            />
                            <Column
                                align='center'
                                body={(data: EVote) => (
                                    <Button
                                        icon='pi pi-trash'
                                        rounded
                                        text
                                        severity='danger'
                                        onClick={() => onDeleteHandler(data.e_vote_id)}
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
