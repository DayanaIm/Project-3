from flask import Flask, app, jsonify, render_template
import pandas as pd 

app = Flask(__name__)

@app.route('/')
def home():
   return render_template("main-page.html")
if __name__ == '__main__':
   #app.run()
   app.run(host="localhost", port=5500, debug=True)


