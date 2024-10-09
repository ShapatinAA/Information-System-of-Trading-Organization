import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { getItemsByOutlet, getOutlets } from '../../services/api';
import './ItemsByOutlet.css';

const ItemsByOutlet = () => {
    const [outlets, setOutlets] = useState([]);
    const [selectedOutlet, setSelectedOutlet] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchOutlets();
    }, []);

    const fetchOutlets = async () => {
        try {
            const response = await getOutlets();
            setOutlets(response.data);
        } catch (error) {
            console.error('Failed to fetch outlets', error);
        }
    };

    const handleChange = (e) => {
        setSelectedOutlet(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchItems();
    };

    const fetchItems = async () => {
        try {
            const response = await getItemsByOutlet(selectedOutlet);
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    return (
        <div className="container-fluid items-container">
            <h3>Items By Outlet</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Outlet:</label>
                    <select
                        name="outlet_id"
                        value={selectedOutlet}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Outlet</option>
                        {outlets.map(outlet => (
                            <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" className="btn btn-dark mt-2">Search</Button>
            </Form>
            {items.length > 0 ? (
                <Table striped bordered hover variant="dark" className="mt-2">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            ) : <p>No items found for the selected outlet.</p>}
        </div>
    );
};

export default ItemsByOutlet;
