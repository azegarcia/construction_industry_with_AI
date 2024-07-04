import os

from flask import Flask
from flask_restful import Api

from resources.cpm import CPM


app = Flask(__name__)
api = Api(app)

api.add_resource(CPM, '/cpm/<string:name>')

if __name__ == '__main__':
    app.run(port=5000, debug=True)  # important to mention debug=True