# app/routes/suppliers.py
from datetime import datetime

from flask import Blueprint, request, jsonify
from app.services import create_supplier, get_all_suppliers, get_supplier_by_id, update_supplier, delete_supplier
from app.services.suppliers_service import get_suppliers_by_product_type, get_suppliers_by_min_volume

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('/suppliers', methods=['POST'])
def create_supplier_route():
    data = request.get_json()
    new_supplier = create_supplier(data)
    return jsonify(new_supplier.to_dict()), 201

@suppliers_bp.route('/suppliers', methods=['GET'])
def get_suppliers_route():
    suppliers = get_all_suppliers()
    return jsonify([supplier.to_dict() for supplier in suppliers]), 200

@suppliers_bp.route('/suppliers/<int:supplier_id>', methods=['GET'])
def get_supplier_route(supplier_id):
    supplier = get_supplier_by_id(supplier_id)
    if supplier is None:
        return jsonify({'message': 'Supplier not found'}), 404
    return jsonify(supplier.to_dict()), 200

@suppliers_bp.route('/suppliers/<int:supplier_id>', methods=['PUT'])
def update_supplier_route(supplier_id):
    data = request.get_json()
    updated_supplier = update_supplier(supplier_id, data)
    if updated_supplier is None:
        return jsonify({'message': 'Supplier not found'}), 404
    return jsonify(updated_supplier.to_dict()), 200

@suppliers_bp.route('/suppliers/<int:supplier_id>', methods=['DELETE'])
def delete_supplier_route(supplier_id):
    deleted_supplier = delete_supplier(supplier_id)
    if deleted_supplier is None:
        return jsonify({'message': 'Supplier not found'}), 404
    return jsonify({'message': 'Supplier deleted'}), 200

@suppliers_bp.route('/suppliers_by_criteria', methods=['POST'])
def suppliers_by_criteria():
    data = request.get_json()
    product_id = data.get('product_id')
    min_volume = data.get('min_volume')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

    if product_id and not min_volume:
        suppliers, total_suppliers = get_suppliers_by_product_type(product_id)
    elif product_id and min_volume and not start_date and not end_date:
        suppliers, total_suppliers = get_suppliers_by_min_volume(product_id, min_volume)
    elif product_id and min_volume and (start_date or end_date):
        suppliers, total_suppliers = get_suppliers_by_min_volume(product_id, min_volume, start_date, end_date)
    else:
        return jsonify({'error': 'Invalid parameters'}), 400

    result = {
        'total_suppliers': total_suppliers,
        'suppliers': [supplier.to_dict() for supplier in suppliers]
    }

    return jsonify(result), 200