'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { OnChangeEvent, UserType } from '../../../../../types/ecourt';
import axiosInstance from '../../../../../utils/axiosInstance';

const UserTypePage = () => {
    const [userType, setUserType] = useState<UserType>({
        type: '',
        description: ''
    });
    const [userTypeLists, setUserTypeLists] = useState<UserType[] | undefined>(undefined);
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const restoreDefaultState = (action: string) => {
        if (action) {
            setUserType({ type: '', description: '' });
        }
    };

    const onChangeHandler = (e: OnChangeEvent) => {
        setUserType(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/user_type', userType);
            const { message } = response.data;

            if (response.status === 201) {
                fetchData().catch(error => console.log(error));
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
                restoreDefaultState('submit');
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

    const onUpdateHandler = async (e: DataTableRowEditCompleteEvent) => {
        try {
            const { newData } = e;

            const response = await axiosInstance.put(`/api/user_type/${newData.user_type_id}`, newData);
            const { message } = response.data;

            if (response.status === 200) {
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
            const response = await axiosInstance.delete(`/api/user_type/${id}`);
            const { message } = response.data;

            if (response.status === 200) {
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

    const InputTextEditor = (data: ColumnEditorOptions) => {
        return (
            <InputText
                value={data.value}
                onChange={e => data.editorCallback?.(e.target.value)}
            />
        );
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/api/user_type?page=${first}&page_size=${rows}`);
            const { data, totalRecord } = response.data;

            if (response.status === 200) {
                setUserTypeLists(data);
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            if (first > 0) {
                setFirst(prevState => prevState - 10);
            }

            setUserTypeLists(undefined);
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

            <h1 className='text-2xl underline mb-6'>အသုံးပြုသူအမျိုးအစား</h1>

            <div className='card'>
                <form
                    className='p-fluid formgrid grid'
                    onSubmit={onSubmitHandler}
                >
                    <div className='field col-12 md:col-5'>
                        <label htmlFor='type'>အမျိုးအစား</label>
                        <InputText
                            value={userType.type}
                            id='type'
                            name='type'
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='field col-12 md:col-5'>
                        <label htmlFor='description'>အကြောင်းအရာ</label>
                        <InputText
                            value={userType.description}
                            id='description'
                            name='description'
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='field col-12 md:col flex justify-content-end md:justify-content-start align-items-center md:align-items-end mt-3 md:mt-0'>
                        <Button
                            type='submit'
                            label='Submit'
                            className='w-auto'
                        />
                    </div>
                </form>

                <div className='mt-5'>
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
                            value={userTypeLists}
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
                                field='type'
                                header='အမျိုးအစား'
                                editor={InputTextEditor}
                            />
                            <Column
                                field='description'
                                header='အကြောင်းအရာ'
                                editor={InputTextEditor}
                            />

                            <Column
                                align='center'
                                rowEditor
                            />
                            <Column
                                align='center'
                                body={(data: UserType) => (
                                    <Button
                                        icon='pi pi-trash'
                                        rounded
                                        text
                                        severity='danger'
                                        onClick={() => confirmDelete(data.user_type_id)}
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

export default UserTypePage;
