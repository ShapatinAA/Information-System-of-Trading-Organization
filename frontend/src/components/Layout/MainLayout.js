import React from 'react';
import Header from './Header';
import { Container } from 'react-bootstrap';

const MainLayout = ({ children }) => {
    return (
        <div style={{ backgroundColor: '#282c34', minHeight: '100vh', color: 'white' }}>
            <Header />
            <Container style={{ paddingTop: '20px', backgroundColor: '#282c34' }}>
                {children}
            </Container>
        </div>
    );
};

export default MainLayout;
