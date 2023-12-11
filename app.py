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

@app.route("/api/province_data")
def api_province_data():
    return jsonify(read_csv_and_handle_errors('Resources/province_data.csv'))

@app.route("/api/pie_chart")
def pie_chart():
    return jsonify(read_csv_and_handle_errors('Resources/pie_chart.csv'))

@app.route("/api/chart3data")
def chart3data():
    return jsonify(read_csv_and_handle_errors('Resources/chart3data.csv'))

if __name__ == '__main__':
   app.run(host="localhost", port=5000, debug=True)