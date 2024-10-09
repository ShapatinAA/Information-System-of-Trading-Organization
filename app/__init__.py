# app/__init__.py
import logging

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)  # Enable CORS

    logging.basicConfig(filename='app.log', level=logging.DEBUG,
                        format='%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')

    db.init_app(app)

    from .routes import register_routes
    register_routes(app)

    return app
