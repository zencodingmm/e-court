import React from 'react';

import Image from 'next/image';

enum FileType {
    image = 'image',
    pdf = 'pdf',
    video = 'video'
}

interface DialogViewProps {
    url: string;
    filetype: string;
}

export default function DialogView({ url, filetype }: DialogViewProps) {
    if (filetype.includes(FileType.image)) {
        return (
            <Image
                src={url}
                alt={url}
                className='w-full'
                width={1920}
                height={1080}
                priority
            />
        );
    }

    if (filetype.includes(FileType.pdf)) {
        return (
            <iframe
                src={url}
                className='w-full h-full'
            />
        );
    }

    if (filetype.includes(FileType.video)) {
        return (
            <video
                src={url}
                className='w-full h-full'
                autoPlay
                controls
            />
        );
    }

    return null;
}
