'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EDocument, EVote, User } from '../../types/ecourt';
import axiosInstance from '../../utils/axiosInstance';
import { useSession } from 'next-auth/react';

const items = [
    { title: 'Lib', link: '', key: 'e_lib_link' },
    { title: 'Case Flow', link: '', key: 'case_flow_link' },
    { title: 'Live Streaming', link: '', key: 'live_streaming_link' },
    { title: 'Other-1', link: '', key: 'other_1' },
    { title: 'Other-2', link: '', key: 'other_2' },
    { title: 'E-Vote', link: 'e-vote' }
];

const Dashboard = () => {
    const [cases, setCases] = useState<EDocument[] | undefined>(undefined);
    const [links, setLinks] = useState<any[] | []>([]);
    const [vote, setVote] = useState<EVote | undefined>();
    const { data: session } = useSession();
    const [userData, setUserData] = useState<User | undefined>();

    const fetchLink = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/setting');
            const { data } = response.data;

            if (response.status === 200) {
                if (data) {
                    const result = Object.keys(data).map(keys => {
                        const findItem = items.find(item => item.key === keys);
                        return { ...findItem, link: data[keys] };
                    });

                    setLinks(result);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchLink().catch(error => console.log(error));
    }, [fetchLink]);

    const fetchVote = useCallback(async () => {
        const response = await axiosInstance.get('/api/e_vote');
        const { data } = response.data;

        if (response.status === 200) {
            setVote(data);
        }
    }, []);

    useEffect(() => {
        fetchVote().catch(error => console.log(error));
    }, [fetchVote]);

    const fetchCase = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/e_doc');
            const { data } = response.data;

            if (response.status === 200) {
                setCases(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchCase().catch(error => console.log(error));
    }, [fetchCase]);

    const fetchUser = useCallback(async () => {
        try {
            if (session) {
                const response = await axiosInstance.get(`/api/user/search?user_code=${session?.user.user_code}`);
                const { data } = response.data;

                if (response.status === 200) {
                    setUserData(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [session]);

    useEffect(() => {
        fetchUser().catch(error => console.log(error));
    }, [fetchUser]);

    const profileTemplate = () => {
        if (userData?.user_image === undefined) {
            return (
                <Image
                    src='/assets/images/user-profile.jpg'
                    alt='user profile'
                    style={{ objectFit: 'cover' }}
                    className='w-full h-full'
                    width={1920}
                    height={1080}
                    priority={true}
                />
            );
        }

        if (userData.user_image?.objectURL) {
            return (
                <Image
                    src={userData.user_image.objectURL}
                    alt='user profile'
                    style={{ objectFit: 'cover' }}
                    className='w-full h-full'
                    width={1920}
                    height={1080}
                    priority={true}
                />
            );
        }

        if (typeof userData.user_image === 'string') {
            return (
                <Image
                    src={`${process.env.NEXT_PUBLIC_USERS_URL}/${userData.user_image}`}
                    alt='user profile'
                    style={{ objectFit: 'cover' }}
                    className='w-full h-full'
                    width={1920}
                    height={1080}
                    priority={true}
                />
            );
        }
    };

    return (
        <div className='card flex flex-column align-items-center'>
            <div className='w-10rem h-10rem border-3 border-circle overflow-hidden relative my-3'>{profileTemplate()}</div>

            <div className='w-full flex flex-column justify-content-center align-items-center gap-3 my-4'>
                <span className='font-bold text-xl'>
                    No : <span className='font-medium'>{userData?.user_code}</span>
                </span>
                <span className='font-bold text-xl'>
                    အဖွဲ့ဝင် - <span className='font-medium'>{userData?.type}</span>
                </span>
            </div>

            <div className='w-full grid border-top-2 border-bottom-2 py-5 lg:px-5'>
                {links.map(
                    item =>
                        item.link !== null && (
                            <div
                                className='col-4'
                                key={item.title}
                            >
                                <Link
                                    href={item.link}
                                    className='p-card p-5 cursor-pointer hover:surface-200 flex
                        justify-content-center align-items-center shadow-4'
                                    target='_blank'
                                >
                                    <span className='text-lg text-center text-900 font-bold'>{item.title}</span>
                                </Link>
                            </div>
                        )
                )}
                {vote && (
                    <div className='col-4'>
                        <Link
                            href='e-vote'
                            className='p-card p-5 cursor-pointer hover:surface-200 flex
                        justify-content-center align-items-center shadow-4'
                        >
                            <span className='text-lg text-center text-900 font-bold'>E-Vote</span>
                        </Link>
                    </div>
                )}
            </div>

            <div className='flex-1 grid py-5 lg:px-5'>
                {cases &&
                    cases.map(value => (
                        <div
                            className='col-6'
                            key={value.case_id}
                        >
                            <Link
                                className='block p-card p-5 cursor-pointer hover:surface-200 shadow-4'
                                href={`/case/${value.case_id}`}
                            >
                                <h1
                                    className='text-xl font-bold border-bottom-1 pb-2'
                                    style={{ borderBottomStyle: 'dashed' }}
                                >
                                    <span className='pi pi-fw pi-book'></span> Case No : <span>{value.case_no}</span>
                                </h1>
                                <p className='text-lg'>{value.description_of_submittion}</p>
                                <span className='text-gray-600'>{value.created_at && new Date(value.created_at).toLocaleDateString()}</span>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Dashboard;
