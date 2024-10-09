# app/services/sales_service.py
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.models import db, Sale, Human


def create_sale(data):
    try:
        # Attempt to insert the new sale
        insert_stmt = text("""
            INSERT INTO information_system_trading_org.sales (human_id, product_id, outlet_id, date, price, quantity, staff_id)
            VALUES (:human_id, :product_id, :outlet_id, :date, :price, :quantity, :staff_id)
            RETURNING *;
        """)

        params = {
            'human_id': data['human_id'],
            'product_id': data['product_id'],
            'outlet_id': data['outlet_id'],
            'date': data['date'],
            'price': data['price'],
            'quantity': data['quantity'],
            'staff_id': data['staff_id']
        }

        result = db.session.execute(insert_stmt, params)
        db.session.commit()  # Commit the transaction
        row = result.fetchone()
        if row:
            return Sale(
                id=row[0],
                human_id=row[1],
                product_id=row[2],
                outlet_id=row[3],
                date=row[4],
                price=row[5],
                quantity=row[6],
                staff_id=row[7]
            )
        return None
    except IntegrityError as e:
        db.session.rollback()
        raise e
    except SQLAlchemyError as e:
        db.session.rollback()
        raise e

def get_all_sales():
    return Sale.query.all()

def get_sale_by_id(sale_id):
    return Sale.query.get(sale_id)

def update_sale(sale_id, data):
    sale = Sale.query.get(sale_id)
    if not sale:
        return None
    sale.human_id = data.get('human_id', sale.human_id)
    sale.product_id = data.get('product_id', sale.product_id)
    sale.outlet_id = data.get('outlet_id', sale.outlet_id)
    sale.price = data.get('price', sale.price)
    sale.quantity = data.get('quantity', sale.quantity)
    sale.date = data.get('date', sale.date)
    sale.staff_id = data.get('staff_id', sale.staff_id)
    db.session.commit()
    return sale

def delete_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if not sale:
        return None
    db.session.delete(sale)
    db.session.commit()
    return sale

def get_buyers_by_product_and_period(product_id, start_date, end_date):
    sql = """
    SELECT h.id, h.name
    FROM information_system_trading_org.human h
    JOIN information_system_trading_org.sales s ON h.id = s.human_id
    WHERE s.product_id = :product_id
    AND s.date BETWEEN :start_date AND :end_date
    GROUP BY h.id, h.name
    UNION
    SELECT NULL, 'Unknown Buyer'
    FROM information_system_trading_org.sales s
    WHERE s.human_id IS NULL AND s.product_id = :product_id
    AND s.date BETWEEN :start_date AND :end_date
    GROUP BY s.human_id;
    """
    params = {'product_id': product_id, 'start_date': start_date, 'end_date': end_date}

    result = db.session.execute(text(sql), params).fetchall()
    buyers = [Human(id=row[0], name=row[1]) if row[0] is not None else {'id': None, 'name': 'Unknown Buyer'} for row in result]
    total_buyers = len(buyers)

    return buyers, total_buyers

def get_buyers_by_product_and_volume(product_id, min_volume):
    sql = """
    SELECT h.id, h.name
    FROM information_system_trading_org.human h
    JOIN information_system_trading_org.sales s ON h.id = s.human_id
    WHERE s.product_id = :product_id
    GROUP BY h.id, h.name
    HAVING SUM(s.quantity) >= :min_volume
    UNION
    SELECT NULL, 'Unknown Buyer'
    FROM information_system_trading_org.sales s
    WHERE s.human_id IS NULL AND s.product_id = :product_id
    GROUP BY s.human_id
    HAVING SUM(s.quantity) >= :min_volume;
    """
    params = {'product_id': product_id, 'min_volume': min_volume}

    result = db.session.execute(text(sql), params).fetchall()
    buyers = [Human(id=row[0], name=row[1]) if row[0] is not None else {'id': None, 'name': 'Unknown Buyer'} for row in result]
    total_buyers = len(buyers)

    return buyers, total_buyers

def get_seller_output(start_date, end_date, type_id=None):
    base_query = """
        SELECT sa.staff_id, SUM(sa.quantity) AS total_quantity, SUM(sa.quantity * sa.price) AS total_revenue
        FROM information_system_trading_org.sales sa
        JOIN information_system_trading_org.staff s ON sa.staff_id = s.id
        JOIN information_system_trading_org.outlets o ON s.outlet_id = o.id
        WHERE sa.date BETWEEN :start_date AND :end_date
    """

    if type_id:
        base_query += " AND o.type_id = :type_id"
        params = {'start_date': start_date, 'end_date': end_date, 'type_id': type_id}
    else:
        params = {'start_date': start_date, 'end_date': end_date}

    base_query += " GROUP BY sa.staff_id"

    result = db.session.execute(text(base_query), params).fetchall()
    output_data = [{'staff_id': row[0], 'total_quantity': row[1], 'total_revenue': row[2]} for row in result]
    return output_data

def get_seller_output_by_outlet(staff_id, outlet_id, start_date, end_date):
    query = """
        SELECT sa.staff_id, SUM(sa.quantity) AS total_quantity, SUM(sa.quantity * sa.price) AS total_revenue
        FROM information_system_trading_org.sales sa
        JOIN information_system_trading_org.staff s ON sa.staff_id = s.id
        WHERE sa.staff_id = :staff_id AND s.outlet_id = :outlet_id AND sa.date BETWEEN :start_date AND :end_date
        GROUP BY sa.staff_id
    """
    params = {'staff_id': staff_id, 'outlet_id': outlet_id, 'start_date': start_date, 'end_date': end_date}

    result = db.session.execute(text(query), params).fetchall()
    output_data = [{'staff_id': row[0], 'total_quantity': row[1], 'total_revenue': row[2]} for row in result]
    return output_data

