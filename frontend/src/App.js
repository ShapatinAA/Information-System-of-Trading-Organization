import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import SalesPage from './components/Sales/SalesPage';
import AddSale from './components/Sales/AddSale';
import HumansPage from './components/Humans/HumansPage';
import AddHuman from './components/Humans/AddHuman';
import SuppliersPage from './components/Suppliers/SuppliersPage';
import AddSupplier from './components/Suppliers/AddSupplier';
import SuppliersByCriteria from './components/Suppliers/SuppliersByCriteria';
import OutletsPage from './components/Outlets/OutletsPage';
import AddOutlet from './components/Outlets/AddOutlet';
import TypesOfTradingPlacesPage from './components/TypesOfTradingPlaces/TypesOfTradingPlacesPage';
import AddTypeOfTradingPlace from './components/TypesOfTradingPlaces/AddTypeOfTradingPlace';
import TypesOfHallsPage from './components/TypesOfHalls/TypesOfHallsPage';
import AddTypeOfHall from './components/TypesOfHalls/AddTypeOfHall';
import ProductsPage from './components/Products/ProductsPage';
import AddProduct from './components/Products/AddProduct';
import StaffPage from './components/Staff/StaffPage';
import AddStaff from './components/Staff/AddStaff';
import JobTypesPage from './components/JobTypes/JobTypesPage';
import AddJobType from './components/JobTypes/AddJobType';
import ItemsStockOutletsPage from './components/ItemsStockOutlets/ItemsStockOutletsPage';
import AddItemsStockOutlet from './components/ItemsStockOutlets/AddItemsStockOutlet';
import ItemsStockSuppliersPage from './components/ItemsStockSuppliers/ItemsStockSuppliersPage';
import AddItemsStockSupplier from './components/ItemsStockSuppliers/AddItemsStockSupplier';
import RequestsPage from './components/Requests/RequestsPage';
import AddRequest from './components/Requests/AddRequest';
import OrderItemsPage from './components/OrderItems/OrderItemsPage';
import AddOrderItem from './components/OrderItems/AddOrderItem';
import TransferPage from './components/Transfer/TransferPage';
import AddTransfer from './components/Transfer/AddTransfer';
import BuyersByCriteria from './components/Sales/BuyersByCriteria';
import ItemsByOutlet from './components/ItemsStockOutlets/ItemsByOutlet';
import ProductDetails from './components/ItemsStockOutlets/ProductDetails';
import SellerOutput from './components/Sales/SellerOutput';
import SellerOutputByOutlet from './components/Sales/SellerOutputByOutlet';
import ProductSales from './components/Sales/ProductSales';
import StaffSalariesByCriteria from './components/Staff/StaffSalariesByCriteria';
import DeliveriesByCriteria from './components/OrderItems/DeliveriesByCriteria';
import ProfitabilityByCriteria from './components/Outlets/ProfitabilityByCriteria';
import OrderItemsByRequest from './components/OrderItems/OrderItemsByRequest';
import BuyersOfProduct from './components/Sales/BuyersOfProduct';
import MostActiveBuyers from './components/Sales/MostActiveBuyers';
import OutletTurnover from './components/Outlets/OutletTurnover';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<SalesPage />} />
                    <Route path="/sales" element={<SalesPage />} />
                    <Route path="/sales/add" element={<AddSale />} />
                    <Route path="/sales/edit/:id" element={<AddSale />} />
                    <Route path="/humans" element={<HumansPage />} />
                    <Route path="/humans/add" element={<AddHuman />} />
                    <Route path="/humans/edit/:id" element={<AddHuman />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/suppliers/add" element={<AddSupplier />} />
                    <Route path="/suppliers/edit/:id" element={<AddSupplier />} />
                    <Route path="/suppliers_by_criteria" element={<SuppliersByCriteria />} />
                    <Route path="/outlets" element={<OutletsPage />} />
                    <Route path="/outlets/add" element={<AddOutlet />} />
                    <Route path="/outlets/edit/:id" element={<AddOutlet />} />
                    <Route path="/types_of_trading_places" element={<TypesOfTradingPlacesPage />} />
                    <Route path="/types_of_trading_places/add" element={<AddTypeOfTradingPlace />} />
                    <Route path="/types_of_trading_places/edit/:id" element={<AddTypeOfTradingPlace />} />
                    <Route path="/types_of_halls" element={<TypesOfHallsPage />} />
                    <Route path="/types_of_halls/add" element={<AddTypeOfHall />} />
                    <Route path="/types_of_halls/edit/:id" element={<AddTypeOfHall />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/products/edit/:id" element={<AddProduct />} />
                    <Route path="/staff" element={<StaffPage />} />
                    <Route path="/staff/add" element={<AddStaff />} />
                    <Route path="/staff/edit/:id" element={<AddStaff />} />
                    <Route path="/job_types" element={<JobTypesPage />} />
                    <Route path="/job_types/add" element={<AddJobType />} />
                    <Route path="/job_types/edit/:id" element={<AddJobType />} />
                    <Route path="/items_stock_outlets" element={<ItemsStockOutletsPage />} />
                    <Route path="/items_stock_outlets/add" element={<AddItemsStockOutlet />} />
                    <Route path="/items_stock_outlets/edit/:id" element={<AddItemsStockOutlet />} />
                    <Route path="/items_stock_suppliers" element={<ItemsStockSuppliersPage />} />
                    <Route path="/items_stock_suppliers/add" element={<AddItemsStockSupplier />} />
                    <Route path="/items_stock_suppliers/edit/:id" element={<AddItemsStockSupplier />} />
                    <Route path="/requests" element={<RequestsPage />} />
                    <Route path="/requests/add" element={<AddRequest />} />
                    <Route path="/requests/edit/:id" element={<AddRequest />} />
                    <Route path="/order_items" element={<OrderItemsPage />} />
                    <Route path="/order_items/add" element={<AddOrderItem />} />
                    <Route path="/order_items/edit/:id" element={<AddOrderItem />} />
                    <Route path="/transfers" element={<TransferPage />} />
                    <Route path="/transfers/add" element={<AddTransfer />} />
                    <Route path="/transfers/edit/:id" element={<AddTransfer />} />
                    <Route path="/buyers_by_criteria" element={<BuyersByCriteria />} />
                    <Route path="/items_by_outlet" element={<ItemsByOutlet />} />
                    <Route path="/product_details" element={<ProductDetails />} />
                    <Route path="/seller_output" element={<SellerOutput />} />
                    <Route path="/seller_output_by_outlet" element={<SellerOutputByOutlet />} />
                    <Route path="/product_sales" element={<ProductSales />} />
                    <Route path="/staff_salaries" element={<StaffSalariesByCriteria />} />
                    <Route path="/supplier_deliveries" element={<DeliveriesByCriteria />} />
                    <Route path="/profitability_by_criteria" element={<ProfitabilityByCriteria />} />
                    <Route path="/order_items_by_request" element={<OrderItemsByRequest />} />
                    <Route path="/buyers_of_product" element={<BuyersOfProduct />} />
                    <Route path="/most_active_buyers" element={<MostActiveBuyers />} />
                    <Route path="/outlet_turnover" element={<OutletTurnover />} />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
