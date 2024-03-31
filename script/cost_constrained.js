function cost_time_travel(d) {
    if (d <= 0) {
        return 0;
    }
    return parseInt(d);
}

/**
 *  Find the first time where the edge u,v exists
 * @param {*} graph  dynamic graph ORIENTED
 * @param {*} u node
 * @param {*} v node
 * @param {*} t time
 * @returns the first time where the edge u,v exists, null otherwise
 */
function find_t_future(graph, u, v, t) {
    for (let index = t; index < graph.length; index++) {
        const static_graph = graph[index];
        if (static_graph[u][v] != undefined || static_graph[v][u] != undefined) {
            return index;
        }
    }
    return null;
}

function v_exists(graph, u, v, t) {
    return (graph[t][u][v] != undefined);
}

/**
 * Check if there is some node in a dictionnary of dictionnary of node
 * @param unvisited 
 * @returns true if there is still node to explore, false otherwise
 */
function still_unvisited_node(unvisited) {
    for (let index = 0; index < Object.keys(unvisited).length; index++) {
        if (Object.keys(unvisited[index]).length != 0) { // vérifier plutot la longueur
            return true;
        }
    }
    return false;
}

/**
 *  Find the argmin and the min nodeCost in the graph
 * @param unvisited 
 * @param nodeCost 
 * @returns the minimum and a tuple with time and the node argmin, 
 * if there is no min, return Infinity,[0,0]
 */
function argmin_unvisited_node(unvisited, nodeCost) {
    let min = Infinity;
    let argmin = [0, 0];
    for (let index = 0; index < Object.keys(unvisited).length; index++) {
        const nodeDic = unvisited[index];
        for (let node in nodeDic) {
            if (nodeCost[index][node] <= min) {
                min = nodeCost[index][node];
                argmin = [index, node];
            }
        }
    }
    return [min, argmin];
}

/**
 * Count the number of nodes not visited in every time
 * @param unvisited 
 * @returns number of non visited nodes
 */
function nb_node_left(unvisited) {
    let cpt = 0;
    for (let index = 0; index < Object.keys(unvisited).length; index++) {
        for (let j = 0; j < Object.keys(unvisited[index]).length; j++) {
            cpt++;
        }
    }
    return cpt;
}

/**
 * Find the minimum tmin where it exists a t where nodeCost[dst,t] + f(t-tmin) =< C;
 * @param {*} dst destination node
 * @param {*} nodeCost object containing the best cost from the node src at a time
 * @param {*} C The maximum Cost for the travel
 * @returns 
 */
function findTminConstraint(dst, nodeCost, C) {
    // Loop of the tmin
    for (let t = 0; t < Object.keys(nodeCost).length; t++) {
        // Check if the current t time can arrive at i time without exceding the cost C
        for (let i = 0; i < Object.keys(nodeCost).length; i++) {
            if (nodeCost[i][dst] + cost_time_travel(i - t) <= C) {
                return [t, i];
            }
        }
    }
    return null;
}

function findTminHistoryConstraint(dst, nodeCost, H) {
    console.log("nodeCost : ", nodeCost);
    for (let t = 0; t < Object.keys(nodeCost).length; t++) {
        for (let h = 0; h <= H && h < Object.keys(nodeCost).length; h++) {
            console.log("t : ", t, " h : ", h, " dst : ", dst, " nodeCost : ", nodeCost[t][h][dst]);
            if (nodeCost[t][h][dst] != Infinity) {
                return t;
            }
        }
    }
    return null;
}

/**
 * Extract the path from the pred table after a cost constrained algorithm
 * @param {*} dst  destination node
 * @param {*} src  source node
 * @param {*} tmin  time where the cost is minimal
 * @param {*} nodeCost object containing the best cost from the node src at a time
 * @param {*} pred  table of predecessor
 * @returns     the path from src to dst at time tmin
 */
