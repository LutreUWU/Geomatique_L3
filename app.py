from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def map():
    return render_template('carte.html')

@app.route('/seisme')
def seisme():
    return render_template('carte_seisme.html')

@app.route('/lignedroite')
def lignedroite():
    return render_template('lignedroite.html')

@app.route('/restaurant')
def restaurant():
    return render_template('restaurant.html')