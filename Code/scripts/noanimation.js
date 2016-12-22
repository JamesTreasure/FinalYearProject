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
    var circlesNeeded;
    var correctSyllogism;
    var blankSyllogism;
    var majorPremise;

    var circlesArray = new Array();
    var Circle = function (x, y, radius) {
        this.x = x; //Centre of the circle
        this.y = y; //Centre of the circle
        this.radius = radius;
    };

    var staticTextArray = [];
    var movableTextArray = [];
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
        setupLevel();
        setupMovableText();
        drawStaticText();
        drawMovableText();
        createCircles();
        drawCircles();
    }

    function setupLevel() {
        $.ajaxSetup({
            async: false
        });

        $.getJSON("settings.json", function (json) {
            console.log(json); // this will show the info it in firebug console
            circlesNeeded = json.level1.circlesNeeded;
            staticTextArray = json.level1.staticTextArray;
            movableTextArray = json.level1.movableTextArray;
            correctSyllogism = json.level1.correctSyllogism;
            blankSyllogism = json.level1.blankSyllogism;
            majorPremise = json.level1.majorPremise;

            console.log("Test");
            console.log(isSubset(correctSyllogism, majorPremise));
            console.log(isSubset(majorPremise, correctSyllogism));
        });

    }

    function isSubset(obj1, obj2) {
        for (var key in obj2){
            if (JSON.stringify(obj2[key]) === JSON.stringify(obj1[key]))
                return true;
        }
        return false;
    }

    function redrawLayer1() {
        drawStaticText();
    }

    function clearStaticText() {
        for (var i = 0; i < staticTextArray.length; i++) {
            context1.clearRect(staticTextArray[i].x, staticTextArray[i].y - staticTextArray[i].height,
                staticTextArray[i].width, staticTextArray[i].height + (canvasHeight / 40));
        }
    }

    function newCheck() {
        //all of these are arrays
        var middle = whichCircleIsPremiseIn(movableTextArray[0]);
        var predicate = whichCircleIsPremiseIn(movableTextArray[1]);
        var subject = whichCircleIsPremiseIn(movableTextArray[2]);
        var middleSubjectIntersection;
        var subjectPredicateIntersection;
        var middlePredicateIntersection;
        var middleSubjectPredicateIntersection;

        if (subject !== null && predicate !== null && middle !== null) {
            middleSubjectIntersection = [subject[0], middle[0]].sort();
            subjectPredicateIntersection = [subject[0], predicate[0]].sort();
            middlePredicateIntersection = [middle[0], predicate[0]].sort();
            middleSubjectPredicateIntersection = [middle[0], subject[0], predicate[0]].sort();
        }

        blankSyllogism.subject = arrayContainsAnotherArray(clickedInArray, subject);
        blankSyllogism.middle = arrayContainsAnotherArray(clickedInArray, middle);
        blankSyllogism.predicate = arrayContainsAnotherArray(clickedInArray, predicate);
        blankSyllogism.middleSubjectIntersection = arrayContainsAnotherArray(clickedInArray, middleSubjectIntersection);
        blankSyllogism.middlePredicateIntersection = arrayContainsAnotherArray(clickedInArray, middlePredicateIntersection);
        blankSyllogism.middleSubjectPredicateIntersection = arrayContainsAnotherArray(clickedInArray, middleSubjectPredicateIntersection);
        blankSyllogism.subjectPredicateIntersection = arrayContainsAnotherArray(clickedInArray, subjectPredicateIntersection);


        if (_.isEqual(blankSyllogism, correctSyllogism)) {
            console.log("Correct");
        } else {
            console.log("Incorrect");
        }




        if (arrayContainsAnotherArray(clickedInArray, middle) && arrayContainsAnotherArray(clickedInArray, middleSubjectIntersection)
            && !arrayContainsAnotherArray(clickedInArray, middlePredicateIntersection) && !arrayContainsAnotherArray(clickedInArray, middleSubjectPredicateIntersection)) {
            majorPremiseMet = true;
            clearStaticText();
            redrawLayer1();
        } else {
            majorPremiseMet = false;
            clearStaticText();
            redrawLayer1();
        }

        if (arrayContainsAnotherArray(clickedInArray, subject) && arrayContainsAnotherArray(clickedInArray, subjectPredicateIntersection)) {
            minorPremiseMet = true;
            clearStaticText();
            redrawLayer1();
        } else {
            minorPremiseMet = false;
            clearStaticText();
            redrawLayer1();
        }


        $("#menCircle").html("Men is in circle " + middle);
        $("#mortalCircle").html("Mortal is in circle " + predicate);
        $("#greeksCircle").html("Greeks is in circle " + subject);
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

    function arrayContainsAnotherArray(array1, array2) {
        for (var i = 0; i < array1.length; i++) {
            if (array1[i].equals(array2)) {
                return true;
            }
        }
        return false;
    }

    function setupMovableText() {
        context2.fillStyle = "#003300";
        context2.font = font;
        for (var i = 0; i < movableTextArray.length; i++) {
            movableTextArray[i].width = context2.measureText(movableTextArray[i].text).width;
            movableTextArray[i].y = (canvasHeight / 1.09);
            var regions = canvasWidth / movableTextArray.length;
            var middleOfRegion = regions / 2;
            var middleOffSet = movableTextArray[i].width / 2;
            movableTextArray[i].x = ((i + 1) * regions) - middleOfRegion - middleOffSet;
            movableTextArray[i].height = 20;
        }

    }

    function drawStaticText() {
        for (var i = 0; i < staticTextArray.length; i++) {
            if (i === 0 && majorPremiseMet) {
                context1.fillStyle = "#32CD32";
            } else if (i === 1 && minorPremiseMet) {
                context1.fillStyle = "#32CD32";
            } else if (i === 2 && minorPremiseMet && majorPremiseMet) {
                context1.fillStyle = "#32CD32";
            } else {
                context1.fillStyle = "#003300";
            }
            context1.font = font;
            staticTextArray[i].width = (context1.measureText(staticTextArray[i].text).width);
            staticTextArray[i].x = ((layer1.width / 2) - (staticTextArray[i].width / 2));
            staticTextArray[i].y = (i * (canvasHeight / 30) + (canvasHeight / 7.5));
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
        console.log(circlesNeeded);
        if (circlesNeeded === 3) {
            circlesArray.push(new Circle((canvasWidth / 2), (canvasHeight / 2.4), (canvasWidth / 6)));
            circlesArray.push(new Circle((canvasWidth / 2.4), (canvasHeight / 1.71), (canvasWidth / 6)));
            circlesArray.push(new Circle((canvasWidth / 1.71), (canvasHeight / 1.71), (canvasWidth / 6)));
        }
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