from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField, DateField, SubmitField
from wtforms.validators import DataRequired

class OutletForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    type_id = IntegerField('Type ID', validators=[DataRequired()])
    hall_id = IntegerField('Hall ID', validators=[DataRequired()])
    size = FloatField('Size', validators=[DataRequired()])
    rent_and_utility_payments = FloatField('Rent and Utility Payments', validators=[DataRequired()])
    submit = SubmitField('Add Outlet')

class SaleForm(FlaskForm):
    human_id = IntegerField('Human ID', validators=[DataRequired()])
    product_id = IntegerField('Product ID', validators=[DataRequired()])
    outlet_id = IntegerField('Outlet ID', validators=[DataRequired()])
    price = FloatField('Price', validators=[DataRequired()])
    quantity = IntegerField('Quantity', validators=[DataRequired()])
    date = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])
    staff_id = IntegerField('Staff ID', validators=[DataRequired()])
    submit = SubmitField('Add Sale')
