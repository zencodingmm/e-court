'use client';

import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

export default function EVoteReport() {
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
            <h1 className='text-2xl underline mb-6'>မဲစာရင်း/အဖြေများ</h1>

            <div className='card'>
                <div className='mb-6 flex-1 flex justify-content-end'>
                    <Button
                        label='Print ထုတ်ယူရန်'
                        icon='pi pi-print'
                    />
                </div>
                <div className='p-fluid formgrid grid mb-6'>
                    <div className='field col-12'>
                        <label>မဲပေးသည့်အကြောင်းအရာ</label>
                        <InputTextarea
                            autoResize
                            style={{ maxHeight: '10rem', minHeight: '10rem' }}
                        />
                    </div>
                </div>

                <Chart
                    className='col-10 mx-auto'
                    type='bar'
                    data={chartData}
                    options={chartOptions}
                />
            </div>
        </div>
    );
}
