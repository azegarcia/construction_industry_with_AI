from flask_restful import Resource, reqparse
from .weatherrunner import WeatherRunner


class Weather(Resource):
    def get(self):
        weatherrunner = WeatherRunner()
        new_data = weatherrunner.process_weather_data()
        return {'message': 'success', 'data': new_data}, 200

