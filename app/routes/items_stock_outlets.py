# app/routes/items_stock_outlets.py

from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app.services import create_items_stock_outlet, get_all_items_stock_outlets, get_items_stock_outlet_by_id, \
    update_items_stock_outlet, delete_items_stock_outlet, get_items_by_outlet, get_product_details

items_stock_outlets_bp = Blueprint('items_stock_outlets', __name__)

@items_stock_outlets_bp.route('/items_stock_outlets', methods=['POST'])
def create_items_stock_outlet_route():
    data = request.get_json()
    try:
        item = create_items_stock_outlet(data)
        if item:
            return jsonify(item.to_dict()), 201
        else:
            return jsonify({'message': 'Item already exists and was updated.'}), 200
    except IntegrityError as e:
        return jsonify({'error': str(e.orig)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@items_stock_outlets_bp.route('/items_stock_outlets', methods=['GET'])
def get_items_stock_outlets_route():
    items = get_all_items_stock_outlets()
    return jsonify([item.to_dict() for item in items]), 200

@items_stock_outlets_bp.route('/items_stock_outlets/<int:item_id>', methods=['GET'])
def get_items_stock_outlet_route(item_id):
    item = get_items_stock_outlet_by_id(item_id)
    if item is None:
        return jsonify({'message': 'Item not found'}), 404
    return jsonify(item.to_dict()), 200

@items_stock_outlets_bp.route('/items_stock_outlets/<int:item_id>', methods=['PUT'])
def update_items_stock_outlet_route(item_id):
    data = request.get_json()
    updated_item = update_items_stock_outlet(item_id, data)
    if updated_item is None:
        return jsonify({'message': 'Item not found or deleted due to quantity being set to 0'}), 404
    return jsonify(updated_item.to_dict()), 200

@items_stock_outlets_bp.route('/items_stock_outlets/<int:item_id>', methods=['DELETE'])
def delete_items_stock_outlet_route(item_id):
    deleted_item = delete_items_stock_outlet(item_id)
    if deleted_item is None:
        return jsonify({'message': 'Item not found'}), 404
    return jsonify({'message': 'Item deleted'}), 200

@items_stock_outlets_bp.route('/get_items_by_outlet', methods=['POST'])
def get_items_by_outlet_route():
    data = request.get_json()
    if not data or 'outlet_id' not in data:
        return jsonify({'error': 'outlet_id parameter is required'}), 400
    outlet_id = data['outlet_id']
    try:
        items = get_items_by_outlet(outlet_id)
        if not items:
            return jsonify({'message': 'No items found for the specified outlet'}), 404
        return jsonify(items), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_stock_outlets_bp.route('/product_details', methods=['POST'])
def get_product_details_route():
    data = request.get_json()
    if not data or 'product_id' not in data:
        return jsonify({'error': 'product_id parameter is required'}), 400

    product_id = data['product_id']
    outlet_id = data.get('outlet_id')
    type_id = data.get('type_id')

    try:
        details = get_product_details(product_id, outlet_id, type_id)
        if not details:
            return jsonify({'message': 'No details found for the specified criteria'}), 404
        return jsonify(details), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500