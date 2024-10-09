# app/services/items_stock_suppliers_service.py
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from app.models import db, ItemsStockSupplier

def create_items_stock_supplier(data):
    try:
        # Attempt to insert the new item
        insert_stmt = text("""
            INSERT INTO information_system_trading_org.items_stock_suppliers (product_id, price, supplier_id)
            VALUES (:product_id, :price, :supplier_id)
            RETURNING id, product_id, price, supplier_id;
        """)

        params = {
            'product_id': data['product_id'],
            'price': data['price'],
            'supplier_id': data['supplier_id']
        }

        result = db.session.execute(insert_stmt, params)
        db.session.commit()  # Commit the transaction

        # Fetch the returned row and convert it to a model instance
        row = result.fetchone()
        if row:
            return ItemsStockSupplier(
                id=row[0],  # Use tuple indexing
                product_id=row[1],
                price=row[2],
                supplier_id=row[3]
            )
        return None
    except IntegrityError as e:
        db.session.rollback()
        raise e
def get_all_items_stock_suppliers():
    return ItemsStockSupplier.query.all()

def get_items_stock_supplier_by_id(item_id):
    return ItemsStockSupplier.query.get(item_id)

def update_items_stock_supplier(item_id, data):
    item = ItemsStockSupplier.query.get(item_id)
    if not item:
        return None
    item.product_id = data.get('product_id', item.product_id)
    item.price = data.get('price', item.price)
    item.supplier_id = data.get('supplier_id', item.supplier_id)
    db.session.commit()
    return item

def delete_items_stock_supplier(item_id):
    item = ItemsStockSupplier.query.get(item_id)
    if not item:
        return None
    db.session.delete(item)
    db.session.commit()
    return item

def get_supplier_supplies(product_id, supplier_id, start_date=None, end_date=None):
    base_query = """
        SELECT s.name AS supplier_name, iss.product_id, SUM(iss.quantity) AS total_quantity, SUM(iss.quantity * iss.price) AS total_revenue
        FROM information_system_trading_org.items_stock_suppliers iss
        JOIN information_system_trading_org.suppliers s ON iss.supplier_id = s.id
        WHERE iss.product_id = :product_id AND iss.supplier_id = :supplier_id
    """

    params = {'product_id': product_id, 'supplier_id': supplier_id}

    if start_date and end_date:
        base_query += " AND iss.date BETWEEN :start_date AND :end_date"
        params['start_date'] = start_date
        params['end_date'] = end_date

    base_query += " GROUP BY s.name, iss.product_id"

    result = db.session.execute(text(base_query), params).fetchall()
    supply_data = [{'supplier_name': row[0], 'product_id': row[1], 'total_quantity': row[2], 'total_revenue': row[3]} for row in result]
    return supply_data
