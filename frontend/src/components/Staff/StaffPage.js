import React, { useState, useEffect } from 'react';
import { Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getStaff, deleteStaff, getJobTypes, getHumans, getOutlets, getHumanById } from '../../services/api';

export default function StaffPage() {
    const [staff, setStaff] = useState([]);
    const [jobTypes, setJobTypes] = useState({});
    const [humans, setHumans] = useState({});
    const [outlets, setOutlets] = useState({});
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
            const [jobTypesResponse, humansResponse, outletsResponse, staffResponse] = await Promise.all([
                getJobTypes(),
                getHumans(),
                getOutlets(),
                getStaff()
            ]);
            setJobTypes(jobTypesResponse.data.reduce((acc, jobType) => ({ ...acc, [jobType.id]: jobType }), {}));
            setHumans(humansResponse.data.reduce((acc, human) => ({ ...acc, [human.id]: human }), {}));
            setOutlets(outletsResponse.data.reduce((acc, outlet) => ({ ...acc, [outlet.id]: outlet }), {}));
            setStaff(staffResponse.data || []);
        } catch (error) {
            console.error('Failed to fetch lists', error);
        }
    };

    const init = (page) => {
        getStaff()
            .then(response => {
                const start = (page - 1) * recordPerPage;
                const end = start + recordPerPage;
                setStaff(response.data.slice(start, end) || []);
                setTotalPages(Math.ceil(response.data.length / recordPerPage));
                setTotalElements(response.data.length);
                setCurrentPage(page);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleDelete = (id) => {
        deleteStaff(id)
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
            <h2>Staff</h2>
            <Button onClick={() => setShowTable(!showTable)} className="btn btn-dark mb-2">
                {showTable ? 'Hide Table' : 'Show Table'}
            </Button>
            {showTable && (
                <div className="table-container">
                    <Link to="/staff/add" className="btn btn-dark mb-2">Add Staff Member</Link>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Job Type</th>
                            <th>Human</th>
                            <th>Outlet</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(staff) && staff.length > 0 && staff.map(member => (
                            <tr key={member.id}>
                                <td>{member.id}</td>
                                <OverlayTrigger
                                    placement="auto"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, jobTypes[member.job_type_id])}
                                    popperConfig={{
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                options: {
                                                    fallbackPlacements: ['top', 'bottom', 'left', 'right'],
                                                },
                                            },
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    boundary: 'viewport',
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    <td>{jobTypes[member.job_type_id]?.name}</td>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="auto"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, humans[member.human_id])}
                                    popperConfig={{
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                options: {
                                                    fallbackPlacements: ['top', 'bottom', 'left', 'right'],
                                                },
                                            },
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    boundary: 'viewport',
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    <td>{humans[member.human_id]?.name}</td>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    placement="auto"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, outlets[member.outlet_id])}
                                    popperConfig={{
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                options: {
                                                    fallbackPlacements: ['top', 'bottom', 'left', 'right'],
                                                },
                                            },
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    boundary: 'viewport',
                                                },
                                            },
                                        ],
                                    }}
                                >
                                    <td>{outlets[member.outlet_id]?.name}</td>
                                </OverlayTrigger>
                                <td>{member.salary}</td>
                                <td>
                                    <Link to={`/staff/edit/${member.id}`} className="btn btn-danger">Edit</Link>
                                    <Button onClick={() => handleDelete(member.id)} className="btn btn-danger" style={{ marginLeft: 10 }}>Delete</Button>
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
