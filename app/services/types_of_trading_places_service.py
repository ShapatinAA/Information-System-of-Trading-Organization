# app/services/types_of_trading_places_service.py

from app.models import db, TypeOfTradingPlace

def create_type(data):
    type_of_trading_place = TypeOfTradingPlace(
        name=data.get('name')
    )
    db.session.add(type_of_trading_place)
    db.session.commit()
    return type_of_trading_place

def get_all_types():
    return TypeOfTradingPlace.query.all()

def get_type_by_id(type_id):
    return TypeOfTradingPlace.query.get(type_id)

def update_type(type_id, data):
    type_of_trading_place = TypeOfTradingPlace.query.get(type_id)
    if not type_of_trading_place:
        return None
    type_of_trading_place.name = data.get('name', type_of_trading_place.name)
    db.session.commit()
    return type_of_trading_place

def delete_type(type_id):
    type_of_trading_place = TypeOfTradingPlace.query.get(type_id)
    if not type_of_trading_place:
        return None
    db.session.delete(type_of_trading_place)
    db.session.commit()
    return type_of_trading_place
