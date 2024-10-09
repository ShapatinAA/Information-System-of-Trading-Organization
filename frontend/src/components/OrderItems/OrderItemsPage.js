import React, { useState, useEffect } from 'react';
import { Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getOrderItems, deleteOrderItem, getProducts, getSuppliers, getRequests } from '../../services/api';

export default function OrderItemsPage() {
    const [orderItems, setOrderItems] = useState([]);
    const [products, setProducts] = useState({});
    const [suppliers, setSuppliers] = useState({});
    const [requests, setRequests] = useState({});
    const [showTable, setShowTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const recordPerPage = 5;

    useEffect(() => {
        fetchLists();
        init(currentPage);
    }, [currentPage]);

    const fetchLists = async () => {
        try {
            const [productsResponse, suppliersResponse, requestsResponse] = await Promise.all([
                getProducts(),
                getSuppliers(),
                getRequests()
            ]);

            setProducts(productsResponse.data.reduce((acc, product) => ({ ...acc, [product.id]: product }), {}));
            setSuppliers(suppliersResponse.data.reduce((acc, supplier) => ({ ...acc, [supplier.id]: supplier }), {}));
            setRequests(requestsResponse.data.reduce((acc, request) => ({ ...acc, [request.id]: request }), {}));
        } catch (error) {
            console.error('Failed to fetch lists', error);
        }
    };

    const init = (page) => {
        getOrderItems()
            .then(response => {
                const start = (page - 1) * recordPerPage;
                const end = start + recordPerPage;
                setOrderItems(response.data.slice(start, end));
                setTotalPages(Math.ceil(response.data.length / recordPerPage));
                setTotalElements(response.data.length);
                setCurrentPage(page);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDelete = (id) => {
        deleteOrderItem(id)
            .then(() => {
                init(currentPage);
            })
            .catch(error => {
                console.log('Something went wrong', error);
            });
    };

    const showNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const showLastPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(totalPages);
        }
    };

    const showFirstPage = () => {
        if (currentPage > 1) {
            setCurrentPage(1);
        }
    };

    const showPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderTooltip = (props, obj) => (
        <Tooltip id="button-tooltip" {...props}>
            <Table striped bordered hover variant="dark" size="sm">
                <tbody>
                {obj ? Object.entries(obj).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                    </tr>
                )) : <tr><td colSpan="2">No data available</td></tr>}
                </tbody>
            </Table>
        </Tooltip>
    );

    return (
        <div>
            <h2>Order Items</h2>
            <Button onClick={() => setShowTable(!showTable)} className="btn btn-dark mb-2">
                {showTable ? 'Hide Table' : 'Show Table'}
            </Button>
            {showTable && (
                <div className="table-container">
                    <Link to="/order_items/add" className="btn btn-dark mb-2">Add Order Item</Link>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Supplier</th>
                            <th>Request</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderItems.map(orderItem => (
                            <tr key={orderItem.id}>
                                <td>{orderItem.id}</td>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, products[orderItem.product_id])}
                                >
                                    <td>{products[orderItem.product_id]?.name}</td>
                                </OverlayTrigger>
                                <td>{orderItem.quantity}</td>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, suppliers[orderItem.supplier_id])}
                                >
                                    <td>{suppliers[orderItem.supplier_id]?.name}</td>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, requests[orderItem.request_id])}
                                >
                                    <td>{requests[orderItem.request_id]?.id}</td>
                                </OverlayTrigger>
                                <td>{orderItem.date}</td>
                                <td>
                                    <Link to={`/order_items/edit/${orderItem.id}`} className="btn btn-danger">Edit</Link>
                                    <Button onClick={() => handleDelete(orderItem.id)} className="btn btn-danger" style={{ marginLeft: 10 }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div className="pagination-block">
                        <div style={{ float: 'left', color: '#D10000' }}>
                            Page {currentPage} of {totalPages}
                        </div>
                        <div style={{ float: 'right' }}>
                            <nav>
                                <ul className="pagination">
                                    <li className="page-item">
                                        <button className="page-link" disabled={currentPage === 1} onClick={showFirstPage}>First</button>
                                    </li>
                                    <li className="page-item">
                                        <button className="page-link" disabled={currentPage === 1} onClick={showPrevPage}>Previous</button>
                                    </li>
                                    <li className="page-item">
                                        <button className="page-link" disabled={currentPage === totalPages} onClick={showNextPage}>Next</button>
                                    </li>
                                    <li className="page-item">
                                        <button className="page-link" disabled={currentPage === totalPages} onClick={showLastPage}>Last</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}
