'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';

import { useSession } from 'next-auth/react';

import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

import axiosInstance from '../../../../../utils/axiosInstance';
import { EVoteResult } from '../../../../../types/ecourt';

const EVotingComment = () => {
    const router = useRouter();
    const { id } = useParams();
    const toastRef = useRef<Toast>(null);

    const [votingResult, setVotingResult] = useState<EVoteResult | undefined>();

    const { data: session } = useSession();

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(`/api/e_vote_result/${id}`, { ...votingResult });
            const { message } = response.data;

            if (response.status === 201) {
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
            }
        } catch (error: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.error, life: 3000 });
        }
    };

    const fetchEVotingResult = useCallback(async () => {
        try {
            if (id && session) {
                const response = await axiosInstance.get(`/api/e_vote_result/search?e_vote_id=${id}&user_code=${session?.user.user_code}`);
                const { data } = response.data;

                if (response.status === 200) {
                    setVotingResult(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [id, session]);

    useEffect(() => {
        fetchEVotingResult().catch(error => console.log(error));
    }, [fetchEVotingResult]);

    return (
        <div>
            <Toast ref={toastRef} />
            <div className='col flex align-items-center gap-4'>
                <Button
                    icon='pi pi-fw pi-arrow-left'
                    rounded
                    onClick={() => router.back()}
                />
                <h1 className='text-xl underline mb-5'>အကြုံပြုချက်ထည့်သွင်းရန်</h1>
            </div>

            <form
                className='card p-fluid formgrid grid'
                onSubmit={onSubmitHandler}
            >
                <div className='filed col-12'>
                    <label>အကြုံပြုချက်</label>
                    <InputTextarea
                        value={votingResult?.comment ? votingResult?.comment : ''}
                        autoResize
                        style={{ maxHeight: '10rem', minHeight: '10rem' }}
                        onChange={e => setVotingResult(prevState => ({ ...prevState, comment: e.target.value }) as EVoteResult)}
                    />
                </div>

                <div className='field col-12 flex justify-content-end mt-5'>
                    <Button
                        label='Submit'
                        className='w-auto'
                    />
                </div>
            </form>
        </div>
    );
};

export default EVotingComment;
