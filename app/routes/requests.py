# app/routes/requests.py

from flask import Blueprint, request, jsonify
from app.services import create_request, get_all_requests, get_request_by_id, update_request, delete_request

requests_bp = Blueprint('requests', __name__)

@requests_bp.route('/requests', methods=['POST'])
def create_request_route():
    data = request.get_json()
    new_request = create_request(data)
    return jsonify(new_request.to_dict()), 201

@requests_bp.route('/requests', methods=['GET'])
def get_requests_route():
    requests = get_all_requests()
    return jsonify([req.to_dict() for req in requests]), 200

@requests_bp.route('/requests/<int:request_id>', methods=['GET'])
def get_request_route(request_id):
    req = get_request_by_id(request_id)
    if req is None:
        return jsonify({'message': 'Request not found'}), 404
    return jsonify(req.to_dict()), 200

@requests_bp.route('/requests/<int:request_id>', methods=['PUT'])
def update_request_route(request_id):
    data = request.get_json()
    updated_request = update_request(request_id, data)
    if updated_request is None:
        return jsonify({'message': 'Request not found'}), 404
    return jsonify(updated_request.to_dict()), 200

@requests_bp.route('/requests/<int:request_id>', methods=['DELETE'])
def delete_request_route(request_id):
    deleted_request = delete_request(request_id)
    if deleted_request is None:
        return jsonify({'message': 'Request not found'}), 404
    return jsonify({'message': 'Request deleted'}), 200
