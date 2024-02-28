function run_odoc() {
    // get arguments from the form in the html
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let time = document.getElementById("startTime").value;
    let cost = document.getElementById("cost").value;
    //let graph = document.getElementById("graph").value;
    let graph = dynamic_graph_test2;
    console.log(printTimeTravel(offline_costc_odoc(start, end, graph, cost)));
}