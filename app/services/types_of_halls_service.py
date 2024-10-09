# app/services/types_of_halls_service.py
import logging

from app.models import db, TypeOfHall


def create_hall_type(data):
    try:
        type_of_hall = TypeOfHall(
            name=data.get('name')
        )
        logging.debug(f'Created new type_of_hall with name: {type_of_hall.name}')
        db.session.add(type_of_hall)
        logging.debug(f'Added new type_of_hall with name: {type_of_hall.name}')
        db.session.commit()
        logging.debug(f'Commited new type_of_hall with name: {type_of_hall.name}')
        return type_of_hall
    except Exception as e:
        logging.error(f'Error creating outlet: {e}')
        db.session.rollback()
        raise


def get_all_hall_types():
    return TypeOfHall.query.all()


def get_hall_type_by_id(hall_type_id):
    return TypeOfHall.query.get(hall_type_id)


def update_hall_type(hall_type_id, data):
    type_of_hall = TypeOfHall.query.get(hall_type_id)
    if not type_of_hall:
        return None
    type_of_hall.name = data.get('name', type_of_hall.name)
    db.session.commit()
    return type_of_hall


def delete_hall_type(hall_type_id):
    type_of_hall = TypeOfHall.query.get(hall_type_id)
    if not type_of_hall:
        return None
    db.session.delete(type_of_hall)
    db.session.commit()
    return type_of_hall
