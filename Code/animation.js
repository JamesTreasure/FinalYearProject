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

    function main(){
        addSyllogism(context, canvas);
        createCircles();
    }

    function addSyllogism(context, canvas) {
        context.fillStyle = "#003300";
        context.font = '20px san-serif';
        var allMenAreMortal = "All Men Are Mortal";
        var allGreeksAreMen = "All Greeks Are Men";
        var allGreeksAreMortal = "All Greeks Are Mortal";

        var textWidth = context.measureText(allMenAreMortal).width;
        context.fillText(allMenAreMortal, (canvas.width / 2) - (textWidth / 2), 80);
        context.fillText(allGreeksAreMen, (canvas.width / 2) - (textWidth / 2), 100);
        context.fillText(allGreeksAreMortal, (canvas.width / 2) - (textWidth / 2), 120);
    }

    var moveText = $("#moveText");
    var moveText = false;
    moveText.click(function () {
        moveText = true;
        animate();
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
        whichCircleClickedIn(pos.x, pos.y);
        checkIsIn2dArray();
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

    function circleEdgeClicked(x,y){
        var colorLayer = context.getImageData(0, 0, canvasWidth, canvasHeight);
        var pixelPos = (x * canvasWidth + y) * 4;

        startR = colorLayer.data[pixelPos];
        startG = colorLayer.data[pixelPos + 1];
        startB = colorLayer.data[pixelPos + 2];

        return(startR === 255 && startG === 0 && startB === 0);
    }

    function whichCircleClickedIn(x, y) {
        var fillColorR = 230,
            fillColorG = 200,
            fillColorB = 50;

        if(circleEdgeClicked(x,y)){
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

        if(tempArray.length < 1){
            return;
        }

        var hasBeenAlreadyClickedIn = false;
        var clickedInArrayLocation;
        if(clickedInArray.length > 0){
            for (var i = 0; i < clickedInArray.length; i++) {
                if(clickedInArray[i].equals(tempArray)){
                    hasBeenAlreadyClickedIn = true;
                    clickedInArrayLocation = i;
                }
            }
        }
        if(hasBeenAlreadyClickedIn === false){
            clickedInArray.push(tempArray);
            paintLocation(x, y, fillColorR, fillColorG, fillColorB);
        }else{
            clickedInArray.splice(clickedInArrayLocation, 1);
            paintLocation(x,y,255,255,255);
        }
    }



    function checkIsIn2dArray() {
        clickedInArray.sort(function (a, b) {
            return a[0] - b[0];
        });

        barbaraArray.sort(function (a, b) {
            return a[0] - b[0];
        });

        if (clickedInArray.length !== barbaraArray.length) {
            $("#syllogismMet").html("Syllogism not met");
        } else if (barbaraArray.equals(clickedInArray)){
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

        if(startR === 255 && startG === 0 && startB === 0){
            return;
        }

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
            while (y-- >= drawingBoundTop && matchStartColor(colorLayer,pixelPos, startR, startG, startB)) {
                pixelPos -= canvasWidth * 4;
            }
            pixelPos += canvasWidth * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            while (y++ < canvasHeight - 1 && matchStartColor(colorLayer,pixelPos, startR, startG, startB)) {
                colorPixel(colorLayer,pixelPos, r, g, b);

                if (x > 0) {
                    if (matchStartColor(colorLayer,pixelPos - 4,startR, startG, startB)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < canvasWidth - 1) {
                    if (matchStartColor(colorLayer,pixelPos + 4,startR, startG, startB)) {
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
    if(Array.prototype.equals)
        console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
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
