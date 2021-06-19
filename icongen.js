var createIcon = function(w){
    var c = document.createElement("canvas");
    c.width = w;
    c.height = w;//384
    document.body.appendChild(c);
    var ctx = c.getContext("2d");
    ctx.font = Math.floor(480/384*w)+"px sans-serif";
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillText("H",20/384*w,360/384*w);
}
