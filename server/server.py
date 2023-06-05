from flask import Flask, request, jsonify
from flask_cors import CORS
import grader

app = Flask(__name__)
CORS(app)

@app.route('/parseFile/', methods=['POST'])
def receive_data():
    data = request.get_json()
    print('request:', data['name'])
    parseResult = grader.parseData(data['content'])
    if parseResult == {}:
        response = {'success': False}
    else:
        response = {'success': True, 'name': data['name'], 'data': parseResult} 
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='localhost', port=12345)
