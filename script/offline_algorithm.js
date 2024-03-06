function cost_time_travel(d) {
    if (d <= 0) {
        return 0;
    }
    return d;
}

/**
 *  Find the first time where the edge u,v exists
 * @param {*} graph  dynamic graph ORIENTED
 * @param {*} u node
 * @param {*} v node
 * @param {*} t time
 * @returns the first time where the edge u,v exists, null otherwise
 */
function find_t_future(graph,u,v,t){
    for (let index = t; index < graph.length; index++) {
        const static_graph = graph[index];
        if (static_graph[u][v] != undefined || static_graph[v][u] != undefined) {
            return index;
        }
    }
    return null;
}

function v_exists(graph,u,v,t) {
    return (graph[t][u][v] != undefined) ;
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
function findTminConstraint(dst, nodeCost,C) {
    // Loop of the tmin
    for (let t = 0; t < Object.keys(nodeCost).length; t++) {
        // Check if the current t time can arrive at i time without exceding the cost C
        for (let i = 0; i < Object.keys(nodeCost).length; i++) {
            if (nodeCost[i][dst] + cost_time_travel(i-t) <= C) {
                constraintMet = true;
                return [t,i];
            }
        }
    }
    return null;
}

/**
 * Extract the path from the pred table
 * @param {*} dst  destination node
 * @param {*} src  source node
 * @param {*} tmin  time where the cost is minimal
 * @param {*} nodeCost object containing the best cost from the node src at a time
 * @param {*} pred  table of predecessor
 * @returns     the path from src to dst at time tmin
 */
function extractTimeTravelRec(dst,src,tmin,nodeCost,pred) {
    if (dst == src) {
        return [[src,tmin]];
    }
    console.log("pred, dst, tmin : ",pred[tmin][dst],dst,tmin);
    return extractTimeTravelRec(pred[tmin][dst][0][0],src,pred[tmin][dst][0][1],nodeCost,pred).concat(pred[tmin][dst]);
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

async function offline_costc_odoc(src,dest,graph,C) {
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

    console.log("NodeCost :");
    console.log(nodeCost);
    console.log("MinCost :");
    console.log(minCost);
    console.log("unvisited :");
    console.log(unvisited);

    /**
     * Beginning of the main loop of the function 
     */
    while (still_unvisited_node(unvisited)) {
        await resolveAfter2Seconds();
        await nextTick();
        update_nodeCost_tab_view(nodeCost);
        let res = argmin_unvisited_node(unvisited,nodeCost);// Ligne argmin
        let c = res[0];
        if (c == Infinity) {
            break;
        }
        delete unvisited[res[1][0]][res[1][1]];
        let u = res[1][1];
        let t = res[1][0];
        // Pour chaque noeud v adjacent à u
        for (let v in graph[0]) {
            if (v != u) {
                let t_future = find_t_future(graph,u,v,res[1][0]);
                if (t_future != null) {
                    const [cmin,tmin] = minCost[v];
                    if ((nodeCost[t_future][v] > c) && ((c<cmin) || (t_future < tmin))) {
                        nodeCost[t_future][v] = c;
                        pred[t_future][v] = [[u,res[1][0]],[u,t_future],[v,t_future]];
                        if ((c < minCost[v][0]) || (c == minCost[v][0] && t_future < minCost[v][1])) minCost[v] = [c,t_future];
                    }
                }
                for (let index = res[1][0]-1; index >= 0; index--) {
                    if (v_exists(graph,u,v,index)|| v_exists(graph,v,u,index)){
                        let cpast = c + cost_time_travel(res[1][0]-index);
                        if (cpast <= C && nodeCost[index][v] > cpast) {
                            
                            nodeCost[index][v] = cpast;
                            pred[index][v] = [[u,res[1][0]],[u,index],[v,index]];
                        }
                    }
                    
                }
                
            }
        }
        console.log("NodeCost :",JSON.parse(JSON.stringify(nodeCost)));
    }
    console.log("pred :",pred);
    const [tmin,t] = findTminConstraint(dest,nodeCost,C);
    if (tmin == null) return null;
    if (pred[tmin][dest] == null)
    {
        return extractTimeTravelRec(dest,src,t,nodeCost,pred).concat([[dest,tmin]]);
    }
    return extractTimeTravelRec(dest,src,tmin,nodeCost,pred);
}

// Voir pour différents format genre : a { b : [0,1]} avec temps où aretes existent
const dynamic_graph = [{
    A: { },
    B: { D: 9},
    C: {D: 3},
    D: { B: 9, C: 9}
},
{
    A: { C: 3   
    },
    B: { },
    C: { A: 2},
    D: {}
},
{
    A: { B: 5, C: 3 },
    B: { D: 9,  A: 5},
    C: { D: 2, A: 2},
    D: { C:1, B: 9}
}
];


const dynamic_graph_test2 = [{
    A: { },
    B: {},
    C: { },
    D: { B: 9}
},
{
    A: {   
    },
    B: { },
    C: { A: 2 },
    D: {}
},
{
    A: { B: 5, C: 3 },
    B: { D: 9},
    C: { D: 2},
    D: {}
}
];


const dynamic_graph_oriented = [{
    A: { C: 2 },
    B: { D: 9 },
    C: { D: 2 },
    D: { B: 9, C: 9}
},
{
    A: {  
        C: 3 
    },
    B: { C: 9 },
    C: { A: 2, B: 9 },
    D: {}
},
{
    A: { B: 5, C: 3 },
    B: { D: 9,  A: 5},
    C: { D: 2, A: 2},
    D: { B: 9, C: 9}
}
];

function update_nodeCost_tab_view(nodeCost) {
    for (let index = 0; index < Object.keys(nodeCost).length; index++) {
        const element = nodeCost[index];
        console.log("element : ",element);
        for (let node in element) {
            let nodeCostVal = element[node];
            let tabVal = document.getElementById(node+index+"cost");
            tabVal.innerHTML = nodeCostVal;
        }
    }
}