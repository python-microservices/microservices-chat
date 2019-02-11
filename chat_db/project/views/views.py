# encoding: utf-8
from __future__ import absolute_import, print_function, unicode_literals

from flask import jsonify, current_app, request

from project.models.init_db import db
from project.models.models import Message


def list_view():
    """Example endpoint return a list of messages by palette
    """
    current_app.logger.info("Return all messages list")
    query = Message.query.all()

    return jsonify([i.serialize for i in query])


def create_view():
    """Example endpoint return create a messages
    """
    current_app.logger.info("Create messages")
    object_db = Message(**{
        "user_id": request.form["user_id"],
        "username": request.form["username"],
        "message": request.form["message"]
    })
    db.session.add(object_db)
    db.session.commit()

    return jsonify(object_db.serialize)
