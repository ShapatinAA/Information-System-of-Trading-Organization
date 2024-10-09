# app/routes/items_stock_suppliers.py

from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app.services import create_items_stock_supplier, get_all_items_stock_suppliers, get_items_stock_supplier_by_id, update_items_stock_supplier, delete_items_stock_supplier

items_stock_suppliers_bp = Blueprint('items_stock_suppliers', __name__)

@items_stock_suppliers_bp.route('/items_stock_suppliers', methods=['POST'])
def create_items_stock_supplier_route():
    data = request.get_json()
    try:
        item = create_items_stock_supplier(data)
        if item:
            return jsonify(item.to_dict()), 201
        else:
            return jsonify({'message': 'Item already exists and was updated.'}), 200
    except IntegrityError as e:
        return jsonify({'error': str(e.orig)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@items_stock_suppliers_bp.route('/items_stock_suppliers', methods=['GET'])
def get_items_stock_suppliers_route():
    items = get_all_items_stock_suppliers()
    return jsonify([item.to_dict() for item in items]), 200

@items_stock_suppliers_bp.route('/items_stock_suppliers/<int:item_id>', methods=['GET'])
def get_items_stock_supplier_route(item_id):
    item = get_items_stock_supplier_by_id(item_id)
    if item is None:
        return jsonify({'message': 'Item not found'}), 404
    return jsonify(item.to_dict()), 200

@items_stock_suppliers_bp.route('/items_stock_suppliers/<int:item_id>', methods=['PUT'])
def update_items_stock_supplier_route(item_id):
    data = request.get_json()
    updated_item = update_items_stock_supplier(item_id, data)
    if updated_item is None:
        return jsonify({'message': 'Item not found'}), 404
    return jsonify(updated_item.to_dict()), 200

@items_stock_suppliers_bp.route('/items_stock_suppliers/<int:item_id>', methods=['DELETE'])
def delete_items_stock_supplier_route(item_id):
    deleted_item = delete_items_stock_supplier(item_id)
    if deleted_item is None:
        return jsonify({'message': 'Item not found'}), 404
    return jsonify({'message': 'Item deleted'}), 200
