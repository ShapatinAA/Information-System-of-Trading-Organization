import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getStaffSalariesByCriteria, getOutlets, getTypesOfTradingPlaces, getStaff, getHumanById } from '../../services/api';
import './StaffSalariesByCriteria.css';

const StaffSalariesByCriteria = () => {
    const [criteria, setCriteria] = useState({
        outlet_id: '',
        type_id: ''
    });
    const [outlets, setOutlets] = useState({});
    const [types, setTypes] = useState({});
    const [staffSalaries, setStaffSalaries] = useState([]);
    const [staff, setStaff] = useState({});
    const [humans, setHumans] = useState({});
    const [totalStaffSalaries, setTotalStaffSalaries] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordPerPage] = useState(5);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [outletsResponse, typesResponse, staffResponse] = await Promise.all([
                getOutlets(),
                getTypesOfTradingPlaces(),
                getStaff()
            ]);
            setOutlets(outletsResponse.data.reduce((acc, outlet) => ({ ...acc, [outlet.id]: outlet }), {}));
            setTypes(typesResponse.data.reduce((acc, type) => ({ ...acc, [type.id]: type }), {}));
            setStaff(staffResponse.data.reduce((acc, staffMember) => ({ ...acc, [staffMember.id]: staffMember }), {}));

            const uniqueHumanIds = new Set(staffResponse.data.map(staffMember => staffMember.human_id));
            const humanResponses = await Promise.all([...uniqueHumanIds].map(humanId => getHumanById(humanId)));
            const humansTemp = humanResponses.reduce((acc, humanResponse) => {
                const human = humanResponse.data;
                acc[human.id] = human;
                return acc;
            }, {});
            setHumans(humansTemp);
        } catch (error) {
            console.error('Failed to fetch initial data', error);
        }
    };

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchStaffSalaries(currentPage);
    };

    const fetchStaffSalaries = async (page) => {
        try {
            const response = await getStaffSalariesByCriteria({ ...criteria, page, limit: recordPerPage });
            setStaffSalaries(response.data);
            setTotalStaffSalaries(response.data.length);  // Adjust as needed
            setTotalPages(Math.ceil(response.data.length / recordPerPage));  // Adjust as needed
            setCurrentPage(page);
        } catch (error) {
            console.error('Failed to fetch staff salaries', error);
        }
    };

    const handlePageChange = (page) => {
        fetchStaffSalaries(page);
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
        <div className="container-fluid staff-salaries-container">
            <h3>Staff Salaries By Criteria</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Outlet:</label>
                    <select
                        name="outlet_id"
                        value={criteria.outlet_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Outlet</option>
                        {Object.entries(outlets).map(([id, outlet]) => (
                            <option key={id} value={id}>
                                {outlet.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Type:</label>
                    <select
                        name="type_id"
                        value={criteria.type_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Type</option>
                        {Object.entries(types).map(([id, type]) => (
                            <option key={id} value={id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" className="btn btn-dark mt-2">Search</Button>
            </Form>
            <h4 className="mt-4">Total Staff: {totalStaffSalaries}</h4>
            {staffSalaries.length > 0 && (
                <>
                    <Table striped bordered hover variant="dark" className="mt-2">
                        <thead>
                        <tr>
                            <th>Staff Name</th>
                            <th>Salary</th>
                            <th>Outlet</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staffSalaries.map(salary => (
                            <tr key={salary.staff_id}>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(props) => renderTooltip(props, humans[staff[salary.staff_id]?.human_id] || {})}
                                >
                                    <td>{humans[staff[salary.staff_id]?.human_id]?.name || 'Unknown'}</td>
                                </OverlayTrigger>
                                <td>{salary.salary}</td>
                                <td>{salary.outlet_name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages).keys()].map(page =>
                            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                                {page + 1}
                            </Pagination.Item>
                        )}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </>
            )}
        </div>
    );
};

export default StaffSalariesByCriteria;