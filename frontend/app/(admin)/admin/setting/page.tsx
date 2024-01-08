'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

import { OnChangeEvent, Setting } from '../../../../types/ecourt';
import axiosInstance from '../../../../utils/axiosInstance';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';

const Setting = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [formData, setFormData] = useState<Setting>({
        live_streaming_link: '',
        e_lib_link: '',
        case_flow_link: '',
        other_1: '',
        other_2: '',
        current: false
    });
    const [settings, setSettings] = useState<Setting[] | undefined>();
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const onChangeHandler = (e: OnChangeEvent) => {
        setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/setting', formData);
            const { message } = response.data;

            if (response.status === 201) {
                fetchData().catch(error => console.log(error));
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
                setFormData({
                    live_streaming_link: '',
                    e_lib_link: '',
                    case_flow_link: '',
                    other_1: '',
                    other_2: '',
                    current: false
                });
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

    const onChangeCheckboxHandler = async (e: CheckboxChangeEvent, data: Setting) => {
        try {
            const response = await axiosInstance.put(`/api/setting/${data.setting_id}`, { ...data, current: e.checked });
            const { message } = response.data;

            if (response.status === 201) {
                fetchData().catch(error => console.log(error));
            }
        } catch (error: any) {}
    };

    const onDeleteHandler = async (id: number | undefined) => {
        try {
            const response = await axiosInstance.delete(`/api/setting/${id}`);
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
            const response = await axiosInstance.get(`/api/setting?page=${first}&page_size=${rows}`);
            const { data, totalRecord } = response.data;

            if (response.status === 200) {
                setSettings(data);
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            if (first > 0) {
                setFirst(prevState => prevState - 10);
            }

            setSettings(undefined);
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

            <h1 className='text-2xl underline mb-6'>Setting</h1>

            <form
                className='card'
                onSubmit={onSubmitHandler}
            >
                <div className='col-12'>
                    <label
                        className='text-lg font-semibold block mb-3'
                        htmlFor='live_streaming_link'
                    >
                        Live Streaming Link (ထည့်ရန်)
                    </label>
                    <div>
                        <InputTextarea
                            id='live_streaming_link'
                            name='live_streaming_link'
                            className='col-12'
                            autoResize
                            style={{ maxHeight: '10rem' }}
                            value={formData.live_streaming_link}
                            onChange={onChangeHandler}
                        />
                    </div>
                </div>

                <hr />

                <div className='col-12 flex flex-column gap-4'>
                    <h1 className='text-lg'>Button Link ( Dashboard အတွက် ခလုတ်များထည့်သွင်းရန် )</h1>
                    <div className='p-inputgroup flex-1'>
                        <label
                            className='p-inputgroup-addon col md:col-2'
                            htmlFor='e_lib_link'
                        >
                            E-Lib Link
                        </label>
                        <InputText
                            id='e_lib_link'
                            name='e_lib_link'
                            value={formData.e_lib_link}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label
                            className='p-inputgroup-addon col md:col-2'
                            htmlFor='case_flow_link'
                        >
                            Case Flow Link
                        </label>
                        <InputText
                            id='case_flow_link'
                            name='case_flow_link'
                            value={formData.case_flow_link}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label
                            className='p-inputgroup-addon col md:col-2'
                            htmlFor='other_1'
                        >
                            Other Link (1)
                        </label>
                        <InputText
                            id='other_1'
                            name='other_1'
                            value={formData.other_1}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className='p-inputgroup flex-1'>
                        <label
                            className='p-inputgroup-addon col md:col-2'
                            htmlFor='other_2'
                        >
                            Other Link (2)
                        </label>
                        <InputText
                            id='other_2'
                            name='other_2'
                            value={formData.other_2}
                            onChange={onChangeHandler}
                        />
                    </div>
                </div>

                <div className='col-12 flex justify-content-end'>
                    <Button label='Save' />
                </div>
            </form>

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
                        value={settings}
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
                        tableStyle={{ minWidth: '100rem' }}
                    >
                        <Column
                            align='center'
                            header='Status'
                            body={(data: Setting) => (
                                <Checkbox
                                    checked={data.current ? data.current : false}
                                    onChange={e => onChangeCheckboxHandler(e, data)}
                                />
                            )}
                        />
                        <Column
                            header='No'
                            body={(_, options) => options.rowIndex + 1}
                        />

                        <Column
                            field='live_streaming_link'
                            header='Live Streaming'
                            body={(data: Setting) =>
                                data.live_streaming_link ? (
                                    <Link
                                        href={data.live_streaming_link}
                                        target='_blank'
                                    >
                                        {data.live_streaming_link}
                                    </Link>
                                ) : (
                                    'ထည့်သွင်းထားခြင်းမရှိပါ။'
                                )
                            }
                        />
                        <Column
                            field='e_lib_link'
                            header='E-Lib'
                            body={(data: Setting) =>
                                data.e_lib_link ? (
                                    <Link
                                        href={data.e_lib_link}
                                        target='_blank'
                                    >
                                        {data.e_lib_link}
                                    </Link>
                                ) : (
                                    'ထည့်သွင်းထားခြင်းမရှိပါ။'
                                )
                            }
                        />
                        <Column
                            field='case_flow_link'
                            header='Case Flow'
                            body={(data: Setting) =>
                                data.case_flow_link ? (
                                    <Link
                                        href={data.case_flow_link}
                                        target='_blank'
                                    >
                                        {data.case_flow_link}
                                    </Link>
                                ) : (
                                    'ထည့်သွင်းထားခြင်းမရှိပါ။'
                                )
                            }
                        />
                        <Column
                            field='other-1'
                            header='Other 1'
                            body={(data: Setting) =>
                                data.other_1 ? (
                                    <Link
                                        href={data.other_1}
                                        target='_blank'
                                    >
                                        {data.other_1}
                                    </Link>
                                ) : (
                                    'ထည့်သွင်းထားခြင်းမရှိပါ။'
                                )
                            }
                        />
                        <Column
                            field='other-2'
                            header='Other 2'
                            body={(data: Setting) =>
                                data.other_2 ? (
                                    <Link
                                        href={data.other_2}
                                        target='_blank'
                                    >
                                        {data.other_2}
                                    </Link>
                                ) : (
                                    'ထည့်သွင်းထားခြင်းမရှိပါ။'
                                )
                            }
                        />
                        <Column
                            align='center'
                            body={(data: Setting) => (
                                <Button
                                    icon='pi pi-pencil'
                                    rounded
                                    onClick={() => router.push(`${pathname}/${data.setting_id}`)}
                                />
                            )}
                        />

                        <Column
                            align='center'
                            body={(data: Setting) => (
                                <Button
                                    icon='pi pi-trash'
                                    rounded
                                    severity={'danger'}
                                    onClick={() => onDeleteHandler(data.setting_id)}
                                />
                            )}
                        />
                    </DataTable>
                )}
            </div>
        </div>
    );
};

export default Setting;
