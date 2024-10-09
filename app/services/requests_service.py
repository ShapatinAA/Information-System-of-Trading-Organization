# app/services/requests_service.py

from app.models import db, Request

def create_request(data):
    request = Request(
        product_id=data.get('product_id'),
        quantity=data.get('quantity'),
        outlet_id=data.get('outlet_id'),
        status=data.get('status', 'pending'),
        date=data.get('date')
    )
    db.session.add(request)
    db.session.commit()
    return request

def get_all_requests():
    return Request.query.all()

def get_request_by_id(request_id):
    return Request.query.get(request_id)

def update_request(request_id, data):
    request = Request.query.get(request_id)
    if not request:
        return None
    request.product_id = data.get('product_id', request.product_id)
    request.quantity = data.get('quantity', request.quantity)
    request.outlet_id = data.get('outlet_id', request.outlet_id)
    request.status = data.get('status', request.status)
    request.date = data.get('date', request.date)
    db.session.commit()
    return request

def delete_request(request_id):
    request = Request.query.get(request_id)
    if not request:
        return None
    db.session.delete(request)
    db.session.commit()
    return request
