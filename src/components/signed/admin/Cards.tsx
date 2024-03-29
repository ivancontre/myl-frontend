import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { Button, Input, Popconfirm, Space, Tooltip, Table, Tag } from 'antd';

import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ColumnsType } from 'antd/es/table';

import { useHistory, useLocation } from 'react-router';
import useHideMenu from '../../../hooks/useHideMenu';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../store/card/types';
import { RootState } from '../../../store';
import { resetCardUpdating, resetMySelection, startDeleteCard, startLoadCard } from '../../../store/card/action';
import { Link } from 'react-router-dom';
import { MenuContext } from '../../../context/MenuContext';

const Cards: FC = () => {

    const history = useHistory();

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    const { collapsedMenu } = useContext(MenuContext);

    useHideMenu(false, path, collapsedMenu);

    const dispatch = useDispatch();

    const { cards } = useSelector((state: RootState) => state.cards);
    const { eras, editions, types, races, frecuencies } = useSelector((state: RootState) => state.description);

    useEffect(() => {
        
        dispatch(resetCardUpdating());
        dispatch(resetMySelection());
        dispatch(startLoadCard());

    }, [dispatch]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleSearch = (selectedKeys: string, confirm: Function, dataIndex: string) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: Function) => {
        clearFilters();
        setSearchText('');
    };

    const handleDelete = (id?: string) => {
        dispatch(startDeleteCard(id as string));
    };

    const ref0 = useRef();
    const ref1 = useRef();

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

    const columns: ColumnsType<Card> = [
        {
            title: 'N°',
            dataIndex: 'num',
            key: 'num',
            width: '5%',
            ...getColumnSearchProps('num', ref0),
            sorter: (a: Card, b: Card) => {
                let newA = a.num;
                let newB = b.num;

                if (!a.num) newA = 0;
                if (!b.num) newB = 0;

                return newA - newB;
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name', ref1),
            sorter: (a: Card, b: Card) => { 
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            },
            sortDirections: ['descend', 'ascend'],
            render: (text, row) => <Link to={`/cards/${row.id}/edit`}>{ text }</Link>           
            
        },
        {
            title: 'Era',
            dataIndex: 'era',
            key: 'era',
            width: '20%',
            sortDirections: ['descend', 'ascend'],
            sorter: (a: any, b: any) => { 
                if(a.era < b.era) { return -1; }
                if(a.era > b.era) { return 1; }
                return 0;
            },
            filters: eras.map(e => {
                return {
                    text: e.name,
                    value: e.name
                }
            }),
            onFilter: (text, row) => row.era?.indexOf(text as string) === 0,
        },
        {
            title: 'Edición',
            dataIndex: 'edition',
            key: 'edition',
            width: '20%',
            sortDirections: ['descend', 'ascend'],
            sorter: (a: Card, b: Card) => { 
                if(a.edition < b.edition) { return -1; }
                if(a.edition > b.edition) { return 1; }
                return 0;
            },
            filters: editions.map(e => {
                return {
                    text: e.name,
                    value: e.name
                }
            }),
            onFilter: (text, row) => row.edition?.indexOf(text as string) === 0,
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
            sortDirections: ['descend', 'ascend'],
            sorter: (a: Card, b: Card) => { 
                if(a.type < b.type) { return -1; }
                if(a.type > b.type) { return 1; }
                return 0;
            },
            filters: types.map(e => {
                return {
                    text: e.name,
                    value: e.name
                }
            }),
            onFilter: (text, row) => row.type?.indexOf(text as string) === 0,
        },
        {
            title: 'Raza',
            dataIndex: 'race',
            key: 'race',
            width: '20%',
            sortDirections: ['descend', 'ascend'],
            sorter: (a: any, b: any) => { 
                if(a.race < b.race) { return -1; }
                if(a.race > b.race) { return 1; }
                return 0;
            },
            filters: races.map(r => {
                return {
                    text: r.name,
                    value: r.name
                }
            }),
            onFilter: (text, row) => row.race?.indexOf(text as string) === 0,
        },
        {
            title: 'Frecuencia',
            dataIndex: 'frecuency',
            key: 'frecuency',
            sortDirections: ['descend', 'ascend'],
            sorter: (a: any, b: any) => { 
                if(a.frecuency < b.frecuency) { return -1; }
                if(a.frecuency > b.frecuency) { return 1; }
                return 0;
            },
            filters: frecuencies.map(f => {
                return {
                    text: f.name,
                    value: f.name
                }
            }),
            onFilter: (text, row) => row.frecuency?.indexOf(text as string) === 0,
            
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (text, row) => (
                <Popconfirm title="¿Está seguro?" onConfirm={() => handleDelete(row.id)}>
                    <Link to="">Eliminar</Link>     
                </Popconfirm>
            ),
        },
    ];

    const addNewCard = () => {
        history.push(`/cards/new`);
        // let cont = 0;
        // for (const card of cards) {
        //     if (card.edition === 'Katana') {
        //         handleDelete(card.id)
        //     }
        // }
    };

    /*const hola = async () => {
        const axios = require('axios').default;
        const cardsFiltered = cards.filter(card => card.edition === 'Compendium' )
        console.log(cardsFiltered)
        for(const card of cardsFiltered){
            let image = await axios.get(card.img, {responseType: 'blob'});

            let blob = new Blob(
                [image.data], 
                { type: image.headers['content-type'] }
              )
            let formData = new FormData();
            formData.append('files[]', blob);
            formData.append('id', card.id as string);
            formData.append('edition', card.edition as string);
            await axios({
                method: 'patch',
                data: formData,
                url: 'http://localhost:8080/api/card',
                headers: {
                    "x-token": localStorage.getItem('token') as string,
                    "Content-Type": "multipart/form-data"
                }

            });



        }
    }*/
    return (
        <>
            <Tooltip title="Agregar carta">
                <Button onClick={ addNewCard } type="primary" shape="circle" icon={<PlusOutlined />} />
                {/* <Button onClick={ hola } type="primary" shape="circle" >hola</Button> */}
            </Tooltip>

            <p style={{ paddingTop: 20}}><Tag color="green">{ `Total: ${cards.length}`}</Tag></p>
            

            <Table<Card>
                pagination={{ defaultPageSize: 15 }}
                rowKey="id" 
                scroll={{ x: 200 }}
                columns={ columns } 
                dataSource={ cards } 
                style={{ paddingTop: 10 }}
                loading={ cards.length > 0 ? false : true }
            />
        </>
    )
}

export default Cards;