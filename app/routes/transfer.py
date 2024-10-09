# app/routes/transfer.py

from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from app.services import create_transfer, get_all_transfers, get_transfer_by_id, update_transfer, delete_transfer
from app.services.transfer_service import update_transfer_status

transfer_bp = Blueprint('transfer', __name__)

@transfer_bp.route('/transfers', methods=['POST'])
def create_transfer_route():
    data = request.get_json()
    new_transfer = create_transfer(data)
    return jsonify(new_transfer.to_dict()), 201

@transfer_bp.route('/transfers', methods=['GET'])
def get_transfers_route():
    transfers = get_all_transfers()
    return jsonify([transfer.to_dict() for transfer in transfers]), 200

@transfer_bp.route('/transfers/<int:transfer_id>', methods=['GET'])
def get_transfer_route(transfer_id):
    transfer = get_transfer_by_id(transfer_id)
    if transfer is None:
        return jsonify({'message': 'Transfer not found'}), 404
    return jsonify(transfer.to_dict()), 200

@transfer_bp.route('/transfers/<int:transfer_id>', methods=['PUT'])
def update_transfer_route(transfer_id):
    data = request.get_json()
    updated_transfer = update_transfer(transfer_id, data)
    if updated_transfer is None:
        return jsonify({'message': 'Transfer not found'}), 404
    return jsonify(updated_transfer.to_dict()), 200

@transfer_bp.route('/transfers/<int:transfer_id>', methods=['DELETE'])
def delete_transfer_route(transfer_id):
    deleted_transfer = delete_transfer(transfer_id)
    if deleted_transfer is None:
        return jsonify({'message': 'Transfer not found'}), 404
    return jsonify({'message': 'Transfer deleted'}), 200

@transfer_bp.route('/transfers/<int:transfer_id>/status', methods=['PUT'])
def update_transfer_status_route(transfer_id):
    data = request.get_json()
    try:
        status = data.get('status')
        transfer = update_transfer_status(transfer_id, status)
        if transfer:
            return jsonify(transfer.to_dict()), 200
        else:
            return jsonify({'message': 'Transfer status updated successfully.'}), 200
    except IntegrityError as e:
        return jsonify({'error': str(e.orig)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400
