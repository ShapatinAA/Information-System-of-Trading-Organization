# app/routes/outlets.py

from flask import Blueprint, request, jsonify
from app.services import outlet_service, get_outlet_profitability, get_outlet_turnover

outlet_bp = Blueprint('outlets', __name__)

@outlet_bp.route('/outlets', methods=['POST'])
def create_outlet():
    data = request.get_json()
    new_outlet = outlet_service.create_outlet(data)
    return jsonify(new_outlet.to_dict()), 201

@outlet_bp.route('/outlets', methods=['GET'])
def get_outlets():
    outlets = outlet_service.get_all_outlets()
    return jsonify([outlet.to_dict() for outlet in outlets]), 200

@outlet_bp.route('/outlets/<int:outlet_id>', methods=['GET'])
def get_outlet(outlet_id):
    outlet = outlet_service.get_outlet_by_id(outlet_id)
    if outlet is None:
        return jsonify({'message': 'Outlet not found'}), 404
    return jsonify(outlet.to_dict()), 200

@outlet_bp.route('/outlets/<int:outlet_id>', methods=['PUT'])
def update_outlet(outlet_id):
    data = request.get_json()
    updated_outlet = outlet_service.update_outlet(outlet_id, data)
    if updated_outlet is None:
        return jsonify({'message': 'Outlet not found'}), 404
    return jsonify(updated_outlet.to_dict()), 200

@outlet_bp.route('/outlets/<int:outlet_id>', methods=['DELETE'])
def delete_outlet(outlet_id):
    deleted_outlet = outlet_service.delete_outlet(outlet_id)
    if deleted_outlet is None:
        return jsonify({'message': 'Outlet not found'}), 404
    return jsonify({'message': 'Outlet deleted'}), 200

@outlet_bp.route('/outlet_profitability', methods=['POST'])
def get_outlet_profitability_route():
    data = request.get_json()
    if not data or 'outlet_id' not in data or 'start_date' not in data or 'end_date' not in data:
        return jsonify({'error': 'outlet_id, start_date, and end_date parameters are required'}), 400

    outlet_id = data['outlet_id']
    start_date = data['start_date']
    end_date = data['end_date']

    try:
        profitability_data = get_outlet_profitability(outlet_id, start_date, end_date)
        if profitability_data['total_sales'] == 0:
            return jsonify({'message': 'No sales data found for the specified criteria'}), 404
        return jsonify(profitability_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@outlet_bp.route('/outlet_turnover', methods=['POST'])
def get_outlet_turnover_route():
    data = request.get_json()
    if not data or 'start_date' not in data or 'end_date' not in data:
        return jsonify({'error': 'start_date and end_date parameters are required'}), 400

    start_date = data['start_date']
    end_date = data['end_date']
    type_id = data.get('type_id')

    try:
        turnover_data = get_outlet_turnover(start_date, end_date, type_id)
        if not turnover_data:
            return jsonify({'message': 'No turnover data found for the specified criteria'}), 404
        return jsonify(turnover_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500