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
    // If the predecessor is null for this window of time we look for the shorter window of time where the predecessor is not null
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

/**
 * Extract the path from the pred table after a history constrained algorithm
 * @param {*} dst destination node
 * @param {*} nodeCost table of cost
 * @param {*} H history constraint
 * @returns tmin the minimal time where the nodecost is not infinity
 */
function findTminHistoryConstraint(dst, nodeCost, H) {
    console.log("nodeCost : ", nodeCost);
    for (let t = 0; t + parseInt(H) < Object.keys(nodeCost).length; t++) {
        console.log(Object.keys(nodeCost).length);
        if (nodeCost[t][t + parseInt(H)][dst] != Infinity) {
            console.log("t : ", t, " dst : ", dst, " t+H : ", parseInt(H) + t, " nodeCost : ", nodeCost[t][t + parseInt(H)][dst]);
            return t;
        }
    }
    return null;
}

function min_from_past(graph, cost, node, t, h) {
    let min = Infinity;
    let timeMin = 0;
    let window = 0;
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


    for (let t = 0; t < tmax; t++) {
        // Propagation of the cost of the predecessor in time
        // We start at 1 because the cost of the first time does not change with the past
        if (t > 0) {

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
                    cost[h][t][node] = Math.min(cost[h][t - 1][node], cost[h - 1][t - 1][node]);
                    if (cost[h][t - 1][node] < cost[h - 1][t - 1][node]) {
                        pred[h][t][node] = pred[h][t - 1][node];
                    }
                    else {
                        pred[h][t][node] = pred[h - 1][t - 1][node];
                    }
                }
            }
        }

        // Propagation of the cost of the predecessor thanks to arcs
        for (let index = 0; index < Object.keys(graph[0]).length; index++) {
            for (const node in graph[0]) {
                for (let h = H; h >= 0; h--) {
                    if (t - h < 0) {
                        continue;
                    }
                    let res = min_from_past(graph, cost, node, t, h);
                    let timeMin = res[1];
                    let nodeMin = res[2];
                    let m = res[0];
                    if (m < cost[t - h][t][node]) { // If the cost is less than the previous one
                        cost[t - h][t][node] = m;
                        pred[t - h][t][node] = [[nodeMin, timeMin], [nodeMin, t], [node, t]];

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