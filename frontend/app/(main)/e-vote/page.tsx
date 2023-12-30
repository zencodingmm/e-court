'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Chart } from 'primereact/chart';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

export default function EVoteReport() {
    const router = useRouter();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
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

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div>
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
                            autoResize
                            style={{ maxHeight: '10rem', minHeight: '10rem' }}
                        />
                    </div>

                    <div className='flex-1 flex gap-3'>
                        <Button label='ထောက်ခံပါသည်' />
                        <Button
                            label='မထောက်ခံပါ'
                            severity='danger'
                        />
                    </div>
                </div>

                <Chart
                    type='bar'
                    data={chartData}
                    options={chartOptions}
                />
            </div>
        </div>
    );
}