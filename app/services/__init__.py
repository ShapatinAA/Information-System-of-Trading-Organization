# app/services/__init__.py

from .outlet_service import create_outlet, get_all_outlets, get_outlet_by_id, update_outlet, delete_outlet, get_outlet_profitability, get_outlet_turnover
from .types_of_trading_places_service import create_type, get_all_types, get_type_by_id, update_type, delete_type
from .types_of_halls_service import create_hall_type, get_all_hall_types, get_hall_type_by_id, update_hall_type, delete_hall_type
from .products_service import create_product, get_all_products, get_product_by_id, update_product, delete_product
from .humans_service import create_human, get_all_humans, get_human_by_id, update_human, delete_human
from .suppliers_service import create_supplier, get_all_suppliers, get_supplier_by_id, update_supplier, delete_supplier
from .staff_service import create_staff, get_all_staff, get_staff_by_id, update_staff, delete_staff, get_staff_salaries
from .job_types_service import create_job_type, get_all_job_types, get_job_type_by_id, update_job_type, delete_job_type
from .items_stock_outlets_service import create_items_stock_outlet, get_all_items_stock_outlets, get_items_stock_outlet_by_id, update_items_stock_outlet, delete_items_stock_outlet, get_items_by_outlet, get_product_details
from .items_stock_suppliers_service import create_items_stock_supplier, get_all_items_stock_suppliers, get_items_stock_supplier_by_id, update_items_stock_supplier, delete_items_stock_supplier
from .sales_service import create_sale, get_all_sales, get_sale_by_id, update_sale, delete_sale, get_buyers_by_product_and_period, get_buyers_by_product_and_volume, get_seller_output, get_seller_output_by_outlet, get_product_sales, get_buyers_of_product, get_most_active_buyers, get_data_by_outlet
from .requests_service import create_request, get_all_requests, get_request_by_id, update_request, delete_request
from .order_items_service import create_order_item, get_all_order_items, get_order_item_by_id, update_order_item, delete_order_item, get_supplier_deliveries, get_order_items_by_request, get_data_by_request, get_pending_requests
from .transfer_service import create_transfer, get_all_transfers, get_transfer_by_id, update_transfer, delete_transfer, update_transfer_status
