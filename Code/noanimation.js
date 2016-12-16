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

    var clickedInArray = new Array();
    var barbaraArray = [[0], [1], [0, 1], [1, 2]];

    function main() {
        createCircles();
    }


    context.fillStyle = "#003300";
    context.font = '20pt san-serif';
    var textArray = [];
    textArray.push("All Men Are Mortal");
    textArray.push("All Greeks Are Men");
    textArray.push("All Greeks Are Mortal");

    for (var i = 0; i < textArray.length; i++) {
        var textWidth = context.measureText(textArray[i]).width;
        context.fillText(textArray[i], (canvas.width / 2) - (textWidth / 2), (i * 20) + 80);
    }

    var moveTextButton = $("#moveText");
    var moveText;
    moveTextButton.click(function () {
        $("#status").html("Move button selected");
        moveText = true;
        playGame = false
    });

    var playGameButton = $("#playGame");
    var playGame = false;
    playGameButton.click(function () {
        $("#status").html("Play game button selected");
        moveText = false;
        playGame = true;
    });

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    $(window).mousedown(function (e) {
        var pos = getMousePos(canvas, e);
        if (playGame) {
            whichCircleClickedIn(pos.x, pos.y);
            checkIsIn2dArray();
        } else if (moveText) {
            console.log("Move text!");
            textClickedOn(pos.x, pos.y);
        }
    })

    function textClickedOn(x, y) {
        for (var i = 0; i < textArray.length; i++) {
            var textWidth = context.measureText(textArray[i]).width;
            var textX = (canvas.width / 2) - (textWidth / 2);
            var textY = (i * 20) + 80;
            if (x >= textX && x <= textX + textWidth && y >= (textY - 20) && y <= textY) {
                console.log("Clicked inside rectangle " + i);
            }
        }
    }

    function circleEdgeClicked(x, y) {
        var color = new Uint32Array(context.getImageData(x, y, 1, 1).data.buffer)[0];
        return (color << 8) === 0xff00;
    }

    function whichCircleClickedIn(x, y) {
        var fillColorR = 230,
            fillColorG = 200,
            fillColorB = 50;


        if (circleEdgeClicked(x, y)) {
            return false;
        }


        var tempArray = new Array();
        for (var i = 0; i < circlesArray.length; i++) {
            var circle = circlesArray[i];
            var distanceSquared = (x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y);
            if (distanceSquared <= circle.radius * circle.radius) {
                tempArray.push(i);
            }
        }

        if (tempArray.length < 1) {
            return;
        }

        var hasBeenAlreadyClickedIn = false;
        var clickedInArrayLocation;
        if (clickedInArray.length > 0) {
            for (var i = 0; i < clickedInArray.length; i++) {
                if (clickedInArray[i].equals(tempArray)) {
                    hasBeenAlreadyClickedIn = true;
                    clickedInArrayLocation = i;
                }
            }
        }
        if (hasBeenAlreadyClickedIn === false) {
            clickedInArray.push(tempArray);
            paintLocation(x, y, fillColorR, fillColorG, fillColorB);
        } else {
            clickedInArray.splice(clickedInArrayLocation, 1);
            paintLocation(x, y, 255, 255, 255);
        }
    }


    function checkIsIn2dArray() {
        clickedInArray.sort(function (a, b) {
            return a[0] - b[0];
        });

        barbaraArray.sort(function (a, b) {
            return a[0] - b[0];
        });

        for (var i = 0; i < clickedInArray.length; i++) {
            console.log(clickedInArray[i]);
        }

        var inArray;
        for (var i = 0; i < barbaraArray.length; i++) {
            var tempBoolean = false;
            for (var j = 0; j < clickedInArray.length; j++) {
                if (barbaraArray[i].equals(clickedInArray[j])) {
                    console.log("Here we are " + barbaraArray[i]);
                    tempBoolean = true;
                    break;
                } else {
                    tempBoolean = false;
                }
            }
            if (tempBoolean === false) {
                console.log("The problem was - " + barbaraArray[i]);
                inArray = false;
                break;
            }
            inArray = tempBoolean;
        }

        $("#barbaraArray").html(barbaraArray);
        $("#array").html(clickedInArray);


        if (clickedInArray.length !== barbaraArray.length) {
            $("#syllogismMet").html("Syllogism not met");
        } else if (inArray) {
            $("#syllogismMet").html("Syllogism met");
        } else {
            $("#syllogismMet").html("Syllogism not met");
        }
    }

    function paintLocation(startX, startY, r, g, b) {
        var colorLayer = context.getImageData(0, 0, canvasWidth, canvasHeight);
        var startR = 0,
            startG = 0,
            startB = 0;

        pixelPos = (startY * canvasWidth + startX) * 4;

        startR = colorLayer.data[pixelPos];
        startG = colorLayer.data[pixelPos + 1];
        startB = colorLayer.data[pixelPos + 2];

        //commenting out red check because it is being checked when the circle is clicked.
        // if (startR === 255 && startG === 0 && startB === 0) {
        //     return;
        // }

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
            while (y-- >= drawingBoundTop && matchStartColor(colorLayer, pixelPos, startR, startG, startB)) {
                pixelPos -= canvasWidth * 4;
            }
            pixelPos += canvasWidth * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            while (y++ < canvasHeight - 1 && matchStartColor(colorLayer, pixelPos, startR, startG, startB)) {
                colorPixel(colorLayer, pixelPos, r, g, b);

                if (x > 0) {
                    if (matchStartColor(colorLayer, pixelPos - 4, startR, startG, startB)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < canvasWidth - 1) {
                    if (matchStartColor(colorLayer, pixelPos + 4, startR, startG, startB)) {
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

    function matchStartColor(colorLayer, pixelPos, startR, startG, startB) {
        var r = colorLayer.data[pixelPos];
        var g = colorLayer.data[pixelPos + 1];
        var b = colorLayer.data[pixelPos + 2];

        return (r == startR && g == startG && b == startB);
    }

    function colorPixel(colorLayer, pixelPos, r, g, b) {
        colorLayer.data[pixelPos] = r;
        colorLayer.data[pixelPos + 1] = g;
        colorLayer.data[pixelPos + 2] = b;
        colorLayer.data[pixelPos + 3] = 255;
    }

// Warn if overriding existing method
    if (Array.prototype.equals)
        console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }
// Hide method from for-in loops
    Object.defineProperty(Array.prototype, "equals", {enumerable: false});


    function createCircles() {
        circlesArray.push(new Circle(300, 250, 100))
        circlesArray.push(new Circle(250, 350, 100))
        circlesArray.push(new Circle(350, 350, 100))

        for (var i = 0; i < circlesArray.length; i++) {
            var circle = circlesArray[i];
            context.beginPath();
            context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            context.lineWidth = 5;
            context.strokeStyle = '#FF0000';
            context.stroke();
            context.closePath();
        }
    }

    main();

})
;