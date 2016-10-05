$(document).ready(function () {
    var canvas = $("#myCanvas");
    var context = canvas.get(0).getContext("2d");
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();
    $(window).resize(resizeCanvas);

    function resizeCanvas() {
        canvas.attr("width", $(window).get(0).innerWidth);
        canvas.attr("height", $(window).get(0).innerHeight);
        canvasWidth = canvas.width();
        canvasHeight = canvas.height();
    };

    resizeCanvas();

    var circles = new Array();
    var drag = false;

    var Circle = function (x, y, radius) {
        this.x = x; //Centre of the circle
        this.y = y; //Centre of the circle
        this.radius = radius;
    };

    function pointInCircle(x, y, cx, cy, radius) {
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    }


    $(window).on("contextmenu", function(e){
        var isInCircle = pointInCircle(e.pageX, e.pageY,circles[0].x, circles[0].radius, circles[0].radius);
        console.log(isInCircle);
    });

    $(window).mousedown(function (e) {
        circles.push(new Circle(e.pageX, e.pageY, 1));
        drag = true;
    })

    $(window).mouseup(function (e) {
        drag = false;
    })

    $(window).dblclick(function (e) {
        console.log("Double Click!")
    })


    $(window).mousemove(function (e) {
        if (drag) {
            if (circles[circles.length - 1].radius > 0) {
                circles[circles.length - 1].radius = Math.sqrt(Math.pow((circles[circles.length - 1].x - e.pageX), 2) + Math.pow((circles[circles.length - 1].y - e.pageY), 2));
            }
        }
    })

    function animate() {
        // Clear
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        for (var i = 0; i < circles.length; i++) {

            var tempCircle = circles[i];

            context.beginPath();

            context.arc(tempCircle.x, tempCircle.y, tempCircle.radius, 0, Math.PI * 2, false);
            context.fillStyle = 'green';
            context.fill();
        }
        setTimeout(animate, 33);
    };


    animate();
});