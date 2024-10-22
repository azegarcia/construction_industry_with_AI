import os

from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from resources.cpm import CPM
from resources.chatgpt import Chatgpt

app = Flask(__name__)
api = Api(app)
CORS(app)

api.add_resource(CPM, '/cpm/<string:name>')
api.add_resource(Chatgpt, '/gpt')

if __name__ == '__main__':
    app.run(port=5000, debug=True)  # important to mention debug=True
