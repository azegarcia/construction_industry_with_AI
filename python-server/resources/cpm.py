from flask_restful import Resource, reqparse
from .cpmrunner import CPMRunner


class CPM(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('price',
                        type=float,
                        required=True,
                        help="This field cannot be left blank!")

    parser.add_argument('store_id',
                        type=int,
                        required=True,
                        help="Every item needs a store id.")

    def get(self, name):
        cpmrunner = CPMRunner(name)
        cpmrunner.run()
        return {'message': 'success'}, 201

