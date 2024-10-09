# app/routes/types_of_trading_places.py

from flask import Blueprint, request, jsonify
from app.services import types_of_trading_places_service

types_of_trading_places_bp = Blueprint('types_of_trading_places', __name__)

@types_of_trading_places_bp.route('/types_of_trading_places', methods=['POST'])
def create_type():
    data = request.get_json()
    new_type = types_of_trading_places_service.create_type(data)
    return jsonify(new_type.to_dict()), 201

@types_of_trading_places_bp.route('/types_of_trading_places', methods=['GET'])
def get_types():
    types = types_of_trading_places_service.get_all_types()
    return jsonify([type_.to_dict() for type_ in types]), 200

@types_of_trading_places_bp.route('/types_of_trading_places/<int:type_id>', methods=['GET'])
def get_type(type_id):
    type_ = types_of_trading_places_service.get_type_by_id(type_id)
    if type_ is None:
        return jsonify({'message': 'Type not found'}), 404
    return jsonify(type_.to_dict()), 200

@types_of_trading_places_bp.route('/types_of_trading_places/<int:type_id>', methods=['PUT'])
def update_type(type_id):
    data = request.get_json()
    updated_type = types_of_trading_places_service.update_type(type_id, data)
    if updated_type is None:
        return jsonify({'message': 'Type not found'}), 404
    return jsonify(updated_type.to_dict()), 200

@types_of_trading_places_bp.route('/types_of_trading_places/<int:type_id>', methods=['DELETE'])
def delete_type(type_id):
    deleted_type = types_of_trading_places_service.delete_type(type_id)
    if deleted_type is None:
        return jsonify({'message': 'Type not found'}), 404
    return jsonify({'message': 'Type deleted'}), 200
