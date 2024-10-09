# app/routes/products.py

from flask import Blueprint, request, jsonify
from app.services import create_product, get_all_products, get_product_by_id, update_product, delete_product

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['POST'])
def create_product_route():
    data = request.get_json()
    new_product = create_product(data)
    return jsonify(new_product.to_dict()), 201

@products_bp.route('/products', methods=['GET'])
def get_products_route():
    products = get_all_products()
    return jsonify([product.to_dict() for product in products]), 200

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product_route(product_id):
    product = get_product_by_id(product_id)
    if product is None:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(product.to_dict()), 200

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product_route(product_id):
    data = request.get_json()
    updated_product = update_product(product_id, data)
    if updated_product is None:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(updated_product.to_dict()), 200

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product_route(product_id):
    deleted_product = delete_product(product_id)
    if deleted_product is None:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify({'message': 'Product deleted'}), 200
