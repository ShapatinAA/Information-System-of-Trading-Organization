# app/services/outlet_service.py
import logging

from sqlalchemy import text

from app.models import db, Outlet

def create_outlet(data):
    outlet = Outlet(
        name=data.get('name'),
        type_id=data.get('type_id'),
        hall_id=data.get('hall_id'),
        size=data.get('size'),
        rent_and_utility_payments=data.get('rent_and_utility_payments')
    )
    db.session.add(outlet)
    db.session.commit()
    logging.debug(f'Created new outlet: {outlet}')
    return outlet

def get_all_outlets():
    logging.debug(f'Retrieved outlets: {Outlet.query.all()}')
    return Outlet.query.all()

def get_outlet_by_id(outlet_id):
    return Outlet.query.get(outlet_id)

def update_outlet(outlet_id, data):
    outlet = Outlet.query.get(outlet_id)
    if not outlet:
        return None
    outlet.name = data.get('name', outlet.name)
    outlet.type_id = data.get('type_id', outlet.type_id)
    outlet.hall_id = data.get('hall_id', outlet.hall_id)
    outlet.size = data.get('size', outlet.size)
    outlet.rent_and_utility_payments = data.get('rent_and_utility_payments', outlet.rent_and_utility_payments)
    db.session.commit()
    return outlet

def delete_outlet(outlet_id):
    outlet = Outlet.query.get(outlet_id)
    if not outlet:
        return None
    db.session.delete(outlet)
    db.session.commit()
    return outlet

def get_outlet_profitability(outlet_id, start_date, end_date):
    sales_query = """
        SELECT SUM(sa.quantity * sa.price) AS total_sales
        FROM information_system_trading_org.sales sa
        WHERE sa.outlet_id = :outlet_id AND sa.date BETWEEN :start_date AND :end_date
    """

    overhead_query = """
        SELECT o.rent_and_utility_payments + SUM(s.salary * (
            (DATE_PART('year', age(:end_date, :start_date)) * 12) + DATE_PART('month', age(:end_date, :start_date))
        )) AS total_overheads
        FROM information_system_trading_org.outlets o
        JOIN information_system_trading_org.staff s ON s.outlet_id = o.id
        WHERE o.id = :outlet_id
        GROUP BY o.rent_and_utility_payments
    """

    params = {'outlet_id': outlet_id, 'start_date': start_date, 'end_date': end_date}

    sales_result = db.session.execute(text(sales_query), params).fetchone()
    total_sales = sales_result[0] if sales_result[0] is not None else 0

    overhead_result = db.session.execute(text(overhead_query), params).fetchone()
    total_overheads = overhead_result[0] if overhead_result[0] is not None else 0

    if total_overheads == 0:
        profitability_ratio = None
    else:
        profitability_ratio = total_sales / total_overheads

    profitability_data = {
        'outlet_id': outlet_id,
        'total_sales': total_sales,
        'total_overheads': total_overheads,
        'profitability_ratio': profitability_ratio
    }

    return profitability_data

def get_outlet_turnover(start_date, end_date, type_id=None):
    base_query = """
        SELECT o.id AS outlet_id, o.name AS outlet_name, SUM(sa.quantity) AS total_quantity, SUM(sa.quantity * sa.price) AS total_turnover
        FROM information_system_trading_org.sales sa
        JOIN information_system_trading_org.outlets o ON sa.outlet_id = o.id
        WHERE sa.date BETWEEN :start_date AND :end_date
    """

    params = {'start_date': start_date, 'end_date': end_date}

    if type_id:
        base_query += " AND o.type_id = :type_id"
        params['type_id'] = type_id

    base_query += " GROUP BY o.id, o.name"

    result = db.session.execute(text(base_query), params).fetchall()
    turnover_data = [
        {
            'outlet_id': row[0],
            'outlet_name': row[1],
            'total_quantity': row[2],
            'total_turnover': row[3]
        }
        for row in result
    ]
    return turnover_data
