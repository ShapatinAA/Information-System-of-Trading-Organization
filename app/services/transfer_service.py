# app/services/transfer_service.py
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from app.models import db, Transfer

def create_transfer(data):
    transfer = Transfer(
        outlet_id_from=data.get('outlet_id_from'),
        outlet_id_to=data.get('outlet_id_to'),
        product_id=data.get('product_id'),
        amount=data.get('amount'),
        status=data.get('status', 'pending'),
        date=data.get('date')
    )
    db.session.add(transfer)
    db.session.commit()
    return transfer

def get_all_transfers():
    return Transfer.query.all()

def get_transfer_by_id(transfer_id):
    return Transfer.query.get(transfer_id)

def update_transfer(transfer_id, data):
    transfer = Transfer.query.get(transfer_id)
    if not transfer:
        return None
    transfer.outlet_id_from = data.get('outlet_id_from', transfer.outlet_id_from)
    transfer.outlet_id_to = data.get('outlet_id_to', transfer.outlet_id_to)
    transfer.product_id = data.get('product_id', transfer.product_id)
    transfer.amount = data.get('amount', transfer.amount)
    transfer.status = data.get('status', transfer.status)
    transfer.date = data.get('date', transfer.date)
    db.session.commit()
    return transfer

def delete_transfer(transfer_id):
    transfer = Transfer.query.get(transfer_id)
    if not transfer:
        return None
    db.session.delete(transfer)
    db.session.commit()
    return transfer

def update_transfer_status(transfer_id, status):
    try:
        # Update the status of the transfer
        update_stmt = text("""
            UPDATE information_system_trading_org.transfer
            SET status = :status
            WHERE id = :transfer_id
            RETURNING *;
        """)

        params = {
            'transfer_id': transfer_id,
            'status': status
        }

        result = db.session.execute(update_stmt, params)
        db.session.commit()  # Commit the transaction
        row = result.fetchone()
        if row:
            return Transfer(
                id=row[0],
                product_id=row[1],
                amount=row[2],
                outlet_id_from=row[3],
                outlet_id_to=row[4],
                status=row[5],
                date=row[6]
            )
        return None
    except IntegrityError as e:
        db.session.rollback()
        raise e
