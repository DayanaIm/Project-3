from flask import Flask, app, jsonify, render_template
import pandas as pd 

app = Flask(__name__)

def read_csv_and_handle_errors(file_path):
    try:
        df = pd.read_csv(file_path)
        data = df.to_dict(orient='records')
        return data
    except FileNotFoundError:
        return {'error': 'File not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/')
def home():
   return render_template("index.html")

@app.route("/api/suicides_data")
def api_suicides_data():
    return jsonify(read_csv_and_handle_errors('Resources/suicides_data.csv'))

@app.route("/api/gdp_data")
def api_gdp_data():
    return jsonify(read_csv_and_handle_errors('Resources/gdp_data.csv'))

@app.route("/api/province_data")
def api_province_data():
    return jsonify(read_csv_and_handle_errors('Resources/province_data.csv'))

@app.route("/api/lat_and_long")
def lat_and_long():
    return jsonify(read_csv_and_handle_errors('Resources/world_country_latitude_and_longitude.csv'))



if __name__ == '__main__':
   app.run(host="localhost", port=5000, debug=True)
