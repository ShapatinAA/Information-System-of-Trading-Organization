import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getTypesOfTradingPlaces, deleteTypeOfTradingPlace } from '../../services/api';

export default function TypesOfTradingPlacesPage() {
    const [types, setTypes] = useState([]);
    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const response = await getTypesOfTradingPlaces();
            setTypes(response.data);
        } catch (error) {
            console.error('Failed to fetch types of trading places', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTypeOfTradingPlace(id);
            fetchTypes();
        } catch (error) {
            console.error('Failed to delete type of trading place', error);
        }
    };

    return (
        <div>
            <h2>Types of Trading Places</h2>
            <Button onClick={() => setShowTable(!showTable)} className="btn btn-dark mb-2">
                {showTable ? 'Hide Table' : 'Show Table'}
            </Button>
            {showTable && (
                <div className="table-container">
                    <Link to="/types_of_trading_places/add" className="btn btn-dark mb-2">Add Type of Trading Place</Link>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {types.map(type => (
                            <tr key={type.id}>
                                <td>{type.id}</td>
                                <td>{type.name}</td>
                                <td>
                                    <Link to={`/types_of_trading_places/edit/${type.id}`} className="btn btn-danger">Edit</Link>
                                    <Button onClick={() => handleDelete(type.id)} className="btn btn-danger" style={{ marginLeft: 10 }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}
