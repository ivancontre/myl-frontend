import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Switch, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ColumnsType } from 'antd/lib/table';

import { MenuContext } from '../../../context/MenuContext';
import useHideMenu from '../../../hooks/useHideMenu';
import { resetCardUpdating, resetMySelection } from '../../../store/card/action';
import { User } from '../../../store/auth/types';
import { RootState } from '../../../store';
import { Deck } from '../../../store/deck/types';
import moment from 'moment';
import { startUpdateBoolenasUserAction } from '../../../store/auth/action';

const Users: FC = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    const { collapsedMenu } = useContext(MenuContext);

    useHideMenu(false, path, collapsedMenu);

    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const ref0 = useRef();
    const ref1 = useRef();
    const ref2 = useRef();

    const { users } = useSelector((state: RootState) => state.play);

    useEffect(() => {

        dispatch(resetCardUpdating());
        dispatch(resetMySelection());

    }, [dispatch]);

    const handleSearch = (selectedKeys: string, confirm: Function, dataIndex: string) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: Function) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string, ref: any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={ ref }
                    placeholder={`Buscar por ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => ref.current.select(), 100);
            }
        },
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
        ) : (
            text
        ),
    });

    const columns: ColumnsType<User> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '15%',
            ...getColumnSearchProps('id', ref0),
            sorter: (a: any, b: any) => { 
                if(a.id < b.id) { return -1; }
                if(a.id > b.id) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            fixed: 'left',
        },
        {
            title: 'Usuario',
            dataIndex: 'username',
            key: 'username',
            width: '10%',
            ...getColumnSearchProps('username', ref1),
            sorter: (a: any, b: any) => { 
                if(a.username < b.username) { return -1; }
                if(a.username > b.username) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            fixed: 'left',
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email',
            width: '15%',
            ...getColumnSearchProps('email', ref2),
            sorter: (a: any, b: any) => { 
                if(a.email < b.email) { return -1; }
                if(a.email > b.email) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Ult. vez online',
            dataIndex: 'lastTimeOnline',
            key: 'lastTimeOnline',
            width: '10%',
            render: (text, row) => {
                return !row.online && row.lastTimeOnline ? moment(row.lastTimeOnline).format('DD/MM/YY HH:mm') : (!row.lastTimeOnline ? 'Sin registros' : <Tag color="lime">Online</Tag>)
            }
        },
        {
            title: 'Ult. vez juego',
            dataIndex: 'lastTimePlaying',
            key: 'lastTimePlaying',
            width: '10%',
            render: (text, row) => {
                return !row.playing && row.lastTimePlaying ? moment(row.lastTimePlaying).format('DD/MM/YY HH:mm') : (!row.lastTimePlaying ? 'Sin registros' : <Tag color="lime">Jugando</Tag>)
            }
        },
        {
            title: 'Mazo por defecto',
            dataIndex: 'decks',
            key: 'decks',
            width: '10%',
            render: (text, row) => {

                const defaultDeck = row.decks?.find((deck: Deck) => deck.byDefault === true);

                return defaultDeck ? <Tag color="lime">Sí</Tag> : <Tag color="magneta">No</Tag>
            }
        },
        {
            title: 'Online',
            dataIndex: 'online',
            key: 'online',
            width: '5%',
            sorter: (a: any, b: any) => { 
                if(a.online < b.online) { return -1; }
                if(a.online > b.online) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => {
                return <Switch checkedChildren="Sí" unCheckedChildren="No" checked={row.online} onChange={ (checked: boolean) => dispatch(startUpdateBoolenasUserAction(row.id, row.username, 'online', checked))} />  
            }
        },
        {
            title: 'Playing',
            dataIndex: 'playing',
            key: 'playing',
            width: '5%',
            sorter: (a: any, b: any) => { 
                if(a.playing < b.playing) { return -1; }
                if(a.playing > b.playing) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => {
                return <Switch checkedChildren="Sí" unCheckedChildren="No" checked={row.playing} onChange={ (checked: boolean) => dispatch(startUpdateBoolenasUserAction(row.id, row.username, 'playing', checked))} />  
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '5%',
            sorter: (a: any, b: any) => { 
                if(a.status < b.status) { return -1; }
                if(a.status > b.status) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => {
                return <Switch checkedChildren="Sí" unCheckedChildren="No" checked={row.status} onChange={ (checked: boolean) => dispatch(startUpdateBoolenasUserAction(row.id, row.username, 'status', checked))} /> 
            }
        },
        {
            title: 'Verify',
            dataIndex: 'verify',
            key: 'verify',
            width: '5%',
            sorter: (a: any, b: any) => { 
                if(a.verify < b.verify) { return -1; }
                if(a.verify > b.verify) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => {
                return <Switch checkedChildren="Sí" unCheckedChildren="No" checked={row.verify} onChange={ (checked: boolean) => dispatch(startUpdateBoolenasUserAction(row.id, row.username, 'verify', checked))} /> 
            }
        },
        {
            title: 'Acciones',
            dataIndex: '',
            key: 'x',
            width: '15%',
            render: (text, row) => {

                return <>
                    {!row.verify && <Button style={{fontSize: 11}} type="link">Reenviar correo verificación</Button> }
                    
                    <Button style={{fontSize: 11}} type="link">Recuperar contraseña</Button>
                    <Button style={{fontSize: 11}} type="link">Eliminar permanentemente</Button>
                </>
            },
            fixed: 'right',
        },
    ];

    return (
        <div>
            <Table<User>
                 scroll={{ x: 1500 }}
                 pagination={{ defaultPageSize: 50 }}
                 rowKey="id" 
                 columns={ columns } 
                 dataSource={ users as User[] } 
                 style={{ paddingTop: 10 }}
                 loading={ users === null ? true : false }
                 size="small"
                  sticky
             />
        </div>
    )
}

export default Users;