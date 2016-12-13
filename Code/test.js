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
        animate();
    });

    paintButton.click(function () {
        drawCircle = false;
        moveCircle = false;
        paint = true;
    });

    var circles = new Array();
    var rectangles = new Array();
    var drag = false;


    var Rectange = function(x,y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

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
        if (paint) {
            paintLocation(pos.x, pos.y)
        }

        if (drawCircle) {
            //it might be bette to pass the circle object to the drag function instead of initially setting with
            //radius of 1. I think it will stop the issue of drawing circles with 1 radius.
            circles.push(new Circle(pos.x, pos.y, 50));

            //drag = true;
        }

        if (moveCircle) {
            animate();
            // for (var i = 0; i < circles.length; i++) {
            //     dx = pos.x - circles[i].x;
            //     dy = pos.y - circles[i].y;
            //     var tempCircle = circles[i];
            //     var inCircle = pointInCircle(pos.x, pos.y, tempCircle.x, tempCircle.y, tempCircle.radius)
            //     if (inCircle) {
            //         dragId = i;
            //         dragOffsetX = dx; //store offsets so item doesn't 'jump'
            //         dragOffsetY = dy;
            //         drag = true;
            //         return;
            //     }
            // }
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

    var colorLayer = null;

    //this will be initialised to the value of where the mouse is clicked
    var startR = 0,
        startG = 0,
        startB = 0;

    //this is the colour that will the filled
    var fillColorR = 230,
        fillColorG = 200,
        fillColorB = 50;

    function paintLocation(startX, startY) {
        console.log("Start x: " + startX);
        console.log("Start y: " + startY);
        colorLayer = context.getImageData(0, 0, canvasWidth, canvasHeight);

        pixelPos = (startY * canvasWidth + startX) * 4;

        startR = colorLayer.data[pixelPos];
        startG = colorLayer.data[pixelPos + 1];
        startB = colorLayer.data[pixelPos + 2];

        var pixelStack = [
            [startX, startY]
        ];
        var drawingBoundTop = 0;
        var guard = 10000;
        while (pixelStack.length) {
            if (guard-- < 0) break;
            var newPos, x, y, pixelPos, reachLeft, reachRight;
            newPos = pixelStack.pop();
            x = newPos[0];
            y = newPos[1];

            pixelPos = (y * canvasWidth + x) * 4;
            while (y-- >= drawingBoundTop && matchStartColor(pixelPos)) {
                pixelPos -= canvasWidth * 4;
            }
            pixelPos += canvasWidth * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            while (y++ < canvasHeight - 1 && matchStartColor(pixelPos)) {
                colorPixel(pixelPos);

                if (x > 0) {
                    if (matchStartColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < canvasWidth - 1) {
                    if (matchStartColor(pixelPos + 4)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += canvasWidth * 4;
            }
        }
        context.putImageData(colorLayer, 0, 0);

    }

    function matchStartColor(pixelPos) {
        var r = colorLayer.data[pixelPos];
        var g = colorLayer.data[pixelPos + 1];
        var b = colorLayer.data[pixelPos + 2];

        return (r == startR && g == startG && b == startB);
    }

    function colorPixel(pixelPos) {
        colorLayer.data[pixelPos] = fillColorR;
        colorLayer.data[pixelPos + 1] = fillColorG;
        colorLayer.data[pixelPos + 2] = fillColorB;
        colorLayer.data[pixelPos + 3] = 255;
    }

    function animate() {
        // Clear
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        if(circles.length > 1){
            checkIntersection();
        }

        for (var i = 0; i < rectangles.length; i++) {
            var tempRectangle = rectangles[i];
            context.fillStyle="#ff0000";
            context.fillRect(tempRectangle.x, tempRectangle.y, tempRectangle.width, tempRectangle.height);
        }

        for (var i = 0; i < circles.length; i++) {
            var tempCircle = circles[i];
            context.beginPath();
            context.globalCompositeOperation = "destination-over";

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
        //setTimeout(animate, 33);
    };

    function getPixelColor(img, x, y) {
        var data = img.data;
        var offset = ((y * (img.width * 4)) + (x * 4));
        var result = data[offset + 0] << 24; // r
        result |= data[offset + 1] << 16; // g
        result |= data[offset + 2] << 8; // b
        return result;
    }

    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    function checkIntersection(){
        for (var i = 0; i < circles.length; i++) {
            for (var j = i+1; j < circles.length; j++) {
                //ABS(R0-R1) <= SQRT((x0-x1)^2+(y0-y1)^2) <= (R0+R1)
                var radiuses = Math.abs(circles[i].radius - circles[j].radius);
                var intersect = Math.sqrt(Math.pow((circles[i].x-circles[j].x),2)+Math.pow((circles[i].y-circles[j].y),2));


                if(Math.hypot(circles[i].x-circles[j].x, circles[i].y-circles[j].y) <= (circles[i].radius + circles[j].radius)){
                    console.log("Circle " + i + " intersects with circle " + j);
                }


                // if(Math.abs(circles[i].radius - circles[j].radius) <= intersect <= Math.abs(circles[i].radius + circles[j].radius)){
                //     console.log("Intersect");
                // }

            }
            
        }
    }

    //animate();
})
;