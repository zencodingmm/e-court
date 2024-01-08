/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { ChildContainerProps } from '../types/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AuthLayout = ({ children }: ChildContainerProps) => {
    const router = useRouter();

    const { status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/auth/login');
        }
    }, [status]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default AuthLayout;
