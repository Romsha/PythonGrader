from flask import Flask, request, jsonify
from flask_cors import CORS
import io
from typing import Iterable, Tuple
import zipfile
import grader

app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False


def zipFileIterator(zipData: bytes) -> Tuple[str, str]:
    """
    Iterates over all python files inside the zip.
    For each file, yields tuple of (filePath, fileContent)
    """
    # TOOD: raise error when not a valid zip file
    zipReader = zipfile.ZipFile(io.BytesIO(zipData), 'r')

    for zf in zipReader.filelist:
        if (zf.file_size == 0) or (not zf.filename.endswith('.py')):
            continue

        with zipReader.open(zf.filename) as f:
            fileContent = f.read()
        
        yield zf.filename, fileContent


def handlePythonFile(fileName: str, fileContent: bytes) -> dict:
    parseResult = grader.parseData(fileContent)
    if parseResult == {}:
        return {'success': False, 'type': 'PY', 'name': fileName}
    return {'success': True, 'type': 'PY', 'name': fileName, 'data': parseResult}


def handleZipFile(fileName:str, fileContent: bytes) -> Iterable[dict]:
    results = [handlePythonFile(name, content) for (name, content) in zipFileIterator(fileContent)]
    # TODO: handle errors from the iterator
    return {'success': True, 'name': fileName, 'type': 'ZIP', 'data': results} 


@app.route('/parseFile/', methods=['POST'])
def receiveData():
    requestFile = request.files.get('file')
    print('request:', requestFile.filename)
    if requestFile.filename.endswith('.py'):
        return jsonify(handlePythonFile(requestFile.filename, requestFile.stream.read()))
    if requestFile.filename.endswith('.zip'):
        return jsonify(handleZipFile(requestFile.filename, requestFile.stream.read()))
    return jsonify({'success': False, 'name': requestFile.filename})

if __name__ == '__main__':
    app.run(host='localhost', port=12345)
