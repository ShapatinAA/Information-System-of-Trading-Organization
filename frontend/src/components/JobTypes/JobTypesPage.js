import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getJobTypes, deleteJobType } from '../../services/api';

export default function JobTypesPage() {
    const [jobTypes, setJobTypes] = useState([]);
    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        fetchJobTypes();
    }, []);

    const fetchJobTypes = async () => {
        try {
            const response = await getJobTypes();
            setJobTypes(response.data);
        } catch (error) {
            console.error('Failed to fetch job types', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteJobType(id);
            fetchJobTypes();
        } catch (error) {
            console.error('Failed to delete job type', error);
        }
    };

    return (
        <div>
            <h2>Job Types</h2>
            <Button onClick={() => setShowTable(!showTable)} className="btn btn-dark mb-2">
                {showTable ? 'Hide Table' : 'Show Table'}
            </Button>
            {showTable && (
                <div className="table-container">
                    <Link to="/job_types/add" className="btn btn-dark mb-2">Add Job Type</Link>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {jobTypes.map(jobType => (
                            <tr key={jobType.id}>
                                <td>{jobType.id}</td>
                                <td>{jobType.name}</td>
                                <td>
                                    <Link to={`/job_types/edit/${jobType.id}`} className="btn btn-danger">Edit</Link>
                                    <Button onClick={() => handleDelete(jobType.id)} className="btn btn-danger" style={{ marginLeft: 10 }}>Delete</Button>
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
