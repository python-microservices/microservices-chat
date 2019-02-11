# encoding: utf-8

from project.main import create_app, socketio

app = create_app()

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port="8080", debug=True, log_output=True)
