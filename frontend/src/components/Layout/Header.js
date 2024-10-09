import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div>
            <Link to="/">
                <div className="organization" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <img width={170} height={100} src="logo.jpg" alt="Logo" />
                    <h3 style={{ color: 'white' }}>ОАО МЕГАЛУЛЬ INC</h3>
                </div>
            </Link>
            <Navbar style={{ padding: 10, marginTop: 0, fontSize: 16 }} bg="black" variant="dark">
                <Container>
                    <Nav className="me-auto" style={{ display: 'flex', flexDirection: 'column' }}>
                        <Nav.Link href="/outlets">Outlets</Nav.Link>
                        <Nav.Link href="/types_of_trading_places">Types of Trading Places</Nav.Link>
                        <Nav.Link href="/types_of_halls">Types of Halls</Nav.Link>
                        <Nav.Link href="/products">Products</Nav.Link>
                        <Nav.Link href="/humans">Humans</Nav.Link>
                        <Nav.Link href="/suppliers">Suppliers</Nav.Link>
                        <Nav.Link href="/staff">Staff</Nav.Link>
                        <Nav.Link href="/items_stock_outlets">Items Stock Outlets</Nav.Link>
                        <Nav.Link href="/items_stock_suppliers">Items Stock Suppliers</Nav.Link>
                        <Nav.Link href="/sales">Sales</Nav.Link>
                        <Nav.Link href="/requests">Requests</Nav.Link>
                        <Nav.Link href="/order_items">Order Items</Nav.Link>
                        <Nav.Link href="/transfers">Transfers</Nav.Link>
                        <Nav.Link href="/job_types">Job Types</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto" style={{ display: 'flex', flexDirection: 'column' }}>
                        <Nav.Link href="/suppliers_by_criteria">Suppliers By Criteria</Nav.Link>
                        <Nav.Link href="/buyers_by_criteria">Buyers By Criteria</Nav.Link>
                        <Nav.Link href="/items_by_outlet">Items by Outlet</Nav.Link>
                        <Nav.Link href="/product_details">Product Details</Nav.Link>
                        <Nav.Link href="/seller_output">Seller Output</Nav.Link>
                        <Nav.Link href="/seller_output_by_outlet">Seller Output by Outlet</Nav.Link>
                        <Nav.Link href="/product_sales">Product Sales</Nav.Link>
                        <Nav.Link href="/staff_salaries">Staff Salaries</Nav.Link>
                        <Nav.Link href="/supplier_deliveries">Supplier Deliveries</Nav.Link>
                        <Nav.Link href="/profitability_by_criteria">Outlet Profitability</Nav.Link>
                        <Nav.Link href="/order_items_by_request">Order Items By Request</Nav.Link>
                        <Nav.Link href="/buyers_of_product">Buyers of Product</Nav.Link>
                        <Nav.Link href="/most_active_buyers">Most Active Buyers</Nav.Link>
                        <Nav.Link href="/outlet_turnover">Outlet Turnover</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <br />
        </div>
    );
}

export default Header;
