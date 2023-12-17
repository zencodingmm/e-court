import React from 'react';
import AppMenuitem from '../AppMenuitem';
import { MenuProvider } from '../context/menucontext';
import { AppMenuItem } from '../../types/types';

const AppMenu = () => {
    const users = [
        { username: 'maung maung', id: 1 },
        { username: 'aung aung', id: 2 },
        { username: 'zaw zaw', id: 3 },
        { username: 'kyaw kyaw', id: 4 },
        { username: 'Hla Hla', id: 5 },
        { username: 'Mya Mya', id: 6 }
    ];

    const model: AppMenuItem[] = [
        {
            label: 'Chat Lists',
            items: users.map(user => ({ label: user.username, to: `/chat/${user.id}`, icon: 'pi pi-fw pi-user' }))
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
