# app/services/humans_service.py

from app.models import db, Human

def create_human(data):
    human = Human(
        name=data.get('name')
    )
    db.session.add(human)
    db.session.commit()
    return human

def get_all_humans():
    return Human.query.all()

def get_human_by_id(human_id):
    return Human.query.get(human_id)

def update_human(human_id, data):
    human = Human.query.get(human_id)
    if not human:
        return None
    human.name = data.get('name', human.name)
    db.session.commit()
    return human

def delete_human(human_id):
    human = Human.query.get(human_id)
    if not human:
        return None
    db.session.delete(human)
    db.session.commit()
    return human
