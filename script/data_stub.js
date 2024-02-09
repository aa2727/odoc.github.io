  // create an array with nodes
  var nodes = new vis.DataSet([
    { id: 1, label: "Node 1",level:1 },
    { id: 2, label: "Node 2",level:1 },
    { id: 3, label: "Node 3", color: "#FF0000",level:1},
    { id: 4, label: "Node 4",level:1 },
    { id: 5, label: "Node 5",level:1 },
    { id: 12, label: "Node 1",level:2 },
    { id: 22, label: "Node 2",level:2 },
    { id: 32, label: "Node 3", color: "#FF0000",level:2},
    { id: 42, label: "Node 4",level:2 },
    { id: 52, label: "Node 5",level:2 },
    { id: 13, label: "Node 1",level:3 },
    { id: 23, label: "Node 2",level:3 },
    { id: 33, label: "Node 3", color: "#FF0000",level:3},
    { id: 43, label: "Node 4",level:3 },
    { id: 53, label: "Node 5",level:3 }
  ]);

  // create an array with edges
  var edges = new vis.DataSet([
    { from: 1, to: 3},
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3, color: { color: "red" }},
    { from: 1, to: 12,color: { color: "white" }},
    { from: 2, to: 22,color: { color: "white" } },
    { from: 3, to: 32 ,color: { color: "white" }},
    { from: 4, to: 42,color: { color: "white" }},
    { from: 5, to: 52, color: { color: "red" }},
    { from: 1, to: 13,color: { color: "white" }},
    { from: 2, to: 23,color: { color: "white" } },
    { from: 3, to: 33 ,color: { color: "white" }},
    { from: 42, to: 43,color: { color: "red" }},
    { from: 5, to: 53, color: { color: "red" }}
  ]);

  var nodes2 = new vis.DataSet([
    { id: 1, label: "Node 1",color: "#FF0000" },
    { id: 2, label: "Node 2"},
    { id: 3, label: "Node 3"}
  ]);

  // L'odre des edge influe sur la couleur, par héritage la couleur du noeud est donnée aux edges qui partent de lui
  var edges2 = new vis.DataSet([
    { from: 1, to: 3,color: { color: "red" } },
    { from: 2, to: 1 },
    { from: 2, to: 2 }
  ]);



  // create a network
  var data = {
    nodes: nodes,
    edges: edges
  };

  var data2 = {
    nodes: nodes2,
    edges: edges2
  };
