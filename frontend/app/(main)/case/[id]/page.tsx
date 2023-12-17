'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const cases = [
    {
        id: '1',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum sodales mi, non interdum nibh. Etiam est magna, suscipit a lacus at, scelerisque luctus ipsum. Aenean aliquam non dui nec pulvinar.',
        created_at: new Date()
    },
    {
        id: '2',
        desc: 'Donec ac efficitur enim. Sed sem erat, volutpat vel iaculis eget, egestas pellentesque quam. Quisque bibendum congue feugiat. Duis id turpis orci. Nullam dictum imperdiet elit, et pretium nisi semper sit amet. In id metus sapien. Vestibulum sit amet ligula in enim congue molestie.',
        created_at: new Date()
    },
    {
        id: '3',
        desc: 'Maecenas mattis rhoncus porttitor. Vivamus quis tincidunt libero, eu cursus ligula. Sed quis massa sit amet orci egestas congue et id odio. Etiam eleifend, diam vel ultricies ultrices, lorem orci blandit urna, id aliquet arcu quam vitae odio. In orci libero, euismod id dolor vel, vulputate tincidunt est.',
        created_at: new Date()
    },
    {
        id: '1',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum sodales mi, non interdum nibh. Etiam est magna, suscipit a lacus at, scelerisque luctus ipsum. Aenean aliquam non dui nec pulvinar.',
        created_at: new Date()
    }
];

const CaseById = () => {
    const { id } = useParams();

    const findedCase = cases.find(value => value.id === id);

    return (
        <div className='card cus-h-screen'>
            <div className='w-full flex justify-content-between'>
                <div className='text-xl text-800 font-bold'>
                    Case No : <span className='font-normal'>{findedCase?.id}</span>
                </div>

                {findedCase?.created_at && (
                    <div className='text-xl text-800 font-bold'>
                        Date : <span className='font-normal'>{new Date(findedCase?.created_at).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            <div className='my-5'>
                <div className='text-xl text-800 font-bold my-3'>
                    Desc : <span className='font-normal text-lg'>{findedCase?.desc}</span>
                </div>
            </div>
        </div>
    );
};

export default CaseById;
