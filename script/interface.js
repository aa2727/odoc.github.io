async function run_odoc() {
    init_color_graph(network);
    // get arguments from the form in the html
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    //let time = document.getElementById("startTime").value;
    let cost = document.getElementById("cost").value;
    let graph = dynamic_graph_test2;
    let travel = await offline_costc_odoc(start, end, graph, cost);
    if (travel == null) {
        console.log("No path found");
        return;
    }
    console.log('travel : ', travel);
    console.log(printTimeTravel(travel));
    color_travel(travel, network);
}

async function run_odoc_hist() {
    init_color_graph(network);
    // get arguments from the form in the html
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    //let time = document.getElementById("startTime").value;
    let cost = document.getElementById("cost").value;
    let graph = dynamic_graph_test2;
    let travel = await offline_historyc_odoc(start, end, graph, cost);
    if (travel == null) {
        console.log("No path found");
        return;
    }
    console.log('travel : ', travel);
    console.log(printTimeTravel(travel));
    color_travel(travel, network);
}

var started = false;
let button_play = document.getElementById("play");
button_play.addEventListener("click", function () {
    started = true;
    console.log("play");

});

let button_pause = document.getElementById("pause");
button_pause.addEventListener("click", function () {
    started = false;
    console.log("pause");
});


const nextTick = () => new Promise(res => {
    resolve = res;
    console.log("waiting");
    setTimeout(() => {
        if (started) resolve();
    });
});


function update_nodeCost_tab_view(nodeCost) {
    for (let index = 0; index < Object.keys(nodeCost).length; index++) {
        const element = nodeCost[index];
        console.log("element : ", element);
        for (let node in element) {
            let nodeCostVal = element[node];
            let tabVal = document.getElementById(node + index + "cost");
            tabVal.innerHTML = nodeCostVal;
        }
    }
}

function create_nodeCost_tab(nodeCost) {
    let old_table = document.getElementById("tableau_nodeCost");
    if (old_table != null) {
        old_table.remove();
    }
    console.log("nodeCost : ", nodeCost);
    let div = document.createElement("div");
    div.setAttribute("id", "tableau_nodeCost");
    let table = document.createElement("table");
    table.setAttribute("id", "nodeCost");
    let row = document.createElement("tr");
    let nodecost = document.createElement("th");
    nodecost.innerHTML = "Node";
    row.appendChild(nodecost);
    let time = document.createElement("th");
    time.innerHTML = "Time";
    row.appendChild(time);
    let cost = document.createElement("th");
    cost.innerHTML = "Cost";
    row.appendChild(cost);
    table.appendChild(row);
    for (let index = 0; index < Object.keys(nodeCost).length; index++) {
        const element = nodeCost[index];
        for (let node in element) {
            let row = document.createElement("tr");
            table.appendChild(row);
            let tabNode = document.createElement("td");
            tabNode.innerHTML = node;
            row.appendChild(tabNode);
            let tabTime = document.createElement("td");
            tabTime.innerHTML = index;
            row.appendChild(tabTime);
            let tabVal = document.createElement("td");
            tabVal.id = node + index + "cost";
            tabVal.innerHTML = element[node];
            row.appendChild(tabVal);
        }
    }
    div.appendChild(table);
    document.getElementById("dashboard").appendChild(div);
}

function update_actual_node(node, time) {
    let actual_node = document.getElementById("actual_node");
    actual_node.innerHTML = node + time;
}

