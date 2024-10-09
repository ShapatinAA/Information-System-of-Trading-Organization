# app/routes/staff.py

from flask import Blueprint, request, jsonify
from app.services import create_staff, get_all_staff, get_staff_by_id, update_staff, delete_staff, get_staff_salaries

staff_bp = Blueprint('staff', __name__)

@staff_bp.route('/staff', methods=['POST'])
def create_staff_route():
    data = request.get_json()
    new_staff = create_staff(data)
    return jsonify(new_staff.to_dict()), 201

@staff_bp.route('/staff', methods=['GET'])
def get_staff_route():
    staff = get_all_staff()
    return jsonify([member.to_dict() for member in staff]), 200

@staff_bp.route('/staff/<int:staff_id>', methods=['GET'])
def get_staff_member_route(staff_id):
    member = get_staff_by_id(staff_id)
    if member is None:
        return jsonify({'message': 'Staff member not found'}), 404
    return jsonify(member.to_dict()), 200

@staff_bp.route('/staff/<int:staff_id>', methods=['PUT'])
def update_staff_route(staff_id):
    data = request.get_json()
    updated_member = update_staff(staff_id, data)
    if updated_member is None:
        return jsonify({'message': 'Staff member not found'}), 404
    return jsonify(updated_member.to_dict()), 200

@staff_bp.route('/staff/<int:staff_id>', methods=['DELETE'])
def delete_staff_route(staff_id):
    deleted_member = delete_staff(staff_id)
    if deleted_member is None:
        return jsonify({'message': 'Staff member not found'}), 404
    return jsonify({'message': 'Staff member deleted'}), 200

@staff_bp.route('/staff_salaries', methods=['POST'])
def get_staff_salaries_route():
    data = request.get_json()
    outlet_id = data.get('outlet_id')
    type_id = data.get('type_id')

    try:
        salary_data = get_staff_salaries(outlet_id, type_id)
        if not salary_data:
            return jsonify({'message': 'No salary data found for the specified criteria'}), 404
        return jsonify(salary_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
