function createNetwork(data_network, name, options = null) {
  var container = document.createElement(name);
  if (options == null) {
    var options = {

    };
  }

  var netw_container = document.createElement("network");
  container.appendChild(netw_container);
  let section = document.getElementById("network_viz");
  section.appendChild(container);
  var network = new vis.Network(netw_container, data_network, options);
}

function createNetworkHierarchical(data_network, name) {
  var options = {
    layout: {
      hierarchical: {
        direction: "UD",
        sortMethod: "directed",
      }
    },
    edges: {
      smooth:
      {
        type: "curvedCW"
      },
      arrows: { to: false },
    }
  };
  createNetwork(data_network, name, options);
}

/**
 * Take a dynamic graph represented by a list of link dictionnary
 * return a dataObject to be used in create_network function
 * @param {*} dynamic_graph list of link dictionnary
 * @returns data_object
 */
function from_dgraph_to_datanetwork(dynamic_graph) {
  let nodes = new vis.DataSet([]);
  let edges = new vis.DataSet([]);
  for (let index = 0; index < dynamic_graph.length; index++) {
    const static_graph = dynamic_graph[index];
    for (const node in static_graph) {
      nodes.add({ id: node + index, label: node, level: index + 1 });
      for (const v in static_graph[node]) {
        edges.add({ id: node + index + v + index, from: node + index, to: v + index, color: { color: "blue" } })
      }
      for (let j = 0; j < index; j++) {
        edges.add({ id: node + index + node + j, from: node + index, to: node + j, color: { color: "#f2f2f2" } })
      }
    }
  }
  return {
    nodes: nodes,
    edges: edges
  };
}
/**
 *  Color the travel of a user in a dynamic graph
 * example of input : [["A",0],["A",0],["A",1],["C",1],["C",1],["C",0],["D",0],["D",0],["D",0],["B",0]]
 * @param {*} travel  list of link dictionnary
 */
async function color_travel(travel, network) {
  for (let index = 0; index < travel.length - 1; index++) {
    let change = travel[index];
    let next = travel[index + 1];
    network['nodes'].updateOnly({ id: change[0] + change[1], color: 'red' });
    if (change[1] != next[1] || change[0] != next[0]) { // Si les noeuds sont différents
      if (network['edges'].get([next[0] + next[1] + change[0] + change[1]]).length == 0) { // Si l'arête n'existe pas dans le sens donné
        network['edges'].updateOnly({ id: change[0] + change[1] + next[0] + next[1], color: 'red' });
      }
      else {
        network['edges'].updateOnly({ id: next[0] + next[1] + change[0] + change[1], color: 'red' });
      }
    }
  }
  network['nodes'].updateOnly({ id: travel[travel.length - 1][0] + travel[travel.length - 1][1], color: 'red' });
}

/**
 *  initialize the color of the graph to the default color
 * @param {*} network
 */
function init_color_graph(network) {
  console.log(network['nodes'].getIds()[0]);
  for (let i = 0; i < network['nodes'].getIds().length; i++) {
    let node = network['nodes'].getIds()[i];
    console.log(node);
    network['nodes'].updateOnly({ id: node, color: '#97C2FC' });
  }
  for (let i = 0; i < network['edges'].getIds().length; i++) {
    let edge = network['edges'].getIds()[i];
    //if there is the same letter twice in the id of the edge
    if (edge[0] == edge[2]) {
      network['edges'].updateOnly({ id: edge, color: '#f2f2f2' });
    }
    else {
      network['edges'].updateOnly({ id: edge, color: 'blue' });
    }
  }
}
/**
 *  update the color of the current node
 * @param {*} node current node
 * @param {*} time current time
 */
function update_network_view_current_node(node, time) {
  network['nodes'].updateOnly({ id: node + time, color: 'red' });
}

function update_network_view_current_path(nodeCost, pred, node, time, C) {
  for (let nodeDest in nodeCost[0]) {
    if (findTminConstraint(nodeDest, nodeCost, C) != null) {
      const [tmin, t] = findTminConstraint(nodeDest, nodeCost, C);
      if (tmin == null) {
        console.log("No path found");
      }
      else {
        let path;
        if (pred[tmin][dest] == null) {
          path = extractTimeTravelRec(nodeDest, src, t, nodeCost, pred).concat([[nodeDest, tmin]]);
        }
        path = extractTimeTravelRec(nodeDest, node, tmin, nodeCost, pred);
        color_travel(path, network);
      }
    }
  }
}

function update_network_view(nodeCost, pred, node, time, C) {
  update_network_view_current_node(node, time);
  update_network_view_current_path(nodeCost, pred, node, time, C);
}