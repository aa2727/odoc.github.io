function cost_time_travel(d) {
    if (d <= 0) {
        return 0;
    }
    return parseInt(d);
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