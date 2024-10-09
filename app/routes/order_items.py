# app/routes/order_items.py

from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app.services import create_order_item, get_all_order_items, get_order_item_by_id, update_order_item, \
    delete_order_item, get_supplier_deliveries, get_order_items_by_request, get_data_by_request, get_pending_requests

order_items_bp = Blueprint('order_items', __name__)

@order_items_bp.route('/order_items', methods=['POST'])
def create_order_item_route():
    data = request.get_json()
    try:
        order_item = create_order_item(data)
        if order_item:
            return jsonify(order_item.to_dict()), 201
        else:
            return jsonify({'message': 'Order item created successfully.'}), 201
    except IntegrityError as e:
        return jsonify({'error': str(e.orig)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@order_items_bp.route('/order_items', methods=['GET'])
def get_order_items_route():
    order_items = get_all_order_items()
    return jsonify([item.to_dict() for item in order_items]), 200

@order_items_bp.route('/order_items/<int:order_item_id>', methods=['GET'])
def get_order_item_route(order_item_id):
    order_item = get_order_item_by_id(order_item_id)
    if order_item is None:
        return jsonify({'message': 'Order item not found'}), 404
    return jsonify(order_item.to_dict()), 200

@order_items_bp.route('/order_items/<int:order_item_id>', methods=['PUT'])
def update_order_item_route(order_item_id):
    data = request.get_json()
    updated_order_item = update_order_item(order_item_id, data)
    if updated_order_item is None:
        return jsonify({'message': 'Order item not found'}), 404
    return jsonify(updated_order_item.to_dict()), 200

@order_items_bp.route('/order_items/<int:order_item_id>', methods=['DELETE'])
def delete_order_item_route(order_item_id):
    deleted_order_item = delete_order_item(order_item_id)
    if deleted_order_item is None:
        return jsonify({'message': 'Order item not found'}), 404
    return jsonify({'message': 'Order item deleted'}), 200

@order_items_bp.route('/supplier_deliveries', methods=['POST'])
def get_supplier_deliveries_route():
    data = request.get_json()
    if not data or 'product_id' not in data or 'supplier_id' not in data:
        return jsonify({'error': 'product_id and supplier_id parameters are required'}), 400

    product_id = data['product_id']
    supplier_id = data['supplier_id']
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    try:
        deliveries_data = get_supplier_deliveries(product_id, supplier_id, start_date, end_date)
        if not deliveries_data:
            return jsonify({'message': 'No delivery data found for the specified criteria'}), 404
        return jsonify(deliveries_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_items_bp.route('/order_items_by_request', methods=['POST'])
def get_order_items_by_request_route():
    data = request.get_json()
    if not data or 'request_id' not in data:
        return jsonify({'error': 'request_id parameter is required'}), 400

    request_id = data['request_id']

    try:
        order_items = get_order_items_by_request(request_id)
        if not order_items:
            return jsonify({'message': 'No order items found for the specified request'}), 404
        return jsonify(order_items), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_items_bp.route('/order_items/request_data', methods=['POST'])
def get_request_data_route():
    data = request.get_json()
    request_id = data.get('request_id')
    if not request_id:
        return jsonify({'error': 'request_id parameter is required'}), 400
    try:
        data = get_data_by_request(request_id)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_items_bp.route('/order_items/pending_requests', methods=['GET'])
def get_pending_requests_route():
    try:
        data = get_pending_requests()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
