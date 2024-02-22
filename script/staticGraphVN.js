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
        edges.add({from: node+index,to : v+index})
      }
      for (let j = 0; j < index; j++) {
        edges.add({from: node+index,to : node+j,color: { color: "white" }})
      }
    }
  }
  return {
    nodes: nodes,
    edges: edges
  };
}