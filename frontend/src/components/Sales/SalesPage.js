import React, { useState, useEffect } from 'react';
import { Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getSales, deleteSale, getHumans, getProducts, getOutlets, getStaff, getHumanById } from '../../services/api';

export default function SalesPage() {
    const [sales, setSales] = useState([]);
    const [humans, setHumans] = useState({});
    const [products, setProducts] = useState({});
    const [outlets, setOutlets] = useState({});
    const [staff, setStaff] = useState({});
    const [staffNames, setStaffNames] = useState({});
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
            const [humansResponse, productsResponse, outletsResponse, staffResponse] = await Promise.all([
                getHumans(),
                getProducts(),
                getOutlets(),
                getStaff()
            ]);
            setHumans(humansResponse.data.reduce((acc, human) => ({ ...acc, [human.id]: human }), {}));
            setProducts(productsResponse.data.reduce((acc, product) => ({ ...acc, [product.id]: product }), {}));
            setOutlets(outletsResponse.data.reduce((acc, outlet) => ({ ...acc, [outlet.id]: outlet }), {}));
            setStaff(staffResponse.data.reduce((acc, staffMember) => ({ ...acc, [staffMember.id]: staffMember }), {}));

            // Fetch human names for staff members
            const staffNamesTemp = {};
            const uniqueHumans = new Set(staffResponse.data.map(staffMember => staffMember.human_id));
            await Promise.all([...uniqueHumans].map(async humanId => {
                const humanResponse = await getHumanById(humanId);
                staffResponse.data.forEach(staffMember => {
                    if (staffMember.human_id === humanId) {
                        staffNamesTemp[staffMember.id] = humanResponse.data.name;
                    }
                });
            }));
            setStaffNames(staffNamesTemp);
        } catch (error) {
            console.error('Failed to fetch lists', error);
        }
    };

    const init = (page) => {
        getSales()
            .then(response => {
                const start = (page - 1) * recordPerPage;
                const end = start + recordPerPage;
                setSales(response.data.slice(start, end));
                setTotalPages(Math.ceil(response.data.length / recordPerPage));
                setTotalElements(response.data.length);
                setCurrentPage(page);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDelete = (id) => {
        deleteSale(id)
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
            <h2>Sales</h2>
            <Button onClick={() => setShowTable(!showTable)} className="btn btn-dark mb-2">
                {showTable ? 'Hide Table' : 'Show Table'}
            </Button>
            {showTable && (
                <div className="table-container">
                    <Link to="/sales/add" className="btn btn-dark mb-2">Add Sale</Link>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Human</th>
                            <th>Product</th>
                            <th>Outlet</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Staff</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sales.map(sale => (
                            <tr key={sale.id}>
                                <td>{sale.id}</td>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, humans[sale.human_id])}
                                >
                                    <td>{humans[sale.human_id]?.name}</td>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, products[sale.product_id])}
                                >
                                    <td>{products[sale.product_id]?.name}</td>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, outlets[sale.outlet_id])}
                                >
                                    <td>{outlets[sale.outlet_id]?.name}</td>
                                </OverlayTrigger>
                                <td>{sale.date}</td>
                                <td>{sale.price}</td>
                                <td>{sale.quantity}</td>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, humans[staff[sale.staff_id]?.human_id])}
                                >
                                    <td>{staffNames[sale.staff_id]}</td>
                                </OverlayTrigger>
                                <td>
                                    <Link to={`/sales/edit/${sale.id}`} className="btn btn-danger">Edit</Link>
                                    <Button onClick={() => handleDelete(sale.id)} className="btn btn-danger" style={{ marginLeft: 10 }}>Delete</Button>
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
