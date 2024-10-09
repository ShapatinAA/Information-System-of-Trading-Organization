import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createSale, updateSale, getSaleById, getHumans, getOutlets, getOutletData } from '../../services/api';

const AddSale = () => {
    const [form, setForm] = useState({
        human_id: '',
        product_id: '',
        outlet_id: '',
        date: '',
        price: '',
        quantity: '',
        staff_id: '',
    });

    const [humans, setHumans] = useState([]);
    const [products, setProducts] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [staff, setStaff] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productStock, setProductStock] = useState({});
    const [staffNames, setStaffNames] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        fetchInitialData();
        if (isEditing) {
            fetchSale();
        }
    }, [id]);

    const fetchInitialData = async () => {
        try {
            const [humansResponse, outletsResponse] = await Promise.all([
                getHumans(),
                getOutlets()
            ]);
            setHumans(humansResponse.data);
            setOutlets(outletsResponse.data);
        } catch (error) {
            console.error('Failed to fetch initial data', error);
        }
    };

    const fetchSale = async () => {
        try {
            const response = await getSaleById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch sale', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'outlet_id') {
            await fetchOutletData(value);
        }
    };

    const fetchOutletData = async (outletId) => {
        try {
            const response = await getOutletData({ outlet_id: outletId });
            const { products, staff } = response.data;
            setFilteredProducts(products);
            setFilteredStaff(staff);

            const productStockTemp = {};
            products.forEach(product => {
                productStockTemp[product.id] = product.quantity;
            });
            setProductStock(productStockTemp);

            const staffNamesTemp = {};
            staff.forEach(staffMember => {
                staffNamesTemp[staffMember.id] = staffMember.name;
            });
            setStaffNames(staffNamesTemp);
        } catch (error) {
            console.error('Failed to fetch outlet data', error);
        }
    };

    const handleQuantityChange = (e) => {
        const { value } = e.target;
        const maxQuantity = productStock[form.product_id] || 0;
        if (parseInt(value) <= maxQuantity && parseInt(value) >= 0) {
            setForm({ ...form, quantity: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateSale(id, form);
            } else {
                await createSale(form);
            }
            navigate('/sales');
        } catch (error) {
            console.error('Failed to save sale', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Sale' : 'Add New Sale'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="form-group">
                        <label>Human:</label>
                        <select
                            name="human_id"
                            value={form.human_id}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">Select Human</option>
                            {humans.map(human => (
                                <option key={human.id} value={human.id}>
                                    {human.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <label>Outlet:</label>
                    <select
                        name="outlet_id"
                        value={form.outlet_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Outlet</option>
                        {outlets.map(outlet => (
                            <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Product:</label>
                    <select
                        name="product_id"
                        value={form.product_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={!form.outlet_id}
                    >
                        <option value="">Select Product</option>
                        {filteredProducts.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Staff:</label>
                    <select
                        name="staff_id"
                        value={form.staff_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={!form.outlet_id}
                    >
                        <option value="">Select Staff</option>
                        {filteredStaff.map(staffMember => (
                            <option key={staffMember.id} value={staffMember.id}>
                                {staffNames[staffMember.id]}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        step="any"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="form-control"
                        required
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleQuantityChange}
                        className="form-control"
                        required
                        max={productStock[form.product_id] || 0}
                        min="0"
                    />
                </div>
                <button type="submit" className="btn btn-dark">Save</button>
                <Link to="/sales" className="btn btn-dark" style={{ marginLeft: '10px' }}>Back</Link>
            </form>
        </div>
    );
};

export default AddSale;
