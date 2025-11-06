from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def map():
    return render_template('carte.html')

@app.route('/seisme')
def seisme():
    return render_template('carte_seisme.html')

