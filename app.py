from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/build-graph', methods=['POST'])
def build_graph():
    matrix = request.json['matrix']
    nodes = []
    edges = []
    n = len(matrix)
    for i in range(n):
        nodes.append({'id': i, 'label': str(i)})
        for j in range(i, n):
            if matrix[i][j]:
                edges.append({'from': i, 'to': j})
                if not matrix[j][i]: # если граф неориентированный
                    edges.append({'from': j, 'to': i})
    return jsonify(nodes=nodes, edges=edges)


if __name__ == '__main__':
    app.run(debug=True)