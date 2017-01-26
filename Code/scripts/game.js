$(document).ready(function () {
    var layer1 = document.getElementById('layer1');
    var layer2 = document.getElementById('layer2');
    var layer3 = document.getElementById('layer3');
    var context1 = layer1.getContext('2d');
    var context2 = layer2.getContext('2d');
    var context3 = layer3.getContext('2d');
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
    var levelNumber = 2;
    var level;
    var levelComplete = false;
    var fadedAlphaLevel = 0.3;

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
    var clickedInArray = [];
    var moveText;

    $(window).mousedown(function (e) {
        var pos = getMousePos(layer1, e);
        var pos = getMousePos(layer1, e);
        if (!levelComplete) {
            var clickedOn = textClickedOn(pos.x, pos.y);
            if (clickedOn >= 0) {
                if (pos.x > 0 && pos.x < canvasWidth && pos.y > 0 && pos.y < 600) {
                    console.log("pushed!");
                    var clonedMovableTextArray = clone(movableTextArray);
                    var clonedClickedInArray = clone(clickedInArray);
                    undoStack.push(new GameState(clonedMovableTextArray, clonedClickedInArray));
                }
                moveText = true;
                var textX = level.movableTextArray[clickedOn].x;
                var textY = level.movableTextArray[clickedOn].y;
                dragId = clickedOn;
                dragOffsetX = pos.x - textX;
                dragOffsetY = pos.y - textY;
                drag = true;
            }
            if (!moveText) {
                if (level.type === "syllogism") {
                    whichCircleClickedIn(pos.x, pos.y);
                    checkIfSyllogismIsMet();
                    checkIfAnyPropositionsAreMet();
                }
                if (level.type === "venn") {
                    checkIfVennDiagramIsCorrect();
                }
            }
        }
    });

    $(window).mousemove(function (e) {
        var pos = getMousePos(layer1, e);
        checkButtons();
        if (moveText) {
            if (drag) {
                level.movableTextArray[dragId].x = pos.x - dragOffsetX;
                level.movableTextArray[dragId].y = pos.y - dragOffsetY;
                requestAnimationFrame(animate);
            }
        }
    });

    $(window).mouseup(function (e) {
        if (level.type === "venn") {
            checkIfVennDiagramIsCorrect();
        }
        if (level.type === "syllogism") {
            checkIfSyllogismIsMet();
            checkIfAnyPropositionsAreMet();
        }
        drag = false;
        moveText = false;
        dragId = -1;
    });

    $("#undoButton").click(function () {
        undo();
        if (level.type === "venn"){
            checkIfVennDiagramIsCorrect();
        }
    });

    $("#redoButton").click(function () {
        redo();
        if (level.type === "venn"){
            checkIfVennDiagramIsCorrect();
        }
    });

    $("#refreshButton").click(function () {
        tearDown();
        setupLevel(level.levelNumber);
        main(level.levelNumber);
    });

    $("#nextLevelButton").click(function () {
        tearDown();
        var currentLevel = level.levelNumber;
        var nextLevel = currentLevel + 1;
        setupLevel(nextLevel);
        main(nextLevel);
        $("#nextLevelButton").invisible();
    });

    function checkButtons(){
        if(undoStack.length < 1){
            $('#undoButton').prop('disabled', true);
            $("#undoButton").css('opacity', '0.3');
        }else{
            $('#undoButton').prop('disabled', false);
            $("#undoButton").css('opacity', '1');
        }
        if(redoStack.length < 1){
            $('#redoButton').prop('disabled', true);
            $("#redoButton").css('opacity', '0.3');
        }else{
            $('#redoButton').prop('disabled', false);
            $("#redoButton").css('opacity', '1');
        }
    }

    function levelCompleteScreen() {
        context1.clearRect(0, 0, canvasWidth, canvasHeight);
        drawCircles();
        drawStaticTextForVennDiagram();
        drawMovableText();
        var width = document.getElementById('nextLevelButton').offsetWidth;
        var x = canvasWidth/2 - (width/2);
        $("#nextLevelButton").css({left: x});
        $("#nextLevelButton").visible();
        context3.font = font;
        var text = "Level complete!"
        var textWidth = (context3.measureText(text).width);
        context3.fillText(text, ((canvasWidth / 2) - (textWidth / 2)), canvasHeight / 2);
    }

    function checkIfVennDiagramIsCorrect() {
        console.log("Checkinggg!");
        var tempCircle1 = [];
        var tempCircle2 = [];
        var tempIntersection = [];
        for (var i = 0; i < level.movableTextArray.length; i++) {
            var tempArray = whichCircleIsPremiseInReturnsAllCircles(level.movableTextArray[i]);
            if (tempArray) {
                if (tempArray[0] === 0 && tempArray.length === 1) {
                    tempCircle1.push(parseInt(level.movableTextArray[i].text));
                }
                if (tempArray[0] === 1 && tempArray.length === 1) {
                    tempCircle2.push(parseInt(level.movableTextArray[i].text));
                }
                if (tempArray.length === 2) {
                    tempIntersection.push(parseInt(level.movableTextArray[i].text));
                }
            }
        }


        if (tempCircle1.equals(level.circle1) && tempCircle2.equals(level.circle2) && tempIntersection.equals(level.intersection)) {
            if (!levelComplete) {
                levelComplete = true;
                levelCompleteScreen();
            }
            // tearDown();
            // levelNumber++;
            // main(levelNumber);
        }
    }

    function undo() {
        var clickedInArrayBeforePop = clone(clickedInArray);
        if(levelComplete){
            levelComplete = false;
            context1.clearRect(0, 0, canvasWidth, canvasHeight);
            drawCircles();
            context3.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        if (undoStack.length > 0) {
            redoStack.push(new GameState(level.movableTextArray, clickedInArray));
            var previousGameState = undoStack.pop();
            level.movableTextArray = previousGameState.movableTextArray;
            clickedInArray = previousGameState.clickedInArray;
            if (clickedInArray.length != clickedInArrayBeforePop.length) {
                undoRedoRepaintCheck(clickedInArrayBeforePop, clickedInArray);
            }
            drawMovableText(false);
            checkIfSyllogismIsMet();
            checkIfAnyPropositionsAreMet();
        }
    }

    function redo() {
        var clickedInArrayBeforePop = clone(clickedInArray);
        if (redoStack.length > 0) {
            undoStack.push(new GameState(level.movableTextArray, clickedInArray));
            var redoGameState = redoStack.pop();
            level.movableTextArray = redoGameState.movableTextArray;
            clickedInArray = redoGameState.clickedInArray;
            if (clickedInArray.length != clickedInArrayBeforePop.length) {
                undoRedoRepaintCheck(clickedInArrayBeforePop, clickedInArray);
            }
            drawMovableText(false);
            checkIfSyllogismIsMet();
            checkIfAnyPropositionsAreMet();
        }
    }

    function main(levelNumber) {
        setupLevel(levelNumber);
        context1.fillStyle = "white";
        context1.fillRect(0, 0, layer1.width, layer1.height);
        console.log(level);
        if (level.type === "venn") {
            setupMovableText();
            createCircles();
            drawCircles(false);
            drawMovableText();
            drawStaticTextForVennDiagram(false);
        }
        if (level.type === "syllogism") {
            setupMovableText();
            drawStaticText(false);
            drawMovableText();
            createCircles();
            drawCircles(false);
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

    function setupLevel(levelNumber) {
        $.ajaxSetup({
            async: false
        });

        $.getJSON("settings.json", function (json) {
            level = json["level" + levelNumber];
            movableTextArray = level.movableTextArray;
        });
    }

    function tearDown() {
        levelComplete = false;
        context1.clearRect(0, 0, canvasWidth, canvasHeight);
        context2.clearRect(0, 0, canvasWidth, canvasHeight);
        context3.clearRect(0, 0, canvasWidth, canvasHeight);
        circlesArray = [];
        clickedInArray = [];
    }

    function redrawLayer1() {
        if (level.type === "syllogism") {
            drawStaticText(false);
        }
        if (level.type === "venn") {
            drawStaticTextForVennDiagram(false);
        }
    }

    function clearStaticText() {
        for (var i = 0; i < level.staticTextArray.length; i++) {
            context1.clearRect(level.staticTextArray[i].x, level.staticTextArray[i].y - level.staticTextArray[i].height,
                level.staticTextArray[i].width, level.staticTextArray[i].height + (canvasHeight / 40));
        }
    }

    function checkIfSyllogismIsMet() {
        //all of these are arrays
        var middle = whichCircleIsPremiseIn(level.movableTextArray[0]);
        var predicate = whichCircleIsPremiseIn(level.movableTextArray[1]);
        var subject = whichCircleIsPremiseIn(level.movableTextArray[2]);
        var particular;
        if (level.movableTextArray.length > 3) {
            particular = whichCircleIsPremiseInReturnsAllCircles(level.movableTextArray[3]);
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

        level.blankSyllogism.subject = arrayContainsAnotherArray(clickedInArray, subject);
        level.blankSyllogism.middle = arrayContainsAnotherArray(clickedInArray, middle);
        level.blankSyllogism.predicate = arrayContainsAnotherArray(clickedInArray, predicate);
        level.blankSyllogism.middleSubjectIntersection = arrayContainsAnotherArray(clickedInArray, middleSubjectIntersection);
        level.blankSyllogism.middlePredicateIntersection = arrayContainsAnotherArray(clickedInArray, middlePredicateIntersection);
        level.blankSyllogism.middleSubjectPredicateIntersection = arrayContainsAnotherArray(clickedInArray, middleSubjectPredicateIntersection);
        level.blankSyllogism.subjectPredicateIntersection = arrayContainsAnotherArray(clickedInArray, subjectPredicateIntersection);


        var particularLocation;
        if (particular) {
            if (particular.equals(middle)) {
                particularLocation = "middle";
            }

            if (particular.equals(predicate)) {
                particularLocation = "predicate";
            }

            if (particular.equals(subject)) {
                particularLocation = "subject";
            }

            if (particular.equals(middleSubjectIntersection)) {
                particularLocation = "middleSubjectIntersection";
            }

            if (particular.equals(subjectPredicateIntersection)) {
                particularLocation = "subjectPredicateIntersection";
            }

            if (particular.equals(middlePredicateIntersection)) {
                particularLocation = "middlePredicateIntersection";
            }

            if (particular.equals(middleSubjectPredicateIntersection)) {
                particularLocation = "middleSubjectPredicateIntersection";
            }
        }

        if (level.particularSyllogism) {
            if (_.isEqual(level.blankSyllogism, level.correctSyllogism) && particularLocation === level.correctXPlacement) {
                tearDown();
                levelNumber++;
                main(levelNumber);
            }
        } else {
            if (_.isEqual(level.blankSyllogism, level.correctSyllogism)) {
                tearDown();
                levelNumber++;
                main(levelNumber);
            }
        }
    }

    function checkIfAnyPropositionsAreMet() {
        for (var key in level.majorPremise) {
            var valueInMajorPremise = level.majorPremise[key];
            var valueInBlankSyllogism = level.blankSyllogism[key];
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


        for (var key in level.minorPremise) {
            var valueInMinorPremise = level.minorPremise[key];
            var valueInBlankSyllogism = level.blankSyllogism[key];
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
        for (var i = 0; i < level.movableTextArray.length; i++) {
            level.movableTextArray[i].width = context2.measureText(level.movableTextArray[i].text).width;
            level.movableTextArray[i].y = (canvasHeight / 1.09);
            var regions = canvasWidth / level.movableTextArray.length;
            var middleOfRegion = regions / 2;
            var middleOffSet = level.movableTextArray[i].width / 2;
            level.movableTextArray[i].x = ((i + 1) * regions) - middleOfRegion - middleOffSet;
            level.movableTextArray[i].height = 20;
        }
    }

    function drawStaticText() {
        if (levelComplete) {
            context1.globalAlpha = fadedAlphaLevel;
        }
        for (var i = 0; i < level.staticTextArray.length; i++) {
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
            level.staticTextArray[i].width = (context1.measureText(level.staticTextArray[i].text).width);
            level.staticTextArray[i].x = ((layer1.width / 2) - (level.staticTextArray[i].width / 2));
            level.staticTextArray[i].y = (i * (canvasHeight / 30) + (canvasHeight / 7.5));
            level.staticTextArray[i].height = fontHeight;
            context1.fillText(level.staticTextArray[i].text, level.staticTextArray[i].x, level.staticTextArray[i].y);
        }
        context1.globalAlpha = 1;

    }

    function drawStaticTextForVennDiagram() {
        if (levelComplete) {
            context1.globalAlpha = fadedAlphaLevel;
        }
        for (var i = 0; i < level.staticTextArray.length; i++) {
            context1.font = font;
            context1.fillStyle = "#003300";
            level.staticTextArray[i].width = (context1.measureText(level.staticTextArray[i].text).width);
            // level.staticTextArray[i].x = ((layer1.width / 2) - (level.staticTextArray[i].width / 2));
            if (i === 0) {
                level.staticTextArray[i].x = (layer1.width / 2) - level.staticTextArray[i].width - (layer1.width / 25);
            }
            if (i === 1) {
                level.staticTextArray[i].x = (layer1.width / 2) + (layer1.width / 25);
                ;
            }
            level.staticTextArray[i].y = (canvasHeight / 2) - (canvasHeight / 5);
            level.staticTextArray[i].height = fontHeight;
            context1.fillText(level.staticTextArray[i].text, level.staticTextArray[i].x, level.staticTextArray[i].y);
        }
        context1.globalAlpha = 1;
    }

    function drawMovableText() {
        if (levelComplete) {
            context2.globalAlpha = fadedAlphaLevel;
        }
        context2.clearRect(0, 0, layer1.width, layer2.height)
        for (var i = 0; i < level.movableTextArray.length; i++) {
            context2.fillStyle = "#003300";
            context2.font = font;
            context2.fillText(level.movableTextArray[i].text, level.movableTextArray[i].x, level.movableTextArray[i].y);
        }
        context2.globalAlpha = 1;
    }

    function textClickedOn(x, y) {
        for (var i = 0; i < level.movableTextArray.length; i++) {
            var textWidth = context1.measureText(level.movableTextArray[i].text).width;
            if (x >= level.movableTextArray[i].x && x <= level.movableTextArray[i].x + textWidth && y >= (level.movableTextArray[i].y - 20) && y <= level.movableTextArray[i].y) {
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
            var clonedMovableTextArray = clone(level.movableTextArray);
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

    function whichCircleIsPremiseIn(premise) {
        var tempPremiseLocation = [];
        for (var i = 0; i < circlesArray.length; i++) {
            var dx = Math.max(circlesArray[i].x - premise.x, (premise.x + premise.width) - circlesArray[i].x);
            var dy = Math.max(circlesArray[i].y - premise.y, (premise.y + premise.height) - circlesArray[i].y);
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

    function whichCircleIsPremiseInReturnsAllCircles(rectangle) {
        var tempPremiseLocation = [];
        for (var i = 0; i < circlesArray.length; i++) {
            var dx = Math.max(circlesArray[i].x - rectangle.x, (rectangle.x + rectangle.width) - circlesArray[i].x);
            var dy = Math.max(circlesArray[i].y - rectangle.y, (rectangle.y + rectangle.height) - circlesArray[i].y);
            var inCircle = circlesArray[i].radius * circlesArray[i].radius >= dx * dx + dy * dy;
            if (inCircle) {
                tempPremiseLocation.push(i);
            }
        }
        if (tempPremiseLocation.length) {
            return tempPremiseLocation;
        } else {
            return null;
        }
    }

    function createCircles() {
        if (level.circlesNeeded == 2) {
            circlesArray.push(new Circle((canvasWidth / 2)-(canvasWidth/12), (canvasHeight / 2), (canvasWidth / 6)));
            circlesArray.push(new Circle((canvasWidth / 2)+(canvasWidth/12), (canvasHeight / 2), (canvasWidth / 6)));
        }
        if (level.circlesNeeded === 3) {
            circlesArray.push(new Circle((canvasWidth / 2), (canvasHeight / 2.4), (canvasWidth / 6)));
            circlesArray.push(new Circle((canvasWidth / 2.4), (canvasHeight / 1.71), (canvasWidth / 6)));
            circlesArray.push(new Circle((canvasWidth / 1.71), (canvasHeight / 1.71), (canvasWidth / 6)));
        }
    }

    function drawCircles() {
        if (levelComplete) {
            context1.globalAlpha = fadedAlphaLevel;
        }
        context1.beginPath();
        context1.lineWidth = 1;
        context1.strokeStyle = '#FF0000';
        context1.moveTo(canvasWidth/2,0);
        context1.lineTo(canvasWidth/2,canvasHeight);
        context1.stroke();
        context1.closePath();
        for (var i = 0; i < circlesArray.length; i++) {
            var circle = circlesArray[i];
            context1.beginPath();
            context1.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            context1.lineWidth = 5;
            context1.strokeStyle = '#FF0000';
            context1.stroke();
            context1.closePath();
        }
        context2.globalAlpha = 1;
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

    (function($) {
        $.fn.invisible = function() {
            return this.each(function() {
                $(this).css("visibility", "hidden");
            });
        };
        $.fn.visible = function() {
            return this.each(function() {
                $(this).css("visibility", "visible");
            });
        };
    }(jQuery));

    main(1);
})
;