async function run_odoc() {
    init_color_graph(network);
    // get arguments from the form in the html
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let time = document.getElementById("startTime").value;
    let cost = document.getElementById("cost").value;
    //let graph = document.getElementById("graph").value;
    let graph = dynamic_graph_test2;
    let travel = await offline_costc_odoc(start, end, graph, cost);
    color_travel(travel, network);
    console.log(printTimeTravel(travel));
}
var started = false;
let button_play = document.getElementById("play");
button_play.addEventListener("click",function() {
    started = true;
    console.log("play");
    resolve();
});

let button_pause = document.getElementById("pause");
button_pause.addEventListener("click",function() {
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

async function incr_tick_number() {
    while (true) {
        await nextTick();
        await resolveAfter2Seconds();
        let tick = document.getElementById("tick_number");
        let num = parseInt(tick.innerHTML);
        num++;
        tick.innerHTML = num;
    }

}