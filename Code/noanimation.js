$(document).ready(function () {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    var dragId;
    var dragOffsetX;
    var dragOffsetY;
    var drag = false;
    var font = '20pt san-serif';

    var circlesArray = new Array();
    var Circle = function (x, y, radius) {
        this.x = x; //Centre of the circle
        this.y = y; //Centre of the circle
        this.radius = radius;
    };

    var staticTextArray = [];
    var movableTextArray = [];
    var Text = function (text, x, y, width, height) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    var clickedInArray = [];
    var ClickedIn = function (clickedIn, x, y) {
        this.clickedIn = clickedIn;
        this.x = x;
        this.y = y;
    }

    var barbaraArray = [[0], [1], [0, 1], [1, 2]];

    var premiseLocation = [];
    var Premise  = function(premise, location){
        this.premise = premise;
        this.location = location;
    }


    //This doesn't actually show up but for some reason if I don't have it the text isn't centered.
    context.fillStyle = "#003300";
    context.font = font;
    var aaa = "This should be centered"
    context.fillText(aaa, (canvas.width / 2) - (context.measureText(aaa).width / 2), 50);


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
    
    $(window).mousedown(function (e) {
        var pos = getMousePos(canvas, e);
        if (playGame) {
            whichCircleClickedIn(pos.x, pos.y);
            checkIsIn2dArray();
        } else if (moveText) {
            var clickedOn = textClickedOn(pos.x, pos.y)
            console.log(clickedOn);
            if (clickedOn >= 0) {
                console.log("Clicked on " + clickedOn);
                var textWidth = context.measureText(movableTextArray[clickedOn].text).width;
                console.log("Text width " + textWidth);
                var textX = movableTextArray[clickedOn].x;
                var textY = movableTextArray[clickedOn].y;
                dragId = clickedOn;
                dragOffsetX = pos.x - textX;
                dragOffsetY = pos.y - textY;
                drag = true;
            }
        }
    });

    $(window).mousemove(function (e) {
        var pos = getMousePos(canvas, e);
        if (moveText) {
            if (drag) {
                movableTextArray[dragId].x = pos.x - dragOffsetX;
                movableTextArray[dragId].y = pos.y - dragOffsetY;
                for (var i = 0; i < circlesArray.length; i++) {
                    for (var j = 0; j < movableTextArray.length; j++) {
                        var bool = premiseInCircle(movableTextArray[j], circlesArray[i]);
                        if(bool){
                            console.log("Rectangle " + j + " in circle " + i);
                        }
                    }

                }
                setTimeout(animate(), 33);
            }
        }
    });

    $(window).mouseup(function (e) {
        drag = false;
        dragId = -1;
    })

    function main() {
        setupStaticText();
        setupMoveableText();
        drawStaticText();
        createCircles();
        drawCircles();
    }

    function animate() {
        var fillColorR = 230,
            fillColorG = 200,
            fillColorB = 50;
        drawStaticText();
        drawCircles();
        for (var i = 0; i < clickedInArray.length; i++) {
            paintLocation(clickedInArray[i].x, clickedInArray[i].y, fillColorR, fillColorG, fillColorB);
        }
    }
    
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function setupStaticText() {
        staticTextArray.push(new Text("All Men Are Mortal", null, 80));
        staticTextArray.push(new Text("All Greeks Are Men", null, 100));
        staticTextArray.push(new Text("All Greeks Are Mortal", null, 120));

        for (var i = 0; i < staticTextArray.length; i++) {
            staticTextArray[i].width = context.measureText(staticTextArray[i].text).width;
            staticTextArray[i].x = (canvas.width / 2) - (staticTextArray[i].width / 2);
            staticTextArray[i].height = 20;

        }

    }

    function setupMoveableText(){
        movableTextArray.push(new Text("Men", null, 550));
        movableTextArray.push(new Text("Mortal", null, 550));
        movableTextArray.push(new Text("Greeks", null, 550));

        for (var i = 0; i < movableTextArray.length; i++) {
            movableTextArray[i].width = context.measureText(movableTextArray[i].text).width;
            movableTextArray[i].x = i * (canvasWidth/3)+40;
            movableTextArray[i].height = 20;
        }

    }

    function drawStaticText() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < staticTextArray.length; i++) {
            context.fillStyle = "#003300";
            context.font = font;
            context.fillText(staticTextArray[i].text, staticTextArray[i].x, staticTextArray[i].y);
        }
        for (var i = 0; i < movableTextArray.length; i++) {
            context.fillStyle = "#003300";
            context.font = font;
            context.fillText(movableTextArray[i].text, movableTextArray[i].x, movableTextArray[i].y);
        }
    }

    function textClickedOn(x, y) {
        for (var i = 0; i < movableTextArray.length; i++) {
            var textWidth = context.measureText(movableTextArray[i].text).width;
            if (x >= movableTextArray[i].x && x <= movableTextArray[i].x + textWidth && y >= (movableTextArray[i].y - 20) && y <= movableTextArray[i].y) {
                return i;
            }
        }
        return -1;
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
        //loops through circles and adds all circles clicked in to a temp array
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
                if (clickedInArray[i].clickedIn.equals(tempArray)) {
                    console.log("Already been clicked in");
                    hasBeenAlreadyClickedIn = true;
                    clickedInArrayLocation = i;
                }
            }
        }

        if (hasBeenAlreadyClickedIn === false) {
            clickedInArray.push(new ClickedIn(tempArray, x, y));
            paintLocation(x, y, fillColorR, fillColorG, fillColorB);
        } else {
            clickedInArray.splice(clickedInArrayLocation, 1);
            paintLocation(x, y, 255, 255, 255);
        }
    }

    function premiseInCircle(rectangle, circle){
        var a = [rectangle, circle];
        var dx = Math.max(circle.x - rectangle.x, (rectangle.x+rectangle.width) - circle.x);
        var dy = Math.max(circle.y - rectangle.y, (rectangle.y+rectangle.height)- circle.y);
        return circle.radius*circle.radius >= dx*dx + dy*dy;
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
                if (barbaraArray[i].equals(clickedInArray[j].clickedIn)) {
                    tempBoolean = true;
                    break;
                } else {
                    tempBoolean = false;
                }
            }
            if (tempBoolean === false) {
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
        var t0 = performance.now();
        var colorLayer = context.getImageData(0, 0, canvasWidth, canvasHeight);
        var startR = 0,
            startG = 0,
            startB = 0;

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
        var t1 = performance.now();
        console.log("Call to paint took " + (t1 - t0) + " milliseconds.")

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

    function createCircles() {
        circlesArray.push(new Circle(300, 250, 100))
        circlesArray.push(new Circle(250, 350, 100))
        circlesArray.push(new Circle(350, 350, 100))
    }

    function drawCircles() {
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


    main();

})
;