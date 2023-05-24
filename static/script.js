var network = null;
var nodes = [];
var edges = [];
var nextNodeId = 0;

// Функция для получения матрицы смежности из текстового поля
function getAdjacencyMatrixFromInput() {
    let matrixInput = document.getElementById('matrix-input');
    let lines = matrixInput.value.trim().split('\n');
    let matrix = [];
    for (let line of lines) {
        let row = line.trim().split(/\s+/).map(Number);
        matrix.push(row);
    }
    return matrix;
}

// Функция проверки симметрии матрицы
function isMatrixSymmetric(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < i; j++) {
            if (matrix[i][j] !== matrix[j][i]) {
                return false;
            }
        }
    }
    return true;
}

// Функция для добавления новой вершины
function addNode() {
    let nextId = nextNodeId++;
    let node = {id: nextId, label: nextId.toString(), };
    nodes.push(node);
    network.setData({nodes: nodes, edges: edges});
}

// Функция для добавления нового ребра
function addEdge() {
    let result = prompt('Введите номера через запятую: source, target');
    if (result) {
        let [source, target] = result.trim().split(',').map(Number);
        if (source < 0 || source >= nodes.length || target < 0 || target >= nodes.length) {
            alert('Ошибка: некорректно заданы вершины');
            return;
        }
        for (let edge of edges) {
            if ((edge.from === source && edge.to === target) || (edge.from === target && edge.to === source)) {
                alert('Ошибка: ребро уже есть');
                return;
            }
        }
        let arrow;
        edges.push({from: source, to: target, arrows: arrow});
        network.setData({nodes: nodes, edges: edges});
    }
}

// Функция для добавления новой дуги
function addArc() {
    let result = prompt('Введите номера через запятую: source, target');
    if (result) {
        let [source, target] = result.trim().split(',').map(Number);
        if (source < 0 || source >= nodes.length || target < 0 || target >= nodes.length) {
            alert('Ошибка: некорректно заданы вершины');
            return;
        }
        for (let edge of edges) {
            if (edge.from === source && edge.to === target) {
                alert('Ошибка: дуга уже есть');
                return;
            }
        }
        let arrow = {to: true};
        edges.push({from: source, to: target, arrows: arrow});
        network.setData({nodes: nodes, edges: edges});
    }
}

// Функция для построения графа по матрице смежности
function buildGraph() {
    let matrix = getAdjacencyMatrixFromInput();
    let isSymmetric = isMatrixSymmetric(matrix);
    let n = matrix.length;
    nodes = [];
    edges = [];
    for (let i = 0; i < n; i++) {
        nodes.push({id: i, label: i.toString()});
        for (let j = 0; j < i; j++) {
            if (matrix[i][j]) {
                let arrow;
                if (!isSymmetric) {
                    arrow = {from: true, to: true, middle: false};
                }
                edges.push({from: i, to: j, arrows: arrow});
            }
        }
    }
    network.setData({nodes: nodes, edges: edges});
}

// Функция для очистки графа
function clearGraph() {
    nextNodeId = 0;
    nodes = [];
    edges = [];
    network.setData({nodes: nodes, edges: edges});
    let matrixInput = document.getElementById('matrix-input');
    matrixInput.value = '';
}

// Функция для получения матрицы смежности из ребер
function getAdjacencyMatrixFromEdges() {
    let matrix = [];
    let n = nextNodeId;
    for (let i = 0; i < n; i++) {
        let row = new Array(n).fill(0);
        matrix.push(row);
    }
    for (let edge of edges) {
        let i = edge.from;
        let j = edge.to;
        matrix[i][j] = 1;
    }
    return matrix;
}

// Функция для настройки интерактивности графа
function configureNetwork() {
    let container = document.getElementById('graph-container');
    let data = {nodes: nodes, edges: edges};
    let options = {
        nodes: {
            shape: 'circle',
            size: 20,
            font: {size: 24},
            borderWidth: 2,
            color: {
                border: '#2B7CE9',
                background: '#97C2FC'
            }
        },
        edges: {
            width: 2,
            color: '#2B7CE9',
            //arrows: {
            //    to: {
            //        enabled: true,
            //        scaleFactor: 1,
            //        type: 'arrow'}
            //},
            //smooth: {type: 'continuous'}
        },
        physics: {
            enabled: false,
        }
    };
    network = new vis.Network(container, data, options);
}

// Навешиваем обработчики событий
document.getElementById('add-vertex-btn').addEventListener('click', addNode);
document.getElementById('add-edge-btn').addEventListener('click', addEdge);
document.getElementById('add-arc-btn').addEventListener('click', addArc);
document.getElementById('build-graph-btn').addEventListener('click', buildGraph);
document.getElementById('clear-graph-btn').addEventListener('click', clearGraph);

// Настройка инфраструктуры графа
configureNetwork();