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

    var drawCircle = false
    var moveCircle = false;

    var dragOffsetX, dragOffsetY;
    var dragId = -1;


    var drawCircleButton = $("#drawCircle");
    var moveCircleButton = $("#moveCircle");
    drawCircleButton.click(function () {
        drawCircle = true;
        moveCircle = false;
    });

    moveCircleButton.click(function () {
        drawCircle = false;
        moveCircle = true;
    });

    var circles = new Array();
    var drag = false;

    var Circle = function (x, y, radius) {
        this.x = x; //Centre of the circle
        this.y = y; //Centre of the circle
        this.radius = radius;
    };

    function pointInCircle(mouseX, mouseY, circleX, circleY, radius) {
        var distancesquared = (mouseX - circleX) * (mouseX - circleX) + (mouseY - circleY) * (mouseY - circleY);
        return distancesquared <= radius * radius;
    }

    $(window).mousedown(function (e) {
        if (drawCircle) {
            circles.push(new Circle(e.pageX, e.pageY, 1));
            drag = true;
        }

        if(moveCircle){
            for (var i = 0; i < circles.length; i++) {
                dx = e.pageX - circles[i].x;
                dy = e.pageY - circles[i].y;
                var tempCircle = circles[i];
                var inCircle = pointInCircle(e.pageX, e.pageY, tempCircle.x, tempCircle.y, tempCircle.radius)
                console.log(inCircle);
                if(inCircle){
                    dragId = i;
                    dragOffsetX = dx; //store offsets so item doesn't 'jump'
                    dragOffsetY = dy;
                    drag = true;
                    return;
                }
            }
        }
    })

    $(window).mouseup(function (e) {
        drag = false;
        dragIdx = -1;
    })

    $(window).mousemove(function (e) {

        if (drawCircle) {
            if (drag) {
                if (circles[circles.length - 1].radius > 0) {
                    circles[circles.length - 1].radius = Math.sqrt(Math.pow((circles[circles.length - 1].x - e.pageX), 2) + Math.pow((circles[circles.length - 1].y - e.pageY), 2));
                }
            }
        }

        if(moveCircle){
            if(drag){
                console.log("Got here");
                circles[dragId].x = e.pageX - dragOffsetX;
                circles[dragId].y = e.pageY - dragOffsetY;
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
            if(moveCircle && drag){
                context.lineWidth = 5;
                context.strokeStyle = '#00FFFF';
                context.stroke();
            }
            context.lineWidth = 5;
            context.strokeStyle = '#000000';
            context.stroke();
        }
        setTimeout(animate, 33);
    };


    animate();
});