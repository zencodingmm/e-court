'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Chart } from 'primereact/chart';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

import axiosInstance from '../../../../../utils/axiosInstance';
import { EVoteResult } from '../../../../../types/ecourt';

export default function EVoteReport() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [votingResult, setVotingResult] = useState<EVoteResult>();
    const [inputValue, setInputValue] = useState('');

    const toastRef = useRef<Toast>(null);

    const fetchEVote = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/e_vote');
            const { data } = response.data;

            if (response.status === 200) {
                if (data) {
                    setVotingResult(prevState => ({ ...prevState, e_vote_id: data.e_vote_id }) as EVoteResult);
                    setInputValue(data.description);
                }
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
            } else {
                const chartData = {
                    labels: ['ထောက်ခံပါသည်', 'ကြားနေ', 'မထောက်ခံပါ'],
                    datasets: [
                        {
                            label: 'Voting Result',
                            data: [0, 0, 0],
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
        } catch (error) {}
    }, [votingResult?.e_vote_id]);

    useEffect(() => {
        fetchVotingResult().catch(error => console.log(error));
    }, [fetchVotingResult]);

    return (
        <div>
            <Toast ref={toastRef} />

            <h1 className='text-2xl underline mb-6'>Voting Result</h1>

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
