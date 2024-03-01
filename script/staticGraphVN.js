let temps = 0; 

function createNetwork(data_network,name,options = null) {
    var container = document.createElement(name);
    //let title = document.createElement("h2");
    //title.innerText = "Topologie au temps t"+ temps++;
    //container.appendChild(title);
    if (options == null) {
      var options = {
        height: "33%"
      };
    }

    var netw_container = document.createElement("network");
    container.appendChild(netw_container);
    document.body.appendChild(container);
    var network = new vis.Network(netw_container, data_network, options);
}

function createNetworkHierarchical(data_network,name) {
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
        type : "curvedCW"
      },
      arrows: { to: false },
    }
  };
  createNetwork(data_network,name,options);
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
      nodes.add({id : node+index,label : node,level : index+1});
      for (const v in static_graph[node]) {
        edges.add({id : node+index+v+index,from: node+index,to : v+index,color: { color: "blue" }})
      }
      for (let j = 0; j < index; j++) {
        edges.add({id : node+index+node+j, from: node+index,to : node+j,color: { color: "white" }})
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
function color_travel(travel,network) {
  for (let index = 0; index < travel.length-1; index++) {
    let change = travel[index];
    let next = travel[index+1];
    network['nodes'].updateOnly({id: change[0]+change[1], color: 'red'});
    if (change[1] != next[1] || change[0] != next[0]) { // Si les noeuds sont différents
      if (network['edges'].get([next[0]+next[1]+change[0]+change[1]]).length == 0) { // Si l'arête n'existe pas dans le sens donné
        network['edges'].updateOnly({id : change[0]+change[1]+next[0]+next[1], color: 'red'});
      }
      else{
        network['edges'].updateOnly({id: next[0]+next[1]+change[0]+change[1], color: 'red'});
      }
    }
  }
  network['nodes'].updateOnly({id: travel[travel.length-1][0]+travel[travel.length-1][1], color: 'red'});
}

function init_color_graph(network) {
  console.log(network['nodes'].getIds()[0]);
  for (let i = 0; i < network['nodes'].getIds().length; i++) {
    let node = network['nodes'].getIds()[i];
    console.log(node);
    network['nodes'].updateOnly({id: node, color: '#97C2FC'});
  }
  for (let i = 0; i < network['edges'].getIds().length; i++) {
    let edge = network['edges'].getIds()[i];
    //if there is the same letter twice in the id of the edge
    if (edge[0] == edge[2]) {
      network['edges'].updateOnly({id: edge, color: 'white'});
    }
    else
    {
      network['edges'].updateOnly({id: edge, color: 'blue'});
    }
  }
}