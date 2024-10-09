import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Sales API
export const getSales = () => api.get('/sales');
export const getSaleById = (id) => api.get(`/sales/${id}`);
export const createSale = (sale) => api.post('/sales', sale);
export const updateSale = (id, sale) => api.put(`/sales/${id}`, sale);
export const deleteSale = (id) => api.delete(`/sales/${id}`);
export const getBuyersByProductAndPeriod = (productId, period) => api.get(`/sales/buyers_by_product_and_period/${productId}/${period}`);
export const getBuyersByProductAndVolume = (productId, volume) => api.get(`/sales/buyers_by_product_and_volume/${productId}/${volume}`);
export const getSellerOutput = (data) => api.post('/seller_output', data);
export const getSellerOutputByOutlet = (data) => api.post('/seller_output_by_outlet', data);
export const getProductSales = (data) => api.post(`/product_sales`, data);
export const getOutletData = (outletId) => api.post('/sales/outlet_data', outletId);
export const getBuyersByCriteria = (criteria) => api.post('/buyers_by_criteria', criteria);

// Human API
export const getHumans = () => api.get('/humans');
export const getHumanById = (id) => api.get(`/humans/${id}`);
export const createHuman = (human) => api.post('/humans', human);
export const updateHuman = (id, human) => api.put(`/humans/${id}`, human);
export const deleteHuman = (id) => api.delete(`/humans/${id}`);

// Product API
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (product) => api.post('/products', product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Outlets API
export const getOutlets = () => api.get('/outlets');
export const getOutletById = (id) => api.get(`/outlets/${id}`);
export const createOutlet = (outlet) => api.post('/outlets', outlet);
export const updateOutlet = (id, outlet) => api.put(`/outlets/${id}`, outlet);
export const deleteOutlet = (id) => api.delete(`/outlets/${id}`);

// Staff API
export const getStaff = () => api.get('/staff');
export const getStaffById = (id) => api.get(`/staff/${id}`);
export const createStaff = (staff) => api.post('/staff', staff);
export const updateStaff = (id, staff) => api.put(`/staff/${id}`, staff);
export const deleteStaff = (id) => api.delete(`/staff/${id}`);
export const getStaffSalaries = () => api.get('/staff/salaries');

// Items Stock Outlets API
export const getItemsStockOutlets = () => api.get(`/items_stock_outlets`);
export const getItemsStockOutletById = (id) => api.get(`/items_stock_outlets/${id}`);
export const createItemsStockOutlet = (itemsStockOutlet) => api.post('/items_stock_outlets', itemsStockOutlet);
export const updateItemsStockOutlet = (id, itemsStockOutlet) => api.put(`/items_stock_outlets/${id}`, itemsStockOutlet);
export const deleteItemsStockOutlet = (id) => api.delete(`/items_stock_outlets/${id}`);
export const getItemsByOutlet = (outletId) => api.post('/get_items_by_outlet', { outlet_id: outletId });


// Items Stock Suppliers API
export const getItemsStockSuppliers = () => api.get('/items_stock_suppliers');
export const getItemsStockSupplierById = (id) => api.get(`/items_stock_suppliers/${id}`);
export const createItemsStockSupplier = (itemsStockSupplier) => api.post('/items_stock_suppliers', itemsStockSupplier);
export const updateItemsStockSupplier = (id, itemsStockSupplier) => api.put(`/items_stock_suppliers/${id}`, itemsStockSupplier);
export const deleteItemsStockSupplier = (id) => api.delete(`/items_stock_suppliers/${id}`);

// Type Of Trading Places API
export const getTypesOfTradingPlaces = () => api.get('/types_of_trading_places');
export const getTypeOfTradingPlaceById = (id) => api.get(`/types_of_trading_places/${id}`);
export const createTypeOfTradingPlace = (type) => api.post('/types_of_trading_places', type);
export const updateTypeOfTradingPlace = (id, type) => api.put(`/types_of_trading_places/${id}`, type);
export const deleteTypeOfTradingPlace = (id) => api.delete(`/types_of_trading_places/${id}`);

// Type Of Halls API
export const getTypesOfHalls = () => api.get('/types_of_halls');
export const getTypeOfHallById = (id) => api.get(`/types_of_halls/${id}`);
export const createTypeOfHall = (type) => api.post('/types_of_halls', type);
export const updateTypeOfHall = (id, type) => api.put(`/types_of_halls/${id}`, type);
export const deleteTypeOfHall = (id) => api.delete(`/types_of_halls/${id}`);

// Suppliers API
export const getSuppliers = () => api.get('/suppliers');
export const getSupplierById = (id) => api.get(`/suppliers/${id}`);
export const createSupplier = (supplier) => api.post('/suppliers', supplier);
export const updateSupplier = (id, supplier) => api.put(`/suppliers/${id}`, supplier);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);
export const getSuppliersByCriteria = (criteria) => api.post('/suppliers_by_criteria', criteria);

// Requests API
export const getRequests = () => api.get('/requests');
export const getRequestById = (id) => api.get(`/requests/${id}`);
export const createRequest = (request) => api.post('/requests', request);
export const updateRequest = (id, request) => api.put(`/requests/${id}`, request);
export const deleteRequest = (id) => api.delete(`/requests/${id}`);

// Order Items API
export const getOrderItems = () => api.get('/order_items');
export const getOrderItemById = (id) => api.get(`/order_items/${id}`);
export const createOrderItem = (orderItem) => api.post('/order_items', orderItem);
export const updateOrderItem = (id, orderItem) => api.put(`/order_items/${id}`, orderItem);
export const deleteOrderItem = (id) => api.delete(`/order_items/${id}`);
export const getRequestData = (requestId) => api.post('/order_items/request_data', { request_id: requestId });
export const getPendingRequests = () => api.get('/order_items/pending_requests');

// Transfer API
export const getTransfers = () => api.get('/transfers');
export const getTransferById = (id) => api.get(`/transfers/${id}`);
export const createTransfer = (transfer) => api.post('/transfers', transfer);
export const updateTransfer = (id, transfer) => api.put(`/transfers/${id}`, transfer);
export const deleteTransfer = (id) => api.delete(`/transfers/${id}`);
export const updateTransferStatus = (id, status) => api.put(`/transfers/${id}/status`, { status });

// Job Types API
export const getJobTypes = () => api.get('/job_types');
export const createJobType = (jobType) => api.post('/job_types', jobType);
export const updateJobType = (id, jobType) => api.put(`/job_types/${id}`, jobType);
export const deleteJobType = (id) => api.delete(`/job_types/${id}`);
export const getJobTypeById = (id) => api.get(`/job_types/${id}`);
export const getProductDetails = (params) => api.post('/product_details',  params);
export const getStaffSalariesByCriteria = (criteria) => api.post('/staff_salaries', criteria);
export const getSupplierDeliveries = (criteria) => api.post('/supplier_deliveries', criteria);
export const getOutletProfitability = (criteria) => api.post('/outlet_profitability', criteria);
export const getOrderItemsByRequest = (criteria) => api.post('/order_items_by_request', criteria);
export const getBuyersOfProduct = (criteria) => api.post('/buyers_of_product', criteria);
export const getMostActiveBuyers = (criteria) => api.post('/most_active_buyers', criteria);
export const getOutletTurnover = (criteria) => api.post('/outlet_turnover', criteria);
export const register = (email, password) => api.post('/register', email, password);
export const login = (email, password) => api.post('/login', email, password);


export default api;
