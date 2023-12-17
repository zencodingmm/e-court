import React from 'react';
import AppMenuitem from '../AppMenuitem';
import { MenuProvider } from '../context/menucontext';
import { AppMenuItem } from '../../types/types';

const AppMenu = () => {
    const users = [
        { username: 'maung maung', id: 1, active: true },
        { username: 'aung aung', id: 2, active: true },
        { username: 'zaw zaw', id: 3, active: false },
        { username: 'kyaw kyaw', id: 4, active: false },
        { username: 'Hla Hla', id: 5, active: true },
        { username: 'Mya Mya', id: 6, active: false }
    ];

    const model: AppMenuItem[] = [
        {
            label: 'Chat Lists',
            items: users.map(user => ({ label: user.username, to: `/chat/${user.id}`, icon: 'p-overlay-badge', active: user.active, avatar: true }))
        }
    ];

    return (
        <MenuProvider>
            <ul className='layout-menu'>
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem
                            item={item}
                            root={true}
                            index={i}
                            key={item.label}
                        />
                    ) : (
                        <li className='menu-separator'></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
