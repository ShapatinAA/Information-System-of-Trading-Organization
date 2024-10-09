import React, { useState, useEffect } from 'react';
import { Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getOutlets, deleteOutlet, getTypesOfTradingPlaces, getTypesOfHalls } from '../../services/api';

export default function OutletsPage() {
    const [outlets, setOutlets] = useState([]);
    const [types, setTypes] = useState({});
    const [halls, setHalls] = useState({});
    const [showTable, setShowTable] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const recordPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        fetchLists();
        init(currentPage);
    }, [currentPage]);

    const fetchLists = async () => {
        try {
            const [typesResponse, hallsResponse] = await Promise.all([
                getTypesOfTradingPlaces(),
                getTypesOfHalls()
            ]);
            setTypes(typesResponse.data.reduce((acc, type) => ({ ...acc, [type.id]: type }), {}));
            setHalls(hallsResponse.data.reduce((acc, hall) => ({ ...acc, [hall.id]: hall }), {}));
        } catch (error) {
            console.error('Failed to fetch lists', error);
        }
    };

    const init = (page) => {
        getOutlets()
            .then(response => {
                const start = (page - 1) * recordPerPage;
                const end = start + recordPerPage;
                setOutlets(response.data.slice(start, end));
                setTotalPages(Math.ceil(response.data.length / recordPerPage));
                setTotalElements(response.data.length);
                setCurrentPage(page);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDelete = (id) => {
        deleteOutlet(id)
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
                {Object.entries(obj).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Tooltip>
    );

    return (
        <div>
            <h2>Outlets</h2>
            <Button onClick={() => setShowTable(!showTable)} className="btn btn-dark mb-2">
                {showTable ? 'Hide Table' : 'Show Table'}
            </Button>
            {showTable && (
                <div className="table-container">
                    <Link to="/outlets/add" className="btn btn-dark mb-2">Add Outlet</Link>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Hall</th>
                            <th>Size</th>
                            <th>Rent & Utility Payments</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {outlets.map(outlet => (
                            <tr key={outlet.id}>
                                <td>{outlet.id}</td>
                                <td>{outlet.name}</td>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, types[outlet.type_id])}
                                >
                                    <td>{types[outlet.type_id]?.name}</td>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, halls[outlet.hall_id])}
                                >
                                    <td>{halls[outlet.hall_id]?.name}</td>
                                </OverlayTrigger>
                                <td>{outlet.size}</td>
                                <td>{outlet.rent_and_utility_payments}</td>
                                <td>
                                    <Link to={`/outlets/edit/${outlet.id}`} className="btn btn-danger">Edit</Link>
                                    <Button onClick={() => handleDelete(outlet.id)} className="btn btn-danger" style={{ marginLeft: 10 }}>Delete</Button>
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
