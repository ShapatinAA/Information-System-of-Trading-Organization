# app/services/staff_service.py
from sqlalchemy import text

from app.models import db, Staff

def create_staff(data):
    staff = Staff(
        job_type_id=data.get('job_type_id'),
        human_id=data.get('human_id'),
        outlet_id=data.get('outlet_id')
    )
    db.session.add(staff)
    db.session.commit()
    return staff

def get_all_staff():
    return Staff.query.all()

def get_staff_by_id(staff_id):
    return Staff.query.get(staff_id)

def update_staff(staff_id, data):
    staff = Staff.query.get(staff_id)
    if not staff:
        return None
    staff.job_type_id = data.get('job_type_id', staff.job_type_id)
    staff.human_id = data.get('human_id', staff.human_id)
    staff.outlet_id = data.get('outlet_id', staff.outlet_id)
    staff.salary = data.get('salary', staff.salary)
    db.session.commit()
    return staff

def delete_staff(staff_id):
    staff = Staff.query.get(staff_id)
    if not staff:
        return None
    db.session.delete(staff)
    db.session.commit()
    return staff

def get_staff_salaries(outlet_id=None, type_id=None):
    base_query = """
        SELECT s.id AS staff_id, s.salary, o.name AS outlet_name, o.id AS outlet_id
        FROM information_system_trading_org.staff s
        JOIN information_system_trading_org.outlets o ON s.outlet_id = o.id
    """

    if outlet_id:
        base_query += " WHERE o.id = :outlet_id"
        params = {'outlet_id': outlet_id}
    elif type_id:
        base_query += " WHERE o.type_id = :type_id"
        params = {'type_id': type_id}
    else:
        params = {}

    result = db.session.execute(text(base_query), params).fetchall()
    salary_data = [{'staff_id': row[0], 'salary': row[1], 'outlet_name': row[2], 'outlet_id': row[3]} for row in result]
    return salary_data
