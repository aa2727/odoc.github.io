let temps = 0; 

function createNetwork(data_network,name,options = null) {
    var container = document.createElement(name);
    let title = document.createElement("h2");
    title.innerText = "Topologie au temps t"+ temps++;
    container.appendChild(title);
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
    height: "33%",
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
      arrows: { to: true },
    }
  };
  createNetwork(data_network,name,options);
}