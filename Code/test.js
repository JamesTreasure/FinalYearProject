$(document).ready(function () {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var drawCircle = false
    var moveCircle = false;
    var paint = false;

    var dragOffsetX, dragOffsetY;
    var dragId = -1;


    var drawCircleButton = $("#drawCircle");
    var moveCircleButton = $("#moveCircle");
    var paintButton = $("#paint");

    drawCircleButton.click(function () {
        drawCircle = true;
        moveCircle = false;
        paint = false;
    });

    moveCircleButton.click(function () {
        drawCircle = false;
        moveCircle = true;
        paint = false;
    });

    paintButton.click(function () {
        drawCircle = false;
        moveCircle = false;
        paint = true;
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

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }


    $(window).mousedown(function (e) {
        var pos = getMousePos(canvas, e);
        console.log("Canvas height: " + canvasHeight + ", Canvas Width: " + canvasWidth);
        console.log("X: " + pos.x + ", Y: " + pos.y);

        if (paint) {
            paintLocation(pos.x, pos.y)
        }

        if (drawCircle) {
            circles.push(new Circle(pos.x, pos.y, 1));
            drag = true;
        }

        if (moveCircle) {
            for (var i = 0; i < circles.length; i++) {
                dx = pos.x - circles[i].x;
                dy = pos.y - circles[i].y;
                var tempCircle = circles[i];
                var inCircle = pointInCircle(pos.x, pos.y, tempCircle.x, tempCircle.y, tempCircle.radius)
                if (inCircle) {
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
        var pos = getMousePos(canvas, e);
        if (drawCircle) {
            if (drag) {
                if (circles[circles.length - 1].radius > 0) {
                    circles[circles.length - 1].radius = Math.sqrt(Math.pow((circles[circles.length - 1].x - pos.x), 2) + Math.pow((circles[circles.length - 1].y - pos.y), 2));
                }
            }
        }

        if (moveCircle) {
            if (drag) {
                circles[dragId].x = pos.x - dragOffsetX;
                circles[dragId].y = pos.y - dragOffsetY;
            }
        }
    })

    function paintLocation(x, y) {
        var coord = "x=" + x + ", y=" + y;
        var pixel = context.getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
        $('#status').html(coord + "<br>" + hex);
        floodFill(x, y, pixel[0], pixel[1], pixel[2])
    }

    function floodFill(x, y, startR, startG, startB) {

        // var pixelStack = [[startX, startY]];
        //
        context.fillStyle = "rgb(0, 255, 0, 1)";
        context.fillRect(x, y, 20, 20);
    }


function animate() {
    // Clear
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0; i < circles.length; i++) {

        var tempCircle = circles[i];

        context.beginPath();

        context.arc(tempCircle.x, tempCircle.y, tempCircle.radius, 0, Math.PI * 2, false);
        if (moveCircle && drag) {
            context.lineWidth = 5;
            context.strokeStyle = '#8B374A';
            context.stroke();
        }
        context.lineWidth = 5;
        context.strokeStyle = '#8B374A';
        context.stroke();
    }
    setTimeout(animate, 33);
};

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}


animate();
})
;