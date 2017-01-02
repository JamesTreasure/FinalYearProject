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
    var minorPremise;
    var particularSyllogism;
    var particularSyllogismArray = [];


    var GameState = function (movableTextArray, clickedInArray) {
        this.movableTextArray = movableTextArray;
        this.clickedInArray = clickedInArray;
    }
    var Click = function (circleClickedIn, x, y) {
        this.circleClickedIn = circleClickedIn;
        this.x = x;
        this.y = y;
    }
    var Circle = function (x, y, radius) {
        this.x = x; //Centre of the circle
        this.y = y; //Centre of the circle
        this.radius = radius;
    };

    var circlesArray = [];
    var undoStack = [];
    var redoStack = [];
    var staticTextArray = [];
    var movableTextArray = [];
    var clickedInArray = [];
    var moveText;

    $(window).mousedown(function (e) {
        var pos = getMousePos(layer1, e);
        var pos = getMousePos(layer1, e);

        var clickedOn = textClickedOn(pos.x, pos.y);
        if (clickedOn >= 0) {
            if (pos.x > 0 && pos.x < canvasWidth && pos.y > 0 && pos.y < 600) {
                console.log("pushed!");
                var clonedMovableTextArray = clone(movableTextArray);
                var clonedClickedInArray = clone(clickedInArray);
                undoStack.push(new GameState(clonedMovableTextArray, clonedClickedInArray));
            }
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
            checkIfSyllogismIsMet();
            checkIfAnyPropositionsAreMet();
        }
    });

    $(window).mousemove(function (e) {
        var pos = getMousePos(layer1, e);
        if (moveText) {
            if (drag) {
                movableTextArray[dragId].x = pos.x - dragOffsetX;
                movableTextArray[dragId].y = pos.y - dragOffsetY;
                checkIfSyllogismIsMet();
                checkIfAnyPropositionsAreMet();
                requestAnimationFrame(animate);
            }
        }
    });

    $(window).mouseup(function (e) {
        drag = false;
        moveText = false;
        dragId = -1;
    });

    $("#undoButton").click(function () {
        undo();
    });

    $("#redoButton").click(function () {
        redo();
    });

    function undo() {
        var clickedInArrayBeforePop = clone(clickedInArray);
        if (undoStack.length > 0) {
            redoStack.push(new GameState(movableTextArray, clickedInArray));
            var previousGameState = undoStack.pop();
            movableTextArray = previousGameState.movableTextArray;
            clickedInArray = previousGameState.clickedInArray;
            if (clickedInArray.length != clickedInArrayBeforePop.length) {
                undoRedoRepaintCheck(clickedInArrayBeforePop, clickedInArray);
            }
            drawMovableText();
            checkIfSyllogismIsMet();
            checkIfAnyPropositionsAreMet();
        }
    }

    function redo() {
        var clickedInArrayBeforePop = clone(clickedInArray);
        if (redoStack.length > 0) {
            undoStack.push(new GameState(movableTextArray, clickedInArray));
            var redoGameState = redoStack.pop();
            movableTextArray = redoGameState.movableTextArray;
            clickedInArray = redoGameState.clickedInArray;
            if (clickedInArray.length != clickedInArrayBeforePop.length) {
                undoRedoRepaintCheck(clickedInArrayBeforePop, clickedInArray);
            }
            drawMovableText();
            checkIfSyllogismIsMet();
            checkIfAnyPropositionsAreMet();
        }
    }

    function undoRedoRepaintCheck(before, after) {
        if (before.length > after.length) {
            var index;
            for (var i = 0; i < before.length; i++) {
                var tempBoolean = false;
                for (var j = 0; j < after.length; j++) {
                    if (before[i].circleClickedIn.equals(after[j].circleClickedIn)) {
                        tempBoolean = true;
                        break;
                    } else {
                        tempBoolean = false;
                    }
                }
                if (tempBoolean === false) {
                    index = i;
                    break;
                }
            }
            context1.fillStyle = "white";
            floodFill.fill(before[index].x, before[index].y, 100, context1, null, null, 90);
        }

        if (before.length < after.length) {
            var index;
            for (var i = 0; i < after.length; i++) {
                var tempBoolean = false;
                for (var j = 0; j < before.length; j++) {
                    if (after[i].circleClickedIn.equals(before[j].circleClickedIn)) {
                        tempBoolean = true;
                        break;
                    } else {
                        tempBoolean = false;
                    }
                }
                if (tempBoolean === false) {
                    index = i;
                    break;
                }
            }
            context1.fillStyle = "yellow"
            floodFill.fill(after[index].x, after[index].y, 100, context1, null, null, 90);
        }
    }

    function main(level) {

        setupLevel(level);
        context1.fillStyle = "white";
        context1.fillRect(0, 0, layer1.width, layer1.height);
        setupMovableText();
        drawStaticText();
        drawMovableText();
        createCircles();
        drawCircles();
    }

    function setupLevel(levelNumber) {
        $.ajaxSetup({
            async: false
        });

        $.getJSON("settings.json", function (json) {
            var level = json["level" + levelNumber];
            circlesNeeded = level.circlesNeeded;
            staticTextArray = level.staticTextArray;
            movableTextArray = level.movableTextArray;
            correctSyllogism = level.correctSyllogism;
            blankSyllogism = level.blankSyllogism;
            majorPremise = level.majorPremise;
            minorPremise = level.minorPremise;
            particularSyllogism = level.particularSyllogism;
        });

    }

    function tearDown() {
        context1.clearRect(0, 0, canvasWidth, canvasHeight);
        movableTextArray = [];
        staticTextArray = [];
        circlesArray = [];
        clickedInArray = [];
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

    function checkIfSyllogismIsMet() {
        //all of these are arrays
        var middle = whichCircleIsPremiseIn(movableTextArray[0]);
        var predicate = whichCircleIsPremiseIn(movableTextArray[1]);
        var subject = whichCircleIsPremiseIn(movableTextArray[2]);
        var particular;
        if(movableTextArray.length < 3){
            particular = whichCircleIsPremiseIn(movableTextArray[3]);
        }
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
            tearDown();
            main(2);
        }

    }

    function checkIfAnyPropositionsAreMet() {
        for (var key in majorPremise) {
            var valueInMajorPremise = majorPremise[key];
            var valueInBlankSyllogism = blankSyllogism[key];
            majorPremiseMet = valueInBlankSyllogism === valueInMajorPremise;
            if (!majorPremiseMet) {
                clearStaticText();
                redrawLayer1();
                break;
            }
        }
        if (minorPremiseMet) {
            clearStaticText();
            redrawLayer1();
        }


        for (var key in minorPremise) {
            var valueInMinorPremise = minorPremise[key];
            var valueInBlankSyllogism = blankSyllogism[key];
            minorPremiseMet = valueInBlankSyllogism === valueInMinorPremise;
            if (!minorPremiseMet) {
                clearStaticText();
                redrawLayer1();
                break;
            }
        }
        if (minorPremiseMet) {
            clearStaticText();
            redrawLayer1();
        }
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
            if (array1[i].circleClickedIn.equals(array2)) {
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

        if (x > 0 && x < canvasWidth && y > 0 && y < 600) {
            console.log("pushed!");
            var clonedMovableTextArray = clone(movableTextArray);
            var clonedClickedInArray = clone(clickedInArray);
            undoStack.push(new GameState(clonedMovableTextArray, clonedClickedInArray));
        }

        var hasBeenAlreadyClickedIn = false;
        var clickedInArrayLocation;
        if (clickedInArray.length > 0) {
            for (var i = 0; i < clickedInArray.length; i++) {
                if (clickedInArray[i].circleClickedIn.equals(tempArray)) {
                    hasBeenAlreadyClickedIn = true;
                    clickedInArrayLocation = i;
                }
            }
        }

        if (hasBeenAlreadyClickedIn === false) {
            tempArray.sort();
            clickedInArray.push(new Click(tempArray, x, y))
            // clickedInArray.push(tempArray);
            context1.fillStyle = "yellow";
            floodFill.fill(x, y, 100, context1, null, null, 90)
        } else {
            clickedInArray.splice(clickedInArrayLocation, 1);
            context1.fillStyle = "white";
            floodFill.fill(x, y, 100, context1, null, null, 90)

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

    function createCircles() {
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


    function clone(object) {
        if (object == null || typeof(object) != 'object') {
            return object;
        }
        var temp = new object.constructor();
        for (var key in object) {
            temp[key] = clone(object[key]);
        }
        return temp;
    }

    main(3);
})
;