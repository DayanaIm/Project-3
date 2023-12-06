from flask import Flask, app, jsonify, render_template
import pandas as pd 

app = Flask(__name__)


@app.route('/')
def home():
   return render_template("main-page.html")

@app.route("/api/suicides_data")
def api_suicides_data():

    df = pd.read_csv('Resources/suicides_data.csv')
    suicides_data = df.to_dict()
    return jsonify(suicides_data)

@app.route("/api/gdp_data")
def api_gdp_data():
    df = pd.read_csv('Resources/gdp_data.csv')
    gdp_data = df.to_dict()
    return jsonify(gdp_data)

@app.route("/api/province_data")
def api_province_data():
    df = pd.read_csv('Resources/province_data.csv')
    province_data = df.to_dict()
    return jsonify(province_data)

if __name__ == '__main__':
   app.run(host="localhost", port=5000, debug=True)
