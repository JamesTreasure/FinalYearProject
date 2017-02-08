$(document).ready(function () {
    var layer1 = document.getElementById('layer1');
    var layer2 = document.getElementById('layer2');
    var layer3 = document.getElementById('layer3');
    var circleBorder = document.getElementById('circleBorder');
    var tutorialCanvas = document.getElementById('tutorialCanvas');

    //Context 1 has undo, redo and refresh. Also has static text, circles.
    var context1 = layer1.getContext('2d');

    //Context 2 has movable text
    var context2 = layer2.getContext('2d');

    //Context 3 has win screen
    var context3 = layer3.getContext('2d');

    //Layer for the second circles
    var circleBorderContext = circleBorder.getContext('2d');

    //Layer for the tutorial
    var tutorialCanvas = tutorialCanvas.getContext('2d');

    var canvasWidth = layer1.width;
    var canvasHeight = layer1.height;
    var dragId;
    var dragOffsetX;
    var dragOffsetY;
    var drag = false;
    var font = '20pt Arial';
    var fontHeight = 20;
    var majorPremiseMet;
    var minorPremiseMet;
    var level;
    var levelComplete = false;
    var fadedAlphaLevel = 0.2;
    var tutorialMode = false;
    var tutorialStage = 0;

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
        if(tutorialMode && level.type === "venn") {
            tutorialStage++;
            vennDiagramTutorial();
            return;
        }else if(tutorialMode && level.type === "syllogism"){
            tutorialStage++;
            syllogismTutorial();
            return;
        }else{
            tutorialCanvas.clearRect(0,0,canvasWidth,canvasHeight);
        }


        if (!levelComplete) {
            var clickedOn = textClickedOn(pos.x, pos.y);
            if (clickedOn >= 0) {
                if (pos.x > 0 && pos.x < canvasWidth && pos.y > 0 && pos.y < 600) {
                    console.log("pushed!");
                    var clonedMovableTextArray = clone(level.movableTextArray);
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
        enableOrDisableUndoRedoButtons();
        if (moveText) {
            if (drag) {
                level.movableTextArray[dragId].x = pos.x - dragOffsetX;
                level.movableTextArray[dragId].y = pos.y - dragOffsetY;
                requestAnimationFrame(animate);
            }
        }
    });

    $(window).mouseup(function (e) {

        if(!tutorialMode){
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
        }
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
        $("#nextLevelButton").invisible();
    });

    $("#nextLevelButton").click(function () {
        tearDown();
        majorPremiseMet = false;
        minorPremiseMet = false;
        var currentLevel = level.levelNumber;
        var nextLevel = currentLevel + 1;
        if(nextLevel == 2){
            syllogismTutorial();
        }else{
            setupLevel(nextLevel);
            main(nextLevel);
        }
        $("#nextLevelButton").invisible();
    });

    function main(levelNumber) {
        setupLevel(levelNumber);
        context1.fillStyle = "white";
        context1.fillRect(0, 0, layer1.width, layer1.height);
        console.log(level);
        if (level.type === "venn") {
            setupMovableText();
            createCircles();
            drawCircles();
            drawMovableText();
            drawStaticTextForVennDiagram();
        }
        if (level.type === "syllogism") {
            setupMovableText();
            drawStaticText();
            drawMovableText();
            createCircles();
            drawCircles();
        }
    }

    function enableOrDisableUndoRedoButtons(){
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

    function clearAllCanvases(){
        context1.clearRect(0, 0, canvasWidth, canvasHeight);
        context2.clearRect(0, 0, canvasWidth, canvasHeight);
        context3.clearRect(0, 0, canvasWidth, canvasHeight);
        circleBorderContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvas.clearRect(0,0, canvasWidth, canvasHeight);
    }

    function levelCompleteScreen() {
        levelComplete = true;
        clearAllCanvases();
        drawCircles();
        if(level.type === "venn"){
            drawStaticTextForVennDiagram();
        }
        drawMovableText();

        //refill circles with faded black
        for (var i = 0; i < clickedInArray.length; i++) {
            context1.globalAlpha = fadedAlphaLevel;
            context1.fillStyle = "#1d1d1d";
            floodFill.fill(clickedInArray[i].x, clickedInArray[i].y, 100, context1, null, null, 90)
            context1.globalAlpha = 1;
        }

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
            drawMovableText();
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
            context1.fillStyle = "black"
            floodFill.fill(after[index].x, after[index].y, 100, context1, null, null, 90);
        }
    }

    function setupLevel(levelNumber) {
        $.ajaxSetup({
            async: false
        });

        $.getJSON("settings.json", function (json) {
            level = json["level" + levelNumber];
        });
    }

    function tearDown() {
        levelComplete = false;
        clearAllCanvases();
        circlesArray = [];
        clickedInArray = [];
        undoStack = [];
        redoStack = [];
    }

    function redrawLayer1() {
        if (level.type === "syllogism") {
            drawStaticText();
        }
        if (level.type === "venn") {
            drawStaticTextForVennDiagram();
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
                levelComplete = true;
                levelCompleteScreen();
            }
        } else {
            if (_.isEqual(level.blankSyllogism, level.correctSyllogism)) {
                levelComplete = true;
                levelCompleteScreen();
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
        if (majorPremiseMet) {
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
                context1.fillStyle = "#2ecc71";
            } else if (i === 1 && minorPremiseMet) {
                context1.fillStyle = "#2ecc71";
            } else if (i === 2 && minorPremiseMet && majorPremiseMet) {
                context1.fillStyle = "#2ecc71";
            } else {
                context1.fillStyle = "#003300";
            }
            context1.font = font;
            level.staticTextArray[i].width = (context1.measureText(level.staticTextArray[i].text).width);
            level.staticTextArray[i].x = ((layer1.width / 2) - (level.staticTextArray[i].width / 2));
            level.staticTextArray[i].y = (i * (canvasHeight / 30) + (canvasHeight/6.5));
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
            context1.fillStyle = "#1d1d1d";
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
            context2.fillStyle = "#3498db";
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
        console.log(color);
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
            // context1.fillStyle = "#252525";
            context1.fillStyle = "#1d1d1d";

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
            circleBorderContext.globalAlpha = fadedAlphaLevel;
        }
        for (var i = 0; i < circlesArray.length; i++) {
            var circle = circlesArray[i];
            context1.beginPath();
            context1.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            context1.lineWidth = 2;
            context1.strokeStyle = '#c0392b';
            context1.stroke();
            context1.closePath();
        }
        for (var i = 0; i < circlesArray.length; i++) {
            var circle = circlesArray[i];
            circleBorderContext.beginPath();
            circleBorderContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            circleBorderContext.lineWidth = 5;
            circleBorderContext.strokeStyle = '#c0392b';
            circleBorderContext.stroke();
            circleBorderContext.closePath();
        }
        context1.globalAlpha = 1;
        circleBorderContext.globalAlpha = 1;
    }

    function drawDashedArrow(context, fromx, fromy, tox, toy, strokeStyle){
        var headlen = 12;   // length of head in pixels
        var angle = Math.atan2(toy-fromy,tox-fromx);
        context.save();
        context.strokeStyle=strokeStyle || '#000'; // defaults to black
        // dashed part
        context.beginPath();
        context.setLineDash([10]);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.stroke();
        // second part -non dashed-
        context.beginPath();
        context.setLineDash([0]);
        context.moveTo(tox, toy);
        context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
        context.moveTo(tox, toy);
        context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
        context.stroke();
        //
        context.restore();          // this will, in fact, restore strokeStyle
    }

    function vennDiagramTutorial(){
        tutorialMode = true;
        $("#undoButton").invisible();
        $("#redoButton").invisible();
        $("#refreshButton").invisible();

        if(tutorialStage === 0){
            setupLevel(1);
            setupMovableText();
            createCircles();
            drawCircles();
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvas.font = font;
            var text = "A set is a collection of things";
            var textWidth = tutorialCanvas.measureText(text);
            tutorialCanvas.fillText(text, ((canvasWidth / 2) - (textWidth.width / 2)), canvasHeight/4);

        }

        if(tutorialStage === 1){
            drawStaticTextForVennDiagram();
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvas.font = font;
            tutorialCanvas.fillText("This is the set of even numbers",50,450);
            var circle = circlesArray[0];
            tutorialCanvas.beginPath();
            tutorialCanvas.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            tutorialCanvas.lineWidth = 2;
            tutorialCanvas.strokeStyle = '#c0392b';
            tutorialCanvas.fillStyle = '#c0392b';
            tutorialCanvas.fill();
            tutorialCanvas.stroke();
            tutorialCanvas.closePath();
            drawDashedArrow(tutorialCanvas,150,425,circlesArray[0].x-(canvasWidth/20), 300);

        }

        if(tutorialStage === 2){
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvas.font = font;
            tutorialCanvas.fillStyle = 'black';
            tutorialCanvas.fillText("This is the set of multiples of 5",250,450);
            var circle = circlesArray[1];
            tutorialCanvas.beginPath();
            tutorialCanvas.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            tutorialCanvas.lineWidth = 2;
            tutorialCanvas.strokeStyle = '#c0392b';
            tutorialCanvas.fillStyle = '#c0392b';
            tutorialCanvas.fill();
            tutorialCanvas.stroke();
            tutorialCanvas.closePath();
            drawDashedArrow(tutorialCanvas,450,425,circlesArray[1].x+(canvasWidth/20), 300);
        }

        if(tutorialStage === 3){
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            drawDashedArrow(tutorialCanvas,300,425,canvasWidth/2, 300);
            tutorialCanvas.font = font;
            tutorialCanvas.fillStyle = 'black';
            var text = "This is the set of even numbers and multiples of 5";
            var textWidth = (tutorialCanvas.measureText(text).width);
            tutorialCanvas.fillText(text,((canvasWidth / 2) - (textWidth / 2)),450);
            context1.fillStyle = "#c0392b";
            floodFill.fill(canvasWidth/2, canvasHeight/2, 100, context1, null, null, 90);
        }

        if(tutorialStage === 4){
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            drawMovableText();
            context1.fillStyle = "white";
            floodFill.fill(canvasWidth/2, canvasHeight/2, 100, context1, null, null, 90);
            tutorialCanvas.font = font;
            tutorialCanvas.fillStyle = 'black';
            var text = "Drag the numbers into the correct circles!";
            var textWidth = (tutorialCanvas.measureText(text).width);
            tutorialCanvas.fillText(text,((canvasWidth / 2) - (textWidth / 2)),450);
            tutorialMode = false;
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            tutorialStage = 0;
        }


    }

    function syllogismTutorial(){
        tutorialMode = true;
        $("#undoButton").invisible();
        $("#redoButton").invisible();
        $("#refreshButton").invisible();

        if(tutorialStage === 0){
            setupLevel(2);
            setupMovableText();
            createCircles();
            drawCircles();
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvas.font = font;
            var text = "Now we have three sets";
            var textWidth = tutorialCanvas.measureText(text);
            tutorialCanvas.fillText(text, 50, 100);
            drawDashedArrow(tutorialCanvas,50+(textWidth.width/2),110,circlesArray[0].x+20, circlesArray[0].y-20);
            drawDashedArrow(tutorialCanvas,50+(textWidth.width/2),110,circlesArray[1].x-20, circlesArray[1].y+20);
            drawDashedArrow(tutorialCanvas,50+(textWidth.width/2),110,circlesArray[2].x+20, circlesArray[2].y+20);
        }

        if(tutorialStage === 1){
            tearDown();
            setupMovableText();
            createCircles();
            drawCircles();
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvas.font = font;
            var text1 = "Clicking in a segment of the circle will fill it in.";
            var text2 = "This represents the empty set.";
            var textWidth = tutorialCanvas.measureText(text);
            tutorialCanvas.fillText(text1, 50, 100);
            tutorialCanvas.fillText(text2, 50, 125);
            context1.fillStyle = "#1d1d1d";
            floodFill.fill(circlesArray[0].x, circlesArray[0].y-20, 100, context1, null, null, 90);
        }

        if(tutorialStage === 1){
            tearDown();
            setupMovableText();
            createCircles();
            drawCircles();
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvas.font = font;
            var text1 = "Clicking in a segment of the circle will fill it in";
            var text2 = "This represents the empty set";
            var textWidth = tutorialCanvas.measureText(text);
            tutorialCanvas.fillText(text1, 50, 100);
            tutorialCanvas.fillText(text2, 50, 125);
            context1.fillStyle = "#1d1d1d";
            floodFill.fill(circlesArray[0].x, circlesArray[0].y-20, 100, context1, null, null, 90);
        }

        if(tutorialStage === 2){
            tearDown();
            setupMovableText();
            createCircles();
            drawCircles();
            drawStaticText();
            drawMovableText();
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            var text1 = "Drag the words below into the circles";
            tutorialCanvas.fillText(text1, 50, 500);
            tutorialCanvas.font = font;

        }

        if(tutorialStage === 3){
            tearDown();
            setupMovableText();
            createCircles();
            drawCircles();
            drawStaticText();
            drawMovableText();
            tutorialCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
            var text1 = "Fill in sections of the circle to complete the syllogism";
            tutorialCanvas.fillText(text1, 10, 500);
            tutorialCanvas.font = font;
            tutorialMode = false;
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
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

    vennDiagramTutorial();
})
;