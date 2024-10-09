# app/routes/types_of_halls.py

from flask import Blueprint, request, jsonify
from app.services import create_hall_type, get_all_hall_types, get_hall_type_by_id, update_hall_type, delete_hall_type

types_of_halls_bp = Blueprint('types_of_halls', __name__)

@types_of_halls_bp.route('/types_of_halls', methods=['POST'])
def create_hall_type_route():
    data = request.get_json()
    new_type = create_hall_type(data)
    return jsonify(new_type.to_dict()), 201

@types_of_halls_bp.route('/types_of_halls', methods=['GET'])
def get_hall_types_route():
    types = get_all_hall_types()
    return jsonify([type_.to_dict() for type_ in types]), 200

@types_of_halls_bp.route('/types_of_halls/<int:hall_type_id>', methods=['GET'])
def get_hall_type_route(hall_type_id):
    type_ = get_hall_type_by_id(hall_type_id)
    if type_ is None:
        return jsonify({'message': 'Type not found'}), 404
    return jsonify(type_.to_dict()), 200

@types_of_halls_bp.route('/types_of_halls/<int:hall_type_id>', methods=['PUT'])
def update_hall_type_route(hall_type_id):
    data = request.get_json()
    updated_type = update_hall_type(hall_type_id, data)
    if updated_type is None:
        return jsonify({'message': 'Type not found'}), 404
    return jsonify(updated_type.to_dict()), 200

@types_of_halls_bp.route('/types_of_halls/<int:hall_type_id>', methods=['DELETE'])
def delete_hall_type_route(hall_type_id):
    deleted_type = delete_hall_type(hall_type_id)
    if deleted_type is None:
        return jsonify({'message': 'Type not found'}), 404
    return jsonify({'message': 'Type deleted'}), 200
