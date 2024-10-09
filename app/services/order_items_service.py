# app/services/order_items_service.py
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from app.models import db, OrderItem

def create_order_item(data):
    try:
        # Attempt to insert the new order item
        insert_stmt = text("""
            INSERT INTO information_system_trading_org.order_items (product_id, quantity, supplier_id, request_id, date)
            VALUES (:product_id, :quantity, :supplier_id, :request_id, :date)
            RETURNING *;
        """)

        params = {
            'product_id': data['product_id'],
            'quantity': data['quantity'],
            'supplier_id': data['supplier_id'],
            'request_id': data['request_id'],
            'date': data['date']
        }

        result = db.session.execute(insert_stmt, params)
        db.session.commit()  # Commit the transaction
        row = result.fetchone()
        if row:
            return OrderItem(
                id=row[0],
                product_id=row[1],
                quantity=row[2],
                supplier_id=row[3],
                request_id=row[4],
                date=row[5]
            )
        return None
    except IntegrityError as e:
        db.session.rollback()
        raise e
def get_all_order_items():
    return OrderItem.query.all()

def get_order_item_by_id(order_item_id):
    return OrderItem.query.get(order_item_id)

def update_order_item(order_item_id, data):
    order_item = OrderItem.query.get(order_item_id)
    if not order_item:
        return None
    order_item.product_id = data.get('product_id', order_item.product_id)
    order_item.quantity = data.get('quantity', order_item.quantity)
    order_item.supplier_id = data.get('supplier_id', order_item.supplier_id)
    order_item.request_id = data.get('request_id', order_item.request_id)
    order_item.date = data.get('date', order_item.date)
    db.session.commit()
    return order_item

def delete_order_item(order_item_id):
    order_item = OrderItem.query.get(order_item_id)
    if not order_item:
        return None
    db.session.delete(order_item)
    db.session.commit()
    return order_item

def get_supplier_deliveries(product_id, supplier_id, start_date=None, end_date=None):
    base_query = """
        SELECT oi.product_id, oi.supplier_id, SUM(oi.quantity) AS total_quantity, SUM(oi.quantity * iss.price) AS total_value
        FROM information_system_trading_org.order_items oi
        JOIN information_system_trading_org.items_stock_suppliers iss 
        ON oi.supplier_id = iss.supplier_id AND oi.product_id = iss.product_id
        WHERE oi.product_id = :product_id AND oi.supplier_id = :supplier_id
    """

    params = {'product_id': product_id, 'supplier_id': supplier_id}

    if start_date and end_date:
        base_query += " AND oi.date BETWEEN :start_date AND :end_date"
        params.update({'start_date': start_date, 'end_date': end_date})

    base_query += " GROUP BY oi.product_id, oi.supplier_id"

    result = db.session.execute(text(base_query), params).fetchall()
    deliveries_data = [{'product_id': row[0], 'supplier_id': row[1], 'total_quantity': row[2], 'total_value': row[3]} for row in result]
    return deliveries_data

def get_order_items_by_request(request_id):
    query = """
        SELECT oi.id, oi.product_id, oi.quantity, oi.supplier_id, oi.date, p.name AS product_name, s.name AS supplier_name
        FROM information_system_trading_org.order_items oi
        JOIN information_system_trading_org.product p ON oi.product_id = p.id
        JOIN information_system_trading_org.suppliers s ON oi.supplier_id = s.id
        WHERE oi.request_id = :request_id
    """

    params = {'request_id': request_id}

    result = db.session.execute(text(query), params).fetchall()
    order_items = [
        {
            'id': row[0],
            'product_id': row[1],
            'quantity': row[2],
            'supplier_id': row[3],
            'date': row[4],
            'product_name': row[5],
            'supplier_name': row[6]
        }
        for row in result
    ]
    return order_items

def get_data_by_request(request_id):
    try:
        request_query = """
            SELECT r.id, p.name AS product_name, r.quantity, o.name AS outlet_name 
            FROM information_system_trading_org.requests r
            JOIN information_system_trading_org.product p ON r.product_id = p.id
            JOIN information_system_trading_org.outlets o ON r.outlet_id = o.id
            WHERE r.id = :request_id
        """

        products_query = """
            SELECT id, name 
            FROM information_system_trading_org.product
        """

        suppliers_query = """
            SELECT id, name 
            FROM information_system_trading_org.suppliers
        """

        request_result = db.session.execute(text(request_query), {'request_id': request_id}).fetchone()
        products_result = db.session.execute(text(products_query)).fetchall()
        suppliers_result = db.session.execute(text(suppliers_query)).fetchall()

        request_data = {
            'id': request_result.id,
            'product_name': request_result.product_name,
            'quantity': request_result.quantity,
            'outlet_name': request_result.outlet_name
        }

        products_data = [{'id': row.id, 'name': row.name} for row in products_result]
        suppliers_data = [{'id': row.id, 'name': row.name} for row in suppliers_result]

        return {
            'request': request_data,
            'products': products_data,
            'suppliers': suppliers_data
        }
    except Exception as e:
        raise e

def get_pending_requests():
    try:
        requests_query = """
            SELECT r.id, p.name AS product_name, r.quantity, o.name AS outlet_name 
            FROM information_system_trading_org.requests r
            JOIN information_system_trading_org.product p ON r.product_id = p.id
            JOIN information_system_trading_org.outlets o ON r.outlet_id = o.id
            WHERE r.status = 'pending'
        """

        requests_result = db.session.execute(text(requests_query)).fetchall()
        requests_data = [{'id': row.id, 'product_name': row.product_name, 'quantity': row.quantity, 'outlet_name': row.outlet_name} for row in requests_result]

        return {
            'requests': requests_data
        }
    except Exception as e:
        raise e
