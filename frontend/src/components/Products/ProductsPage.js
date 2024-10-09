import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/api';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    return (
        <div>
            <h2>Products</h2>
            <Button onClick={() => setShowTable(!showTable)} className="btn btn-dark mb-2">
                {showTable ? 'Hide Table' : 'Show Table'}
            </Button>
            {showTable && (
                <div className="table-container">
                    <Link to="/products/add" className="btn btn-dark mb-2">Add Product</Link>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>
                                    <Link to={`/products/edit/${product.id}`} className="btn btn-danger">Edit</Link>
                                    <Button onClick={() => handleDelete(product.id)} className="btn btn-danger" style={{ marginLeft: 10 }}>Delete</Button>
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