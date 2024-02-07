let temps = 0;

// Est ce que je fais l'algorithme en javascript ou je le fais en python côté serv avec un format :
// 

function createNetwork(data_network,name) {
    var container = document.createElement(name);
    let title = document.createElement("h2");
    title.innerText = "Topologie au temps t"+ temps++;
    container.appendChild(title);
    var options = {
      height: "33%"
    };
    var netw_container = document.createElement("network");
    container.appendChild(netw_container);
    document.body.appendChild(container);
    var network = new vis.Network(netw_container, data_network, options);
}