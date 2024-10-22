from flask_restful import Resource, reqparse
from .chatgptrunner import ChatgptRunner

class Chatgpt(Resource):
    def get(self):
        chatgptrunner = ChatgptRunner()
        new_data = chatgptrunner.processGemini()
        return {'message': 'success', 'data': new_data}, 200
