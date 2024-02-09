function still_unvisited_node(unvisited) {
    for (let index = 0; index < Object.keys(unvisited).length; index++) {
        if (Object.keys(unvisited[index]).length != 0) { // vérifier plutot la longueur
            console.log("Pas vide :");
            console.log(unvisited[index]);
            return true;
        }
    }
    return false;
}

function argmin_unvisited_node(unvisited,nodeCost) {
    let min = Infinity;
    let argmin = [0,0];
    for (let index = 0; index < Object.keys(unvisited).length; index++) {
        const nodeDic = unvisited[index];
        for (let node in nodeDic) {
            if (nodeCost[index][node] <= min) {
                min = nodeCost[index][node];
                argmin = [index,node];
            }
        }
    }
    return [min,argmin];
}

function nb_node_left(unvisited) {
    let cpt = 0;
    for (let index = 0; index < Object.keys(unvisited).length; index++) {
        for (let j = 0; j < Object.keys(unvisited[index]).length; j++) {
            cpt++;
        }
    }
    return cpt;
}

function offline_costc_odoc(src,graph) {
    const nodeCost = {};
    const minCost = {};
    const visited = {};
    const pred = {};
    const unvisited = {};
    
    for (let index = 0; index < graph.length; index++) {
        const static_graph = graph[index];
        let nodeCost_tmp = {};
        let unvisited_tmp = {};
        let pred_tmp = {};
        for (let node in static_graph) {
            nodeCost_tmp[node] = Infinity;
            unvisited_tmp[node] = static_graph[node];
            pred_tmp[node] = null;
        }
        nodeCost[index] = nodeCost_tmp;
        unvisited[index] = unvisited_tmp;
        pred[index] = pred_tmp;
    }
    for (let node in graph[0]) {
        minCost[node] = [Infinity,Infinity];
    }
    nodeCost[0][src] = 0;

    console.log("NodeCost :");
    console.log(nodeCost);
    console.log("MinCost :");
    console.log(minCost);
    console.log("unvisited :");
    console.log(unvisited);

    let cpt = 0;
    while (still_unvisited_node(unvisited)) {
        let res = argmin_unvisited_node(unvisited,nodeCost);
        console.log("Noeuds restants");
        console.log(nb_node_left(unvisited));
        cpt++;
        delete unvisited[res[1][0]][res[1][1]];
        if (cpt > 100) {
            console.log("timeout");
            break;
        }
    }
    
}

// Généré par chatgpt
function dijkstra(graph, startNode) {
    const distances = {};
    const visited = {};
    const unvisited = {};

    for (let node in graph) {
        distances[node] = Infinity;
        unvisited[node] = graph[node];
    }

    distances[startNode] = 0;

    while (Object.keys(unvisited).length !== 0) {
        let currentNode = null;

        for (let node in unvisited) {
            if (currentNode === null || distances[node] < distances[currentNode]) {
                currentNode = node;
            }
        }

        let neighbors = unvisited[currentNode];

        for (let neighbor in neighbors) {
            let distance = distances[currentNode] + neighbors[neighbor];
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
            }
        }

        visited[currentNode] = distances[currentNode];
        delete unvisited[currentNode];
    }

    return distances;
}

// Example usage
const graph = {
    A: { B: 5, C: 3 },
    B: { D: 9 },
    C: { D: 2 },
    D: {}
};

const dynamic_graph = [{
    A: { B: 5, C: 3 },
    B: { D: 9 },
    C: { D: 2 },
    D: {}
},
{
    A: { B: 5, C: 3 },
    B: { D: 9 },
    C: { D: 2 },
    D: {}
}
];

const startNode = 'A';
//const shortestDistances = dijkstra(graph, startNode);
//console.log(shortestDistances);