function extractTimeTravelRec(dst, src, tmin, nodeCost, pred) {
    if (dst == src) {
        return [[src, tmin]];
    }
    console.log("pred, dst, tmin : ", pred[tmin][dst], dst, tmin);
    return extractTimeTravelRec(pred[tmin][dst][0][0], src, pred[tmin][dst][0][1], nodeCost, pred).concat(pred[tmin][dst]);
}

/** 
 * Extract the path from the pred table after a history constrained algorithm
 * @param {*} dst destination node 
 * @param {*} src source node
 * @param {*} tmin minimal time
 * @param {*} tmax maximal time
 * @param {*} pred table of predecessor
 * @returns the path from src to dst between tmin and tmax
 */
function extractTimeTravelRecHistory(dst, src, t, tmax, pred, tmin) {

    if (dst == src) {
        return [[src, tmin]];
    }
    if (pred[t][tmax][dst] == null) {
        console.log("pred, dst, t is null : ", pred[t][tmax][dst], dst, t);
        for (let index = t; index < tmax; index++) {
            if (pred[index][tmax][dst] != null) {
                return extractTimeTravelRecHistory(pred[index][tmax][dst][0][0], src, pred[index][tmax][dst][0][1], tmax, pred, tmin).concat(pred[index][tmax][dst]).concat([[dst, t]]);
            }
        }
    }
    console.log("pred, dst, t : ", pred[t][tmax][dst], dst, t);
    return extractTimeTravelRecHistory(pred[t][tmax][dst][0][0], src, pred[t][tmax][dst][0][1], tmax, pred, tmin).concat(pred[t][tmax][dst]).concat([[dst, t]]);
}

function printTimeTravel(path) {
    let str = "";
    for (let index = 0; index < path.length; index++) {
        const element = path[index];
        str += element[0] + " at time " + element[1] + " -> ";
    }
    return str;
}

function resolveAfter2Seconds() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('resolved');
        }, 2000);
    });
}

async function offline_costc_odoc(src, dest, graph, C) {
    const nodeCost = {};
    const minCost = {};
    const pred = {};
    const unvisited = {};

    /**
     * Initialisation of the tables of cost and time
     */
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
    Object.keys(graph[0]).forEach(node => {
        minCost[node] = [];
        minCost[node].push(Infinity);
        minCost[node].push(Infinity);
    });
    nodeCost[0][src] = 0;

    create_nodeCost_tab(nodeCost);

    /**
     * Beginning of the main loop of the function 
     */
    while (still_unvisited_node(unvisited)) {
        await resolveAfter2Seconds();
        await nextTick();
        update_nodeCost_tab_view(nodeCost);
        let res = argmin_unvisited_node(unvisited, nodeCost);// Ligne argmin
        let c = res[0];
        if (c == Infinity) {
            break;
        }
        delete unvisited[res[1][0]][res[1][1]];
        let u = res[1][1];
        let t = res[1][0];
        update_actual_node(u, t);
        update_network_view(nodeCost, pred, u, t);
        // Pour chaque noeud v adjacent à u
        for (let v in graph[0]) {
            if (v != u) {
                let t_future = find_t_future(graph, u, v, res[1][0]);
                if (t_future != null) {
                    const [cmin, tmin] = minCost[v];
                    if ((nodeCost[t_future][v] > c) && ((c < cmin) || (t_future < tmin))) {
                        nodeCost[t_future][v] = c;
                        pred[t_future][v] = [[u, res[1][0]], [u, t_future], [v, t_future]];
                        if ((c < minCost[v][0]) || (c == minCost[v][0] && t_future < minCost[v][1])) minCost[v] = [c, t_future];
                    }
                }
                for (let index = res[1][0] - 1; index >= 0; index--) {
                    if (v_exists(graph, u, v, index) || v_exists(graph, v, u, index)) {
                        let cpast = c + cost_time_travel(res[1][0] - index);
                        if (cpast <= C && nodeCost[index][v] > cpast) {

                            nodeCost[index][v] = cpast;
                            pred[index][v] = [[u, res[1][0]], [u, index], [v, index]];
                        }
                    }

                }

            }
        }
        console.log("NodeCost :", JSON.parse(JSON.stringify(nodeCost)));
    }
    console.log("pred :", pred);
    const [tmin, t] = findTminConstraint(dest, nodeCost, C);
    if (tmin == null) return null;
    if (pred[tmin][dest] == null) {
        return extractTimeTravelRec(dest, src, t, nodeCost, pred).concat([[dest, tmin]]);
    }
    return extractTimeTravelRec(dest, src, tmin, nodeCost, pred);
}

