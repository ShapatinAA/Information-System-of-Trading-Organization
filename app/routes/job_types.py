# app/routes/job_types.py

from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from app.services import (
    create_job_type,
    get_all_job_types,
    get_job_type_by_id,
    update_job_type,
    delete_job_type
)

job_types_bp = Blueprint('job_types', __name__)

@job_types_bp.route('/job_types', methods=['POST'])
def create_job_type_route():
    data = request.get_json()
    try:
        job_type = create_job_type(data)
        return jsonify(job_type.to_dict()), 201
    except IntegrityError as e:
        return jsonify({'error': str(e.orig)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@job_types_bp.route('/job_types', methods=['GET'])
def get_all_job_types_route():
    job_types = get_all_job_types()
    return jsonify([job_type.to_dict() for job_type in job_types]), 200

@job_types_bp.route('/job_types/<int:job_type_id>', methods=['GET'])
def get_job_type_by_id_route(job_type_id):
    job_type = get_job_type_by_id(job_type_id)
    if job_type is None:
        return jsonify({'message': 'Job type not found'}), 404
    return jsonify(job_type.to_dict()), 200

@job_types_bp.route('/job_types/<int:job_type_id>', methods=['PUT'])
def update_job_type_route(job_type_id):
    data = request.get_json()
    job_type = update_job_type(job_type_id, data)
    if job_type is None:
        return jsonify({'message': 'Job type not found'}), 404
    return jsonify(job_type.to_dict()), 200

@job_types_bp.route('/job_types/<int:job_type_id>', methods=['DELETE'])
def delete_job_type_route(job_type_id):
    job_type = delete_job_type(job_type_id)
    if job_type is None:
        return jsonify({'message': 'Job type not found'}), 404
    return jsonify({'message': 'Job type deleted'}), 200
