$(document).ready(function () {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var circlesArray = new Array();
    var Circle = function (x, y, radius) {
        this.x = x; //Centre of the circle
        this.y = y; //Centre of the circle
        this.radius = radius;
    };

    var barbaraArray = [[0], [1], [0, 1], [1, 2]];
    barbaraArray.sort(function (a, b) {
        return a[0] - b[0];
    });

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    createCircles();
    var clickedInArray = new Array();

    $(window).mousedown(function (e) {
        var pos = getMousePos(canvas, e);
        whichCircleClickedIn(pos.x, pos.y);
        paintLocation(pos.x, pos.y, fillColorR, fillColorG, fillColorB);
        // isSyllogismComplete();
        checkIsIn2dArray();
    })


    function whichCircleClickedIn(x, y) {
        var tempArray = new Array();
        for (var i = 0; i < circlesArray.length; i++) {
            var circle = circlesArray[i];
            var distanceSquared = (x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y);
            if (distanceSquared <= circle.radius * circle.radius) {
                console.log("Clicked in circle " + i);
                tempArray.push(i);
            }
        }




        if (clickedInArray.length < 1) {
            clickedInArray.push(tempArray);
        } else {
            for (var i = 0; i < clickedInArray.length; i++) {
                console.log(clickedInArray[i].toString());
                console.log(tempArray.toString());
                if (clickedInArray[i].toString() === tempArray.toString()) {
                    console.log("You've already clicked here! + " + i);
                } else {
                    console.log("Adding new click location + " + i);
                    clickedInArray.push(tempArray);
                    break;
                }
            }
        }


        // if(clickedInArray && clickedInArray.length > 0){
        //     console.log("clickedInArray.length: " + clickedInArray.length);
        //     for (var i = 0; i < clickedInArray.length; i++) {
        //         if(clickedInArray[i].toString() === tempArray.toString()){
        //             clickedInArray.splice(i, 1);
        //         }else{
        //             clickedInArray.push(tempArray);
        //         }
        //     }
        // }else{
        //     clickedInArray.push(tempArray);
        // }
    }

    function createCircles() {
        circlesArray.push(new Circle(300, 250, 100))
        circlesArray.push(new Circle(250, 350, 100))
        circlesArray.push(new Circle(350, 350, 100))

        for (var i = 0; i < circlesArray.length; i++) {
            var circle = circlesArray[i];
            context.beginPath();
            context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            context.lineWidth = 5;
            context.strokeStyle = '#8B374A';
            context.stroke();
            context.closePath();
        }
    }

    function checkIsIn2dArray() {
        clickedInArray.sort(function (a, b) {
            return a[0] - b[0];
        });

        if (clickedInArray.length !== barbaraArray.length) {
            console.log("Syllogism not correct");
        } else if (barbaraArray.toString() === clickedInArray.toString()) {
            console.log("Syllogism met")
        } else {
            console.log("Nope, syllogism not met");
        }

    }

    var colorLayer = null;
    var startR = 0,
        startG = 0,
        startB = 0;

    var fillColorR = 230,
        fillColorG = 200,
        fillColorB = 50;


    function paintLocation(startX, startY, r, g, b) {
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
                colorPixel(pixelPos, r, g, b);

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

    function colorPixel(pixelPos, r, g, b) {
        colorLayer.data[pixelPos] = r;
        colorLayer.data[pixelPos + 1] = g;
        colorLayer.data[pixelPos + 2] = b;
        colorLayer.data[pixelPos + 3] = 255;
    }

})
;