function min_from_past(graph, cost, node, t, h) {
    let min = Infinity;
    let timeMin = 0;
    let nodeMin = null;
    for (let index = t - h; index <= t; index++) {
        if (graph[index] != undefined && graph[index][node] != undefined) {
            for (let v in graph[0]) {
                if (graph[index][node][v] != undefined || graph[index][v][node] != undefined) {
                    let sum = parseInt(parseInt(index - t) + parseInt(h)); // Je ne sais pas pourquoi sans parseInt ça donne une string
                    if (cost[index][t][v] + cost_time_travel(sum) < min) {
                        min = cost[index][t][v] + cost_time_travel(sum);
                        timeMin = index;
                        nodeMin = v;
                    }
                }
            }
        }
    }
    return [min, timeMin, nodeMin];
}

async function offline_historyc_odoc(src, dest, graph, H) {

    // Initialisation of the tables of cost and time
    const cost = {};
    const pred = {};
    let tmax = graph.length;
    for (let index = 0; index < tmax; index++) {
        cost[index] = {};
        pred[index] = {};
        for (let h = 0; h < tmax; h++) {
            cost[index][h] = {};
            pred[index][h] = {};
            for (let node in graph[0]) {
                cost[index][h][node] = Infinity;
                pred[index][h][node] = null;
            }
        }

    }
    cost[0][0][src] = 0;

    // We start at 1 because the cost of the first time does not change with the past
    for (let t = 1; t < tmax; t++) {
        // Propagation of the cost of the predecessor in time
        for (let node in graph[0]) {

            for (let h = 0; h < tmax; h++) {
                if (h > t) {
                    continue;
                }
                if (h == 0) {
                    cost[h][t][node] = cost[h][t - 1][node];
                    pred[h][t][node] = pred[h][t - 1][node];
                    continue;
                }
                //console.log("node : ", node, " t : ", t, " h : ", h, " cost : ", cost[t - 1][h][node], " cost : ", cost[t - 1][h - 1][node]);
                cost[t][h][node] = Math.min(cost[t - 1][h][node], cost[t - 1][h - 1][node]);
                //console.log("node : ", node, " t : ", t, " h : ", h, " cost : ", cost[t][h][node]);
            }
        }

        for (let index = 0; index < Object.keys(graph[0]).length; index++) {
            for (const node in graph[0]) {
                console.log("node : ", node, " t : ", t);
                for (let h = H; h >= 0; h--) {
                    if (t - h < 0) {
                        continue;
                    }
                    let res = min_from_past(graph, cost, node, t, h);
                    let timeMin = res[1];
                    let nodeMin = res[2];
                    let m = res[0];
                    if (m < cost[t - h][t][node]) {
                        console.log("m : ", m, " timeMin : ", timeMin, " nodeMin : ", nodeMin, " h : ", h, " t : ", t, " node : ", node);
                        cost[t - h][t][node] = m;
                        pred[t - h][t][node] = [[nodeMin, timeMin], [nodeMin, t], [node, t]];
                        console.log(">>>> pred : ", JSON.parse(JSON.stringify(pred)));

                    }
                }
            }

        }
    }
    console.log("cost : ", cost);
    console.log("pred : ", pred);
    let t = findTminHistoryConstraint(dest, cost, H);
    console.log("t : ", t);
    if (t == null) return null;
    tmax = Math.min(t + H, tmax - 1);
    return extractTimeTravelRecHistory(dest, src, t, tmax, pred, t);
}