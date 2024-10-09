# app/routes/sales.py

from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app.models import Human
from app.services import create_sale, get_all_sales, get_sale_by_id, update_sale, delete_sale, \
    get_buyers_by_product_and_period, get_buyers_by_product_and_volume, get_seller_output, get_seller_output_by_outlet, \
    get_product_sales, get_buyers_of_product, get_most_active_buyers, get_data_by_outlet

sales_bp = Blueprint('sales', __name__)

@sales_bp.route('/sales', methods=['POST'])
def create_sale_route():
    data = request.get_json()
    try:
        sale = create_sale(data)
        if sale:
            return jsonify(sale.to_dict()), 201
        else:
            return jsonify({'message': 'Sale created successfully.'}), 201
    except IntegrityError as e:
        if 'Duplicate sale entry is not allowed' in str(e.orig):
            return jsonify({'error': 'Duplicate sale entry is not allowed'}), 400
        return jsonify({'error': str(e.orig)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@sales_bp.route('/sales', methods=['GET'])
def get_sales_route():
    sales = get_all_sales()
    return jsonify([sale.to_dict() for sale in sales]), 200

@sales_bp.route('/sales/<int:sale_id>', methods=['GET'])
def get_sale_route(sale_id):
    sale = get_sale_by_id(sale_id)
    if sale is None:
        return jsonify({'message': 'Sale not found'}), 404
    return jsonify(sale.to_dict()), 200

@sales_bp.route('/sales/<int:sale_id>', methods=['PUT'])
def update_sale_route(sale_id):
    data = request.get_json()
    updated_sale = update_sale(sale_id, data)
    if updated_sale is None:
        return jsonify({'message': 'Sale not found'}), 404
    return jsonify(updated_sale.to_dict()), 200

@sales_bp.route('/sales/<int:sale_id>', methods=['DELETE'])
def delete_sale_route(sale_id):
    deleted_sale = delete_sale(sale_id)
    if deleted_sale is None:
        return jsonify({'message': 'Sale not found'}), 404
    return jsonify({'message': 'Sale deleted'}), 200

@sales_bp.route('/buyers_by_criteria', methods=['POST'])
def get_buyers_by_criteria():
    data = request.get_json()
    try:
        product_id = data.get('product_id')
        min_volume = data.get('min_volume')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date:
            buyers, total_buyers = get_buyers_by_product_and_period(product_id, start_date, end_date)
        elif min_volume is not None:
            buyers, total_buyers = get_buyers_by_product_and_volume(product_id, min_volume)
        else:
            return jsonify({'error': 'Invalid criteria provided'}), 400

        return jsonify({
            'buyers': [buyer.to_dict() if isinstance(buyer, Human) else buyer for buyer in buyers],
            'total_buyers': total_buyers
        }), 200
    except IntegrityError as e:
        return jsonify({'error': str(e.orig)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@sales_bp.route('/seller_output', methods=['POST'])
def get_seller_output_route():
    data = request.get_json()
    if not data or 'start_date' not in data or 'end_date' not in data:
        return jsonify({'error': 'start_date and end_date parameters are required'}), 400

    start_date = data['start_date']
    end_date = data['end_date']
    type_id = data.get('type_id')

    try:
        output_data = get_seller_output(start_date, end_date, type_id)
        if not output_data:
            return jsonify({'message': 'No output data found for the specified criteria'}), 404
        return jsonify(output_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sales_bp.route('/seller_output_by_outlet', methods=['POST'])
def get_seller_output_by_outlet_route():
    data = request.get_json()
    if not data or 'staff_id' not in data or 'outlet_id' not in data or 'start_date' not in data or 'end_date' not in data:
        return jsonify({'error': 'staff_id, outlet_id, start_date, and end_date parameters are required'}), 400

    staff_id = data['staff_id']
    outlet_id = data['outlet_id']
    start_date = data['start_date']
    end_date = data['end_date']

    try:
        output_data = get_seller_output_by_outlet(staff_id, outlet_id, start_date, end_date)
        if not output_data:
            return jsonify({'message': 'No output data found for the specified criteria'}), 404
        return jsonify(output_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sales_bp.route('/product_sales', methods=['POST'])
def get_product_sales_route():
    data = request.get_json()
    if not data or 'product_id' not in data or 'start_date' not in data or 'end_date' not in data:
        return jsonify({'error': 'product_id, start_date, and end_date parameters are required'}), 400

    product_id = data['product_id']
    start_date = data['start_date']
    end_date = data['end_date']
    outlet_id = data.get('outlet_id')
    type_id = data.get('type_id')

    try:
        sales_data = get_product_sales(product_id, start_date, end_date, outlet_id, type_id)
        if not sales_data:
            return jsonify({'message': 'No sales data found for the specified criteria'}), 404
        return jsonify(sales_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sales_bp.route('/buyers_of_product', methods=['POST'])
def get_buyers_of_product_route():
    data = request.get_json()
    if not data or 'product_id' not in data:
        return jsonify({'error': 'product_id parameter is required'}), 400

    product_id = data['product_id']
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    outlet_id = data.get('outlet_id')
    type_id = data.get('type_id')

    try:
        buyers_data = get_buyers_of_product(product_id, start_date, end_date, outlet_id, type_id)
        if not buyers_data:
            return jsonify({'message': 'No buyer data found for the specified criteria'}), 404
        return jsonify(buyers_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sales_bp.route('/most_active_buyers', methods=['POST'])
def get_most_active_buyers_route():
    data = request.get_json()
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    outlet_id = data.get('outlet_id')
    type_id = data.get('type_id')
    limit = data.get('limit', 10)  # Default limit to 10 if not provided

    try:
        buyers_data = get_most_active_buyers(start_date, end_date, outlet_id, type_id, limit)
        if not buyers_data:
            return jsonify({'message': 'No buyer data found for the specified criteria'}), 404
        return jsonify(buyers_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sales_bp.route('/sales/outlet_data', methods=['POST'])
def get_outlet_data_route():
    data = request.get_json()
    outlet_id = data.get('outlet_id')
    if not outlet_id:
        return jsonify({'error': 'outlet_id parameter is required'}), 400
    try:
        data = get_data_by_outlet(outlet_id)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
