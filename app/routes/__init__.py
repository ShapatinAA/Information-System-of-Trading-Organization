# app/routes/__init__.py
from .job_types import job_types_bp
from .outlets import outlet_bp
from .types_of_trading_places import types_of_trading_places_bp
from .types_of_halls import types_of_halls_bp
from .products import products_bp
from .humans import humans_bp
from .suppliers import suppliers_bp
from .staff import staff_bp
from .items_stock_outlets import items_stock_outlets_bp
from .items_stock_suppliers import items_stock_suppliers_bp
from .sales import sales_bp
from .requests import requests_bp
from .order_items import order_items_bp
from .transfer import transfer_bp

def register_routes(app):
    app.register_blueprint(outlet_bp, url_prefix='/api')
    app.register_blueprint(types_of_trading_places_bp, url_prefix='/api')
    app.register_blueprint(types_of_halls_bp, url_prefix='/api')
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(humans_bp, url_prefix='/api')
    app.register_blueprint(suppliers_bp, url_prefix='/api')
    app.register_blueprint(staff_bp, url_prefix='/api')
    app.register_blueprint(items_stock_outlets_bp, url_prefix='/api')
    app.register_blueprint(items_stock_suppliers_bp, url_prefix='/api')
    app.register_blueprint(sales_bp, url_prefix='/api')
    app.register_blueprint(requests_bp, url_prefix='/api')
    app.register_blueprint(order_items_bp, url_prefix='/api')
    app.register_blueprint(transfer_bp, url_prefix='/api')
    app.register_blueprint(job_types_bp, url_prefix='/api')
