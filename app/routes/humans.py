# app/routes/humans.py

from flask import Blueprint, request, jsonify
from app.services import create_human, get_all_humans, get_human_by_id, update_human, delete_human

humans_bp = Blueprint('humans', __name__)

@humans_bp.route('/humans', methods=['POST'])
def create_human_route():
    data = request.get_json()
    new_human = create_human(data)
    return jsonify(new_human.to_dict()), 201

@humans_bp.route('/humans', methods=['GET'])
def get_humans_route():
    humans = get_all_humans()
    return jsonify([human.to_dict() for human in humans]), 200

@humans_bp.route('/humans/<int:human_id>', methods=['GET'])
def get_human_route(human_id):
    human = get_human_by_id(human_id)
    if human is None:
        return jsonify({'message': 'Human not found'}), 404
    return jsonify(human.to_dict()), 200

@humans_bp.route('/humans/<int:human_id>', methods=['PUT'])
def update_human_route(human_id):
    data = request.get_json()
    updated_human = update_human(human_id, data)
    if updated_human is None:
        return jsonify({'message': 'Human not found'}), 404
    return jsonify(updated_human.to_dict()), 200

@humans_bp.route('/humans/<int:human_id>', methods=['DELETE'])
def delete_human_route(human_id):
    deleted_human = delete_human(human_id)
    if deleted_human is None:
        return jsonify({'message': 'Human not found'}), 404
    return jsonify({'message': 'Human deleted'}), 200
