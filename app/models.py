from . import db

class TypeOfTradingPlace(db.Model):
    __tablename__ = 'types_of_trading_places'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class TypeOfHall(db.Model):
    __tablename__ = 'types_of_halls'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Product(db.Model):
    __tablename__ = 'product'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Human(db.Model):
    __tablename__ = 'human'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Outlet(db.Model):
    __tablename__ = 'outlets'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=True, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.types_of_trading_places.id'), nullable=False)
    hall_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.types_of_halls.id'), nullable=True)
    size = db.Column(db.Float, nullable=False)
    rent_and_utility_payments = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type_id': self.type_id,
            'hall_id': self.hall_id,
            'size': self.size,
            'rent_and_utility_payments': self.rent_and_utility_payments
        }

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Staff(db.Model):
    __tablename__ = 'staff'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    job_type_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.job_types.id'), nullable=False)
    human_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.human.id'), nullable=False)
    outlet_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.outlets.id'), nullable=False)
    salary = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'job_type_id': self.job_type_id,
            'human_id': self.human_id,
            'outlet_id': self.outlet_id,
            'salary': self.salary
        }

class ItemsStockOutlet(db.Model):
    __tablename__ = 'items_stock_outlets'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.product.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    outlet_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.outlets.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'price': self.price,
            'outlet_id': self.outlet_id,
            'quantity': self.quantity
        }

class ItemsStockSupplier(db.Model):
    __tablename__ = 'items_stock_suppliers'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.product.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.supplier.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'price': self.price,
            'supplier_id': self.supplier_id
        }


class Sale(db.Model):
    __tablename__ = 'sales'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    human_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.human.id'), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.product.id'), nullable=False)
    outlet_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.outlets.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.staff.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'human_id': self.human_id,
            'product_id': self.product_id,
            'outlet_id': self.outlet_id,
            'price': self.price,
            'quantity': self.quantity,
            'date': self.date,
            'staff_id': self.staff_id
        }

class Request(db.Model):
    __tablename__ = 'requests'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    outlet_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.outlets.id'), nullable=False)
    status = db.Column(db.String(256), default='pending')
    date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'outlet_id': self.outlet_id,
            'status': self.status,
            'date': self.date
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.suppliers.id'), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.requests.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'supplier_id': self.supplier_id,
            'request_id': self.request_id,
            'date': self.date
        }

class Transfer(db.Model):
    __tablename__ = 'transfer'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    outlet_id_from = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.outlets.id'), nullable=False)
    outlet_id_to = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.outlets.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('information_system_trading_org.product.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(256), default='pending')
    date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'outlet_id_from': self.outlet_id_from,
            'outlet_id_to': self.outlet_id_to,
            'product_id': self.product_id,
            'amount': self.amount,
            'status': self.status,
            'date': self.date
        }

class JobType(db.Model):
    __tablename__ = 'job_types'
    __table_args__ = {'schema': 'information_system_trading_org'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }
