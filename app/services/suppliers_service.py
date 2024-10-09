# app/services/suppliers_service.py
from sqlalchemy import text

from app.models import db, Supplier

def create_supplier(data):
    supplier = Supplier(
        name=data.get('name')
    )
    db.session.add(supplier)
    db.session.commit()
    return supplier

def get_all_suppliers():
    return Supplier.query.all()

def get_supplier_by_id(supplier_id):
    return Supplier.query.get(supplier_id)

def update_supplier(supplier_id, data):
    supplier = Supplier.query.get(supplier_id)
    if not supplier:
        return None
    supplier.name = data.get('name', supplier.name)
    db.session.commit()
    return supplier

def delete_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)
    if not supplier:
        return None
    db.session.delete(supplier)
    db.session.commit()
    return supplier

def get_suppliers_by_product_type(product_id):
    sql = """
    SELECT s.id, s.name
    FROM information_system_trading_org.suppliers s
    JOIN information_system_trading_org.order_items oi ON s.id = oi.supplier_id
    WHERE oi.product_id = :product_id
    GROUP BY s.id, s.name;
    """
    result = db.session.execute(text(sql), {'product_id': product_id}).fetchall()
    suppliers = [Supplier(id=row[0], name=row[1]) for row in result]
    total_suppliers = len(suppliers)

    return suppliers, total_suppliers

def get_suppliers_by_min_volume(product_id, min_volume, start_date=None, end_date=None):
    if start_date and end_date:
        sql = """
        SELECT s.id, s.name
        FROM information_system_trading_org.suppliers s
        JOIN information_system_trading_org.order_items oi ON s.id = oi.supplier_id
        WHERE oi.product_id = :product_id
        AND oi.date BETWEEN :start_date AND :end_date
        GROUP BY s.id, s.name
        HAVING SUM(oi.quantity) >= :min_volume;
        """
        params = {'product_id': product_id, 'min_volume': min_volume, 'start_date': start_date, 'end_date': end_date}
    else:
        sql = """
        SELECT s.id, s.name
        FROM information_system_trading_org.suppliers s
        JOIN information_system_trading_org.order_items oi ON s.id = oi.supplier_id
        WHERE oi.product_id = :product_id
        GROUP BY s.id, s.name
        HAVING SUM(oi.quantity) >= :min_volume;
        """
        params = {'product_id': product_id, 'min_volume': min_volume}

    result = db.session.execute(text(sql), params).fetchall()
    suppliers = [Supplier(id=row[0], name=row[1]) for row in result]
    total_suppliers = len(suppliers)

    return suppliers, total_suppliers
