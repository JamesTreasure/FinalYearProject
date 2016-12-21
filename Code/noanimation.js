$(document).ready(function () {
    var layer1 = document.getElementById('layer1');
    var layer2 = document.getElementById('layer2');
    var context1 = layer1.getContext('2d');
    var context2 = layer2.getContext('2d');
    var canvasWidth = layer1.width;
    var canvasHeight = layer1.height;

    var dragId;
    var dragOffsetX;
    var dragOffsetY;
    var drag = false;
    var font = '20pt san-serif';
    var fontHeight = 20;
    var majorPremiseMet;
    var minorPremiseMet;

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

    var moveText;
    $(window).mousedown(function (e) {
        var pos = getMousePos(layer1, e);
        var clickedOn = textClickedOn(pos.x, pos.y);
        if (clickedOn >= 0) {
            moveText = true;
            var textX = movableTextArray[clickedOn].x;
            var textY = movableTextArray[clickedOn].y;
            dragId = clickedOn;
            dragOffsetX = pos.x - textX;
            dragOffsetY = pos.y - textY;
            drag = true;
        }
        if (!moveText) {
            whichCircleClickedIn(pos.x, pos.y);
            newCheck();
        }
    });

    $(window).mousemove(function (e) {
        var pos = getMousePos(layer1, e);
        if (moveText) {
            if (drag) {
                movableTextArray[dragId].x = pos.x - dragOffsetX;
                movableTextArray[dragId].y = pos.y - dragOffsetY;
                newCheck();
                requestAnimationFrame(animate);
            }
        }
    });

    $(window).mouseup(function (e) {
        drag = false;
        moveText = false;
        dragId = -1;
    })

    function main() {
        setupStaticText();
        setupMovableText();
        drawStaticText();
        drawMovableText();
        createCircles();
        drawCircles();
    }

    function redrawLayer1(){
        drawStaticText();
    }

    function clearStaticText(){
        for (var i = 0; i < staticTextArray.length; i++) {
            context1.clearRect(staticTextArray[i].x, staticTextArray[i].y-staticTextArray[i].height, staticTextArray[i].width, staticTextArray[i].height);
        }
        layer1.style.backgroundColor = 'rgba(255,50,25,0.2)';
    }

    function newCheck() {
        var result;
        var menCircle = whichCircleIsPremiseIn(movableTextArray[0]);
        var mortalCircle = whichCircleIsPremiseIn(movableTextArray[1]);
        var greeksCircle = whichCircleIsPremiseIn(movableTextArray[2]);
        var greeksMenIntersection;
        var greeksMortalIntersection
        if (greeksCircle !== null && mortalCircle !== null && menCircle !== null) {
            greeksMenIntersection = [greeksCircle[0], menCircle[0]];
            greeksMortalIntersection = [greeksCircle[0], mortalCircle[0]];
            result = [greeksCircle, menCircle, greeksMenIntersection.sort(), greeksMortalIntersection.sort()];
            doThisBit = true;
        } else {
            $("#syllogismMet").html("Syllogism not met");
            doThisBit = false;
        }

        var doThisBit;

        if(doThisBit){
            var inArray;
            for (var i = 0; i < result.length; i++) {
                var tempBoolean = false;
                for (var j = 0; j < clickedInArray.length; j++) {
                    if (result[i].equals(clickedInArray[j])) {
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
        }

        if(arrayContainsAnotherArray(clickedInArray, menCircle) && arrayContainsAnotherArray(clickedInArray, greeksMenIntersection)){
            console.log("All men are mortal!");
            majorPremiseMet = true;
            clearStaticText();
            redrawLayer1();
        }else{
            majorPremiseMet = false;
            clearStaticText();
            redrawLayer1();
        }

        if(arrayContainsAnotherArray(clickedInArray, greeksCircle) && arrayContainsAnotherArray(clickedInArray, greeksMortalIntersection)){
            console.log("All men are mortal!");
            minorPremiseMet = true;
            clearStaticText();
            redrawLayer1();
        }else{
            minorPremiseMet = false;
            clearStaticText();
            redrawLayer1();
        }


        $("#barbaraArray").html(result);
        $("#array").html(clickedInArray);

        if (typeof result == 'undefined' || result === null || clickedInArray.length !== result.length) {
            $("#syllogismMet").html("Syllogism not met");
        } else if (inArray) {
            $("#syllogismMet").html("Syllogism met");
        } else {
            $("#syllogismMet").html("Syllogism not met");
        }


        $("#menCircle").html("Men is in circle " + menCircle);
        $("#mortalCircle").html("Mortal is in circle " + mortalCircle);
        $("#greeksCircle").html("Greeks is in circle " + greeksCircle);
    }

    function animate() {
        drawMovableText();
    }

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function arrayContainsAnotherArray(array1, array2){
        for (var i = 0; i < array1.length; i++) {
            if(array1[i].equals(array2)){
                return true;
            }
        }
        return false;
    }

    function setupStaticText() {
        staticTextArray.push(new Text("All Men Are Mortal", null, 80));
        staticTextArray.push(new Text("All Greeks Are Men", null, 100));
        staticTextArray.push(new Text("All Greeks Are Mortal", null, 120));
    }

    function setupMovableText() {
        movableTextArray.push(new Text("Men", null, 550));
        movableTextArray.push(new Text("Mortal", null, 550));
        movableTextArray.push(new Text("Greeks", null, 550));
        for (var i = 0; i < movableTextArray.length; i++) {
            movableTextArray[i].width = context2.measureText(movableTextArray[i].text).width;
            movableTextArray[i].x = i * (canvasWidth / 3) + 40;
            movableTextArray[i].height = 20;
        }

    }

    function drawStaticText() {
        for (var i = 0; i < staticTextArray.length; i++) {
            if(i===0 && majorPremiseMet){
                context1.fillStyle = "#32CD32";
            }else if(i === 1 && minorPremiseMet){
                context1.fillStyle = "#32CD32";
            }else if(i === 2 && minorPremiseMet && majorPremiseMet){
                context1.fillStyle = "#32CD32";
            }else{
                context1.fillStyle = "#003300";
            }
            context1.font = font;
            staticTextArray[i].width = (context1.measureText(staticTextArray[i].text).width);
            staticTextArray[i].x = ((layer1.width / 2) - (staticTextArray[i].width / 2));
            staticTextArray[i].height = fontHeight;
            context1.fillText(staticTextArray[i].text, staticTextArray[i].x, staticTextArray[i].y);
        }
    }

    function drawMovableText() {
        context2.clearRect(0, 0, layer1.width, layer2.height)
        for (var i = 0; i < movableTextArray.length; i++) {
            context2.fillStyle = "#003300";
            context2.font = font;
            context2.fillText(movableTextArray[i].text, movableTextArray[i].x, movableTextArray[i].y);
        }
    }

    function textClickedOn(x, y) {
        for (var i = 0; i < movableTextArray.length; i++) {
            var textWidth = context1.measureText(movableTextArray[i].text).width;
            if (x >= movableTextArray[i].x && x <= movableTextArray[i].x + textWidth && y >= (movableTextArray[i].y - 20) && y <= movableTextArray[i].y) {
                return i;
            }
        }
        return -1;
    }

    function circleEdgeClicked(x, y) {
        var color = new Uint32Array(context1.getImageData(x, y, 1, 1).data.buffer)[0];
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
                if (clickedInArray[i].equals(tempArray)) {
                    hasBeenAlreadyClickedIn = true;
                    clickedInArrayLocation = i;
                }
            }
        }

        if (hasBeenAlreadyClickedIn === false) {
            tempArray.sort();
            clickedInArray.push(tempArray);
            paintLocation(x, y, fillColorR, fillColorG, fillColorB);
        } else {
            clickedInArray.splice(clickedInArrayLocation, 1);
            paintLocation(x, y, 255, 255, 255);
        }
    }

    function whichCircleIsPremiseIn(rectangle) {
        var tempPremiseLocation = [];
        for (var i = 0; i < circlesArray.length; i++) {
            var dx = Math.max(circlesArray[i].x - rectangle.x, (rectangle.x + rectangle.width) - circlesArray[i].x);
            var dy = Math.max(circlesArray[i].y - rectangle.y, (rectangle.y + rectangle.height) - circlesArray[i].y);
            var inCircle = circlesArray[i].radius * circlesArray[i].radius >= dx * dx + dy * dy;
            if (inCircle) {
                tempPremiseLocation.push(i);
            }
        }
        if (tempPremiseLocation.length === 1) {
            return tempPremiseLocation;
        } else {
            return null;
        }
    }

    function paintLocation(startX, startY, r, g, b) {
        var colorLayer = context1.getImageData(0, 0, canvasWidth, canvasHeight);
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
        context1.putImageData(colorLayer, 0, 0);
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
            context1.beginPath();
            context1.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            context1.lineWidth = 5;
            context1.strokeStyle = '#FF0000';
            context1.stroke();
            context1.closePath();
        }
    }

    main();
})
;