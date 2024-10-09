# app/services/items_stock_outlets_service.py
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import ObjectDeletedError

from app.models import db, ItemsStockOutlet, ItemsStockSupplier


def create_items_stock_outlet(data):
    try:
        # Attempt to insert the new item
        insert_stmt = text("""
            INSERT INTO information_system_trading_org.items_stock_outlets (product_id, price, outlet_id, quantity)
            VALUES (:product_id, :price, :outlet_id, :quantity)
            RETURNING *;
        """)

        params = {
            'product_id': data['product_id'],
            'price': data['price'],
            'outlet_id': data['outlet_id'],
            'quantity': data['quantity']
        }

        result = db.session.execute(insert_stmt, params)
        db.session.commit()  # Commit the transaction

        # Fetch the returned row and convert it to a model instance
        row = result.fetchone()
        if row:
            return ItemsStockSupplier(
                id=row[0],
                product_id=row[1],
                price=row[2],
                supplier_id=row[3]
            )
        return None
    except IntegrityError as e:
        db.session.rollback()
        raise e
def get_all_items_stock_outlets():
    return ItemsStockOutlet.query.all()

def get_items_stock_outlet_by_id(item_id):
    return ItemsStockOutlet.query.get(item_id)

def update_items_stock_outlet(item_id, data):
    item = ItemsStockOutlet.query.get(item_id)
    if not item:
        return None

    try:
        item.product_id = data.get('product_id', item.product_id)
        item.price = data.get('price', item.price)
        item.outlet_id = data.get('outlet_id', item.outlet_id)
        item.quantity = data.get('quantity', item.quantity)
        db.session.commit()

        # Check if the item still exists after the commit
        updated_item = ItemsStockOutlet.query.get(item_id)
        if not updated_item:
            return None

        return updated_item
    except Exception as e:
        db.session.rollback()
        raise e
def delete_items_stock_outlet(item_id):
    item = ItemsStockOutlet.query.get(item_id)
    if not item:
        return None
    db.session.delete(item)
    db.session.commit()
    return item

def get_items_by_outlet(outlet_id):
    query = """
        SELECT p.id, p.name, iso.quantity 
        FROM information_system_trading_org.items_stock_outlets iso
        JOIN information_system_trading_org.product p ON iso.product_id = p.id
        WHERE iso.outlet_id = :outlet_id;
    """
    params = {'outlet_id': outlet_id}
    result = db.session.execute(text(query), params).fetchall()
    items = [{'id': row[0], 'name': row[1], 'quantity': row[2]} for row in result]
    return items

def get_product_details(product_id, outlet_id=None, type_id=None):
    base_query = """
        SELECT o.name AS outlet_name, o.id AS outlet_id, iso.price, iso.quantity 
        FROM information_system_trading_org.items_stock_outlets iso
        JOIN information_system_trading_org.outlets o ON iso.outlet_id = o.id
        WHERE iso.product_id = :product_id
    """

    if outlet_id:
        base_query += " AND o.id = :outlet_id"
        params = {'product_id': product_id, 'outlet_id': outlet_id}
    elif type_id:
        base_query += " AND o.type_id = :type_id"
        params = {'product_id': product_id, 'type_id': type_id}
    else:
        params = {'product_id': product_id}

    result = db.session.execute(text(base_query), params).fetchall()
    details = [{'outlet_name': row[0], 'outlet_id': row[1], 'price': row[2], 'quantity': row[3]} for row in result]
    return details
