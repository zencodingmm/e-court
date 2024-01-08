'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { Chart } from 'primereact/chart';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { useSession } from 'next-auth/react';
import axiosInstance from '../../../utils/axiosInstance';
import { EVoteResult } from '../../../types/ecourt';

export default function EVotingAttachment() {
    const router = useRouter();
    const pathname = usePathname();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [votingResult, setVotingResult] = useState<EVoteResult>();
    const [inputValue, setInputValue] = useState('');
    const [isVoted, setIsVoted] = useState(false);

    const toastRef = useRef<Toast>(null);

    const { data: session } = useSession();

    const onSubmitHandler = async (value: string) => {
        try {
            const response = await axiosInstance.post('/api/e_vote_result', { ...votingResult, result: value });
            const { message } = response.data;

            if (response.status === 201) {
                setIsVoted(true);
                fetchVotingResult().catch(error => console.log(error));
                toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
            }
        } catch (error: any) {
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data.error, life: 3000 });
        }
    };

    const fetchUser = useCallback(async () => {
        try {
            if (session) {
                const response = await axiosInstance.get(`/api/user/search?user_code=${session?.user.user_code}`);
                const { data } = response.data;

                if (response.status === 200) {
                    setVotingResult(prevState => ({ ...prevState, user_id: data.user_id, user_code: data.user_code, username: data.username, user_rank: data.user_rank }) as EVoteResult);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [session]);

    useEffect(() => {
        fetchUser().catch(error => console.log(error));
    }, [fetchUser]);

    const fetchEVote = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/e_vote');
            const { data } = response.data;

            if (response.status === 200) {
                setVotingResult(prevState => ({ ...prevState, e_vote_id: data.e_vote_id }) as EVoteResult);
                setInputValue(data.description);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchEVote().catch(error => console.log(error));
    }, [fetchEVote]);

    const fetchVotingResult = useCallback(async () => {
        try {
            if (votingResult?.e_vote_id) {
                const response = await axiosInstance.get(`/api/e_vote_result?id=${votingResult?.e_vote_id}`);
                const { data } = response.data;

                if (response.status === 200) {
                    const existingVote = data.find((result: EVoteResult) => result.user_id === votingResult.user_id);

                    if (existingVote) {
                        setIsVoted(true);
                    }

                    const support = data.filter((result: EVoteResult) => result.result === 'support');

                    const neutral = data.filter((result: EVoteResult) => result.result === 'neutral');

                    const notSupport = data.filter((result: EVoteResult) => result.result === 'not_support');

                    const chartData = {
                        labels: ['ထောက်ခံပါသည်', 'ကြားနေ', 'မထောက်ခံပါ'],
                        datasets: [
                            {
                                label: 'Voting Result',
                                data: [support.length, neutral.length, notSupport.length],
                                backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                                borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                                borderWidth: 1
                            }
                        ]
                    };
                    const options = {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    };

                    setChartData(chartData);
                    setChartOptions(options);
                }
            }
        } catch (error) {}
    }, [votingResult?.e_vote_id, votingResult?.user_id]);

    useEffect(() => {
        fetchVotingResult().catch(error => console.log(error));
    }, [fetchVotingResult]);

    return (
        <div>
            <Toast ref={toastRef} />

            <div className='mb-6'>
                <Button
                    icon='pi pi-arrow-left'
                    rounded
                    onClick={() => router.back()}
                />
            </div>
            <div className='card'>
                <div className='p-fluid formgrid grid mb-6'>
                    <div className='field col-12'>
                        <label>မဲပေးသည့်အကြောင်းအရာ</label>
                        <InputTextarea
                            value={inputValue}
                            autoResize
                            style={{ maxHeight: '10rem', minHeight: '10rem' }}
                            readOnly
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <Button
                            label='ဖိုင်များအားကြည့်ရန်'
                            onClick={() => router.push(`${pathname}/${votingResult?.e_vote_id}/attachment`)}
                        />
                    </div>

                    <div className='field col-12 md:col-6'>
                        <Button
                            label='အကြံပြုချက်ထည့်သွင်းရန်'
                            disabled={!isVoted}
                            onClick={() => router.push(`${pathname}/${votingResult?.e_vote_id}/comment`)}
                        />
                    </div>

                    {!isVoted && session?.user.type !== 'admin' && (
                        <div className='field col-12 flex gap-3'>
                            <Button
                                label='ထောက်ခံပါသည်'
                                onClick={() => onSubmitHandler('support')}
                            />
                            <Button
                                label='ကြားနေ'
                                severity='success'
                                onClick={() => onSubmitHandler('neutral')}
                            />
                            <Button
                                label='မထောက်ခံပါ'
                                severity='danger'
                                onClick={() => onSubmitHandler('not_support')}
                            />
                        </div>
                    )}
                </div>

                <Chart
                    type='bar'
                    data={chartData}
                    options={chartOptions}
                    className='col md:col-10 mx-auto'
                />
            </div>
        </div>
    );
}
