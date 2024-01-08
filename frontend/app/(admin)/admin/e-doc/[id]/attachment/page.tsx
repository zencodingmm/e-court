'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';

import Image from 'next/image';

import { Button } from 'primereact/button';
import { FileUpload, FileUploadRemoveEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { EDocument, EDocAttachment } from '../../../../../../types/ecourt';
import axiosInstance from '../../../../../../utils/axiosInstance';
import { ProgressSpinner } from 'primereact/progressspinner';

import DialogView from '../../../../../../components/DialogView';

import { saveAs } from 'file-saver';

enum FileType {
    image = 'image',
    pdf = 'pdf',
    video = 'video'
}

const Attachment = () => {
    const router = useRouter();
    const { id } = useParams();
    const [fileDescriptions, setFileDescriptions] = useState<string[]>(['']);
    const [files, setFiles] = useState<File[] | undefined>();
    const [document, setDocument] = useState<EDocument | undefined>();
    const [attachment, setAttachment] = useState<EDocAttachment[] | undefined>();
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    const toastRef = useRef<Toast>(null);
    const fileuploadRef = useRef<FileUpload>(null);
    const [url, setUrl] = useState<string>('');
    const [filetype, setFiletype] = useState<string>('');

    const [rows, setRows] = useState(10);
    const [first, setFirst] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (index: number, value: string) => {
        const newfileDescriptions = [...fileDescriptions];
        newfileDescriptions[index] = value;
        setFileDescriptions(newfileDescriptions);
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            files?.map(async (value, index) => {
                const response = await axiosInstance.post(
                    '/api/attachment',
                    {
                        description: fileDescriptions[index],
                        attachment: value,
                        case_id: document?.case_id
                    },
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                if (response.status === 201) {
                    fetchData().catch(error => console.log(error));
                    fileuploadRef.current?.clear();
                    setFileDescriptions(['']);
                }
            });
        } catch (error) {
            console.log(error);
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
            const response = await axiosInstance.delete(`/api/attachment/${id}`);
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

    const onFileRemoveHandler = (e: FileUploadRemoveEvent) => {
        const newFile = files?.filter(file => file.name !== e.file.name);
        setFiles(newFile);
    };

    const fetchCase = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`api/e_doc/search?case_id=${id}`);
            const { data } = response.data;

            if (response.status === 200) {
                setDocument(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, [id]);

    useEffect(() => {
        fetchCase().catch(error => console.log(error));
    }, [fetchCase]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/api/attachment?page=${first}&page_size=${rows}&case_id=${id}`);
            const { data, totalRecord } = response.data;

            if (response.status === 200) {
                setAttachment(data);
                setTotalRecord(totalRecord);
                setIsLoading(false);
            }
        } catch (error) {
            if (first > 0) {
                setFirst(prevState => prevState - 10);
            }

            setAttachment(undefined);
            setTotalRecord(0);
            setIsLoading(false);
        }
    }, [first, rows, id]);

    useEffect(() => {
        fetchData().catch(error => console.log(error));
    }, [fetchData]);

    const downloadHandler = (url: string, filename: string) => {
        saveAs(url, filename);
    };

    const fileTemplate = (data: EDocAttachment) => {
        if (data.file_type.includes(FileType.image)) {
            return (
                <Image
                    className='w-9 sm:w-16rem xl:w-14rem sm:h-10rem xl:h-9rem shadow-2 border-round cursor-pointer'
                    src={`${process.env.NEXT_PUBLIC_CASES_URL}/${data.file_name}`}
                    alt={data.file_name}
                    width={1920}
                    height={1080}
                    onClick={() => {
                        setDialogVisible(true);
                        setUrl(`${process.env.NEXT_PUBLIC_CASES_URL}/${data.file_name}`);
                        setFiletype(data.file_type);
                    }}
                    priority
                />
            );
        }

        if (data.file_type.includes(FileType.pdf)) {
            return (
                <div
                    className='card w-9 sm:w-16rem xl:w-14rem flex gap-3 align-items-center shadow-2 cursor-pointer'
                    onClick={() => {
                        setDialogVisible(true);
                        setUrl(`${process.env.NEXT_PUBLIC_CASES_URL}/${data.file_name}`);
                        setFiletype(data.file_type);
                    }}
                >
                    <span className='pi pi-file-pdf text-3xl text-red-500' />
                    {data.file_name.split('/')[1].length > 10 ? `${data.file_name.split('/')[1].substring(0, 10)}...` : data.file_name.split('/')[1]}
                </div>
            );
        }

        if (data.file_type.includes(FileType.video)) {
            return (
                <video
                    src={`${process.env.NEXT_PUBLIC_CASES_URL}/${data.file_name}`}
                    className='w-9 sm:w-16rem xl:w-14rem sm:h-10rem xl:h-9rem shadow-2 border-round cursor-pointer bg-white'
                    onClick={() => {
                        setDialogVisible(true);
                        setUrl(`${process.env.NEXT_PUBLIC_CASES_URL}/${data.file_name}`);
                        setFiletype(data.file_type);
                    }}
                />
            );
        }
    };

    return (
        <div>
            <Toast ref={toastRef} />
            <ConfirmDialog />

            <Dialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                className='h-full col-11'
                contentClassName='border-noround'
            >
                <DialogView
                    url={url}
                    filetype={filetype}
                />
            </Dialog>

            <div className='col flex align-items-center gap-4'>
                <Button
                    icon='pi pi-fw pi-arrow-left'
                    rounded
                    onClick={() => router.back()}
                />
                <h1 className='text-xl mb-5'>အမှုသွား/အမှုလာမှတ်တမ်းများ</h1>
            </div>

            <form
                className='card p-fluid form-grid grid'
                onSubmit={onSubmitHandler}
            >
                <div className='field col-12'>
                    <FileUpload
                        ref={fileuploadRef}
                        mode='advanced'
                        multiple
                        uploadOptions={{ style: { display: 'none' } }}
                        onSelect={e => setFiles(e.files)}
                        onClear={() => setFiles(undefined)}
                        onRemove={e => onFileRemoveHandler(e)}
                    />
                </div>

                {files &&
                    files.map((value, index) => (
                        <div
                            className='field col-12'
                            key={value.name}
                        >
                            <label htmlFor='description'>အကြောင်းအရာထည့်သွင်းရန် - ဖိုင်({index + 1}) </label>
                            <InputText
                                value={fileDescriptions && fileDescriptions[index]}
                                id='description'
                                name='description'
                                onChange={e => handleChange(index, e.target.value)}
                                onBlur={() => setFileDescriptions([...fileDescriptions, ''])}
                                required
                            />
                        </div>
                    ))}

                <Button
                    label='Submit'
                    className='w-auto ml-auto'
                />
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
                        value={attachment}
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
                            header='No'
                            body={(_, options) => options.rowIndex + 1}
                        />
                        <Column
                            field='description'
                            header='အကြောင်းအရာ'
                        />
                        <Column
                            header='ဖိုင်'
                            body={fileTemplate}
                        />
                        <Column
                            field='created_at'
                            header='ရက်စွဲ'
                            body={(data: EDocAttachment) => data.created_at && new Date(data.created_at).toLocaleDateString()}
                        />
                        <Column
                            align='center'
                            body={(data: EDocAttachment) => (
                                <Button
                                    label='Download'
                                    icon='pi pi-download'
                                    onClick={() => downloadHandler(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.file_name}`, data.file_name.split('/')[1])}
                                />
                            )}
                        />
                        <Column
                            align='center'
                            body={(data: EDocAttachment) => (
                                <Button
                                    label='Delete'
                                    icon='pi pi-trash'
                                    severity='danger'
                                    onClick={() => confirmDelete(data.attachment_id)}
                                />
                            )}
                        />
                    </DataTable>
                )}
            </div>
        </div>
    );
};

export default Attachment;
