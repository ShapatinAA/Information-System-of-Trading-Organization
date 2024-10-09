# app/services/products_service.py

from app.models import db, Product

def create_product(data):
    product = Product(
        name=data.get('name')
    )
    db.session.add(product)
    db.session.commit()
    return product

def get_all_products():
    return Product.query.all()

def get_product_by_id(product_id):
    return Product.query.get(product_id)

def update_product(product_id, data):
    product = Product.query.get(product_id)
    if not product:
        return None
    product.name = data.get('name', product.name)
    db.session.commit()
    return product

def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return None
    db.session.delete(product)
    db.session.commit()
    return product