def get_product_sales(product_id, start_date, end_date, outlet_id=None, type_id=None):
    base_query = """
        SELECT o.name AS outlet_name, o.id AS outlet_id, SUM(sa.quantity) AS total_quantity, SUM(sa.quantity * sa.price) AS total_revenue
        FROM information_system_trading_org.sales sa
        JOIN information_system_trading_org.outlets o ON sa.outlet_id = o.id
        WHERE sa.product_id = :product_id AND sa.date BETWEEN :start_date AND :end_date
    """

    if outlet_id:
        base_query += " AND o.id = :outlet_id"
        params = {'product_id': product_id, 'start_date': start_date, 'end_date': end_date, 'outlet_id': outlet_id}
    elif type_id:
        base_query += " AND o.type_id = :type_id"
        params = {'product_id': product_id, 'start_date': start_date, 'end_date': end_date, 'type_id': type_id}
    else:
        params = {'product_id': product_id, 'start_date': start_date, 'end_date': end_date}

    base_query += " GROUP BY o.name, o.id"

    result = db.session.execute(text(base_query), params).fetchall()
    sales_data = [{'outlet_name': row[0], 'outlet_id': row[1], 'total_quantity': row[2], 'total_revenue': row[3]} for row in result]
    return sales_data


def get_buyers_of_product(product_id, start_date=None, end_date=None, outlet_id=None, type_id=None):
    base_query = """
        SELECT h.id AS buyer_id, h.name AS buyer_name, sa.date, o.name AS outlet_name, SUM(sa.quantity) AS total_quantity, SUM(sa.quantity * sa.price) AS total_value
        FROM information_system_trading_org.sales sa
        JOIN information_system_trading_org.human h ON sa.human_id = h.id
        JOIN information_system_trading_org.outlets o ON sa.outlet_id = o.id
        WHERE sa.product_id = :product_id
    """

    params = {'product_id': product_id}

    if start_date and end_date:
        base_query += " AND sa.date BETWEEN :start_date AND :end_date"
        params.update({'start_date': start_date, 'end_date': end_date})

    if outlet_id:
        base_query += " AND o.id = :outlet_id"
        params['outlet_id'] = outlet_id
    elif type_id:
        base_query += " AND o.type_id = :type_id"
        params['type_id'] = type_id

    base_query += " GROUP BY h.id, h.name, sa.date, o.name"

    result = db.session.execute(text(base_query), params).fetchall()
    buyers_data = [
        {
            'buyer_id': row[0],
            'buyer_name': row[1],
            'date': row[2],
            'outlet_name': row[3],
            'total_quantity': row[4],
            'total_value': row[5]
        }
        for row in result
    ]
    return buyers_data

def get_most_active_buyers(start_date=None, end_date=None, outlet_id=None, type_id=None, limit=10):
    base_query = """
        SELECT h.id AS buyer_id, h.name AS buyer_name, COUNT(sa.id) AS purchase_count, SUM(sa.quantity) AS total_quantity, SUM(sa.quantity * sa.price) AS total_spent
        FROM information_system_trading_org.sales sa
        JOIN information_system_trading_org.human h ON sa.human_id = h.id
        JOIN information_system_trading_org.outlets o ON sa.outlet_id = o.id
        WHERE sa.human_id IS NOT NULL
    """

    params = {}

    if start_date and end_date:
        base_query += " AND sa.date BETWEEN :start_date AND :end_date"
        params.update({'start_date': start_date, 'end_date': end_date})

    if outlet_id:
        base_query += " AND o.id = :outlet_id"
        params['outlet_id'] = outlet_id
    elif type_id:
        base_query += " AND o.type_id = :type_id"
        params['type_id'] = type_id

    base_query += " GROUP BY h.id, h.name ORDER BY purchase_count DESC LIMIT :limit"
    params['limit'] = limit

    result = db.session.execute(text(base_query), params).fetchall()
    buyers_data = [
        {
            'buyer_id': row[0],
            'buyer_name': row[1],
            'purchase_count': row[2],
            'total_quantity': row[3],
            'total_spent': row[4]
        }
        for row in result
    ]
    return buyers_data

def get_data_by_outlet(outlet_id):
    try:
        products_query = """
            SELECT p.id, p.name, iso.quantity 
            FROM information_system_trading_org.product p
            JOIN information_system_trading_org.items_stock_outlets iso ON p.id = iso.product_id
            WHERE iso.outlet_id = :outlet_id
        """
        staff_query = """
            SELECT s.id, h.name 
            FROM information_system_trading_org.staff s
            JOIN information_system_trading_org.human h ON s.human_id = h.id
            WHERE s.outlet_id = :outlet_id
        """

        products_result = db.session.execute(text(products_query), {'outlet_id': outlet_id}).fetchall()
        staff_result = db.session.execute(text(staff_query), {'outlet_id': outlet_id}).fetchall()

        products_data = [{'id': row.id, 'name': row.name, 'quantity': row.quantity} for row in products_result]
        staff_data = [{'id': row.id, 'name': row.name} for row in staff_result]

        return {
            'products': products_data,
            'staff': staff_data
        }
    except Exception as e:
        raise e
