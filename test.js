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

    var circles = [];
    var drag = false;
    var c = {};
    var circleMade = false;

    var Circle = function (x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    };

    function printMousePos(event) {
        console.log("clientX: " + event.clientX + " - clientY: " + event.clientY);
    }


    $(window).mousedown(function (e) {
        var canvasOffset = canvas.offset();
        // c.startX = e.pageX - canvasOffset.left;
        // c.startY = e.pageY - canvasOffset.top;
        //
        // c.X = c.startX;
        // c.Y = c.startY;
        circles.push(new Circle(e.pageX, e.pageY, 100))
        drag = true;
    })

    $(window).mouseup(function (e) {
        drag = false;
        circles.push(new Circle(c.X, c.Y, c.radius))
        circleMade = true;
        c = {};
    })

    $(window).mousemove(function (e) {
        if (drag) {
            var canvasOffset = canvas.offset();
            console.log(circles[circles.length-1])
            console.log(circles[circles.length-1].x)
            console.log(circles[circles.length-1].y)

            if(circles[circles.length - 1].radius > 0){
                circles[circles.length - 1].radius--;
            }

            // c.X = e.pageX - canvasOffset.left;
            // c.Y = e.pageY - canvasOffset.top;
            // if (!circleMade) {
            //     c.radius = Math.sqrt(Math.pow((c.X - c.startX), 2) + Math.pow((c.Y - c.startY), 2));
            // }
        }
    })

    function animate() {

        // Clear
        context.clearRect(0, 0, canvasWidth, canvasHeight);


        console.log(circles.length)
        for (var i = 0; i < circles.length; i++) {

            var tempCircle = circles[i];

            context.beginPath();
            console.log("Circle radius = " + tempCircle.radius)
            context.arc(tempCircle.x, tempCircle.y, tempCircle.radius, 0, Math.PI * 2, false);
            context.fillStyle = 'green';
            context.fill();
        }
        setTimeout(animate, 33);
    };


    animate();
});