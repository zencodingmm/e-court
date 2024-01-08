'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { EDocument, Setting } from '../../../../../types/ecourt';

import axiosInstance from '../../../../../utils/axiosInstance';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';

const Report = () => {
    const router = useRouter();
    const [data, setData] = useState<EDocument[] | undefined>(undefined);
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
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

    const onChangeCheckboxHandler = async (e: CheckboxChangeEvent, data: EDocument) => {
        try {
            const response = await axiosInstance.put(`/api/e_doc/${data.case_id}`, {
                ...data,
                current: e.checked
            });

            if (response.status === 201) {
                fetchData().catch(error => console.log(error));
            }
        } catch (error: any) {}
    };

    const onDeleteHandler = async (id: number | undefined) => {
        try {
            const response = await axiosInstance.delete(`/api/e_doc/${id}`);
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

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/api/e_doc?page=${first}&page_size=${rows}`);
            const { data, totalRecord } = response.data;

            if (response.status === 200) {
                setData(data);
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            if (first > 0) {
                setFirst(prevState => prevState - 10);
            }

            setData(undefined);
            setTotalRecord(0);
            setIsLoading(false);
            console.log(error);
        }
    }, [first, rows]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    return (
        <div>
            <Toast ref={toastRef} />
            <ConfirmDialog />

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
                        }}
                        tableStyle={{ minWidth: '200rem' }}
                    >
                        <Column
                            align='center'
                            field='current'
                            header='Status'
                            body={(data: EDocument) => (
                                <Checkbox
                                    checked={data.current}
                                    onChange={e => onChangeCheckboxHandler(e, data)}
                                />
                            )}
                        />

                        <Column
                            field='case_no'
                            header='တင်သွင်းလွှာအမှတ်'
                        />

                        <Column
                            field='date_of_submittion'
                            header='တင်သွင်းသည့်ရက်စွဲ'
                            body={(data: EDocument) => new Date(data.date_of_submittion as Date).toLocaleDateString()}
                        />

                        <Column
                            field='description_of_submittion'
                            header='တင်သွင်းသည့်အကြောင်းအရာ'
                            body={(data: EDocument) => (data.description_of_submittion ? data.description_of_submittion : 'ထည့်သွင်းထားခြင်းမရှိပါ')}
                            style={{ maxWidth: '40rem' }}
                        />

                        <Column
                            field='submitting_person'
                            header='တင်သွင်းသည့်ပုဂ္ဂိုလ်/ဌာန/အဖွဲ့အစည်း'
                            body={(data: EDocument) => (data.submitting_person ? data.submitting_person : 'ထည့်သွင်းထားခြင်းမရှိပါ')}
                        />

                        <Column
                            field='interpretation_of_tribunal'
                            header='ခုံရုံး၏အနက်အဓိပ္ပာယ်ဖွင့်ဆိုလိုသည့်အကြောင်း'
                            body={(data: EDocument) => (data.interpretation_of_tribunal ? data.interpretation_of_tribunal : 'ထည့်သွင်းထားခြင်းမရှိပါ')}
                            style={{ maxWidth: '40rem' }}
                        />

                        <Column
                            field='date_of_submission'
                            header='တင်သွင်းလွှာတင်သွင်းသည့်နေ့'
                            body={(data: EDocument) => (data.date_of_submission ? new Date(data.date_of_submission).toLocaleDateString() : 'ထည့်သွင်းထားခြင်းမရှိပါ')}
                        />

                        <Column
                            field='date_of_decision'
                            header='အပြီးသတ်ဆုံးဖြတ်သည့်နေ့'
                            body={(data: EDocument) => (data.date_of_decision ? new Date(data.date_of_decision).toLocaleDateString() : 'ထည့်သွင်းထားခြင်းမရှိပါ')}
                        />

                        <Column
                            field='decided'
                            header='မည်သို့ဆုံးဖြတ်သည်'
                            body={(data: EDocument) => (data.decided ? data.decided : 'ထည့်သွင်းထားခြင်းမရှိပါ')}
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
                                    onClick={() => confirmDelete(data.case_id)}
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
