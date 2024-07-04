import re
from datetime import datetime, timedelta

class WeatherRunner:
    def get_days(self):
        presentday = datetime.now()
        yesterday = presentday - timedelta(1)
        tomorrow = presentday + timedelta(1)

        pday = presentday.strftime('%Y-%m-%d')
        yday = yesterday.strftime('%Y-%m-%d')
        tomday = tomorrow.strftime('%Y-%m-%d')

        return pday, yday, tomday

    def process_csv(self):
        input_data = open('../data/prediction.csv', 'r')
        pday, yday, tomday = self.get_days()
        new_csv = []
        for row in input_data:
            if not re.match('trend', row):
                split_row = row.rstrip('\n').split(',')
                if split_row[1] == pday:
                    today = row
                    new_csv.append(today)
                
        return new_csv

    def determine_weather(self, temp):
        # sunny, cloudy, windy, rainy, stormy
        if int(float(temp)) in range(32, 36):
            weather = "Sunny"
        elif int(float(temp)) in range(27, 31):
            weather = "Partly Cloudy"
        elif int(float(temp)) in range(22, 26):
            weather = "Light Rain Showers"
        else:
            weather = "Cloudy"
        
        return weather
    
    def process_weather_data(self):
        new_csv = self.process_csv()
        new_data = []
        for new in new_csv:
            split_fields = new.split(",")
            data = {
                "date": split_fields[1],
                "six_am": split_fields[2],
                "six_am_status": self.determine_weather(split_fields[2]),
                "nine_am": split_fields[3],
                "nine_am_status": self.determine_weather(split_fields[3]),
                "twelve_pm": split_fields[4],
                "twelve_pm_status": self.determine_weather(split_fields[4]),
                "three_pm": split_fields[5],
                "three_pm_status": self.determine_weather(split_fields[5]),
                "six_pm": split_fields[6],
                "six_pm_status": self.determine_weather(split_fields[6]),
            }
            new_data.append(data)
        
        return new_data

if __name__=="__main__": 
    weatherrunner = WeatherRunner()
    new_data = weatherrunner.process_weather_data()
    print(new_data)