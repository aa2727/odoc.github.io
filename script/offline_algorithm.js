function offline_costc_odoc(src,graph) {
    
}


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

const startNode = 'A';
const shortestDistances = dijkstra(graph, startNode);
console.log(shortestDistances);
