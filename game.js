$(document).ready(function () {
    var layer1 = document.getElementById('layer1');
    var layer2 = document.getElementById('layer2');
    var layer3 = document.getElementById('layer3');
    var layer4 = document.getElementById('layer4');
    var circleBorder = document.getElementById('circleBorder');
    var tutorialCanvas = document.getElementById('tutorialCanvas');
    var circleOutlineCanvas = document.getElementById('circleOutlineCanvas');

    //Context 1 has undo, redo and refresh. Also has static text, circles.
    var context1 = layer1.getContext('2d');

    //Context 2 has movable text
    var context2 = layer2.getContext('2d');

    //Context 3 has win screen
    var context3 = layer3.getContext('2d');

    var context4 = layer4.getContext('2d');

    //Layer for the second circles
    var circleBorderContext = circleBorder.getContext('2d');

    //Layer for the tutorial
    var tutorialCanvasContext = tutorialCanvas.getContext('2d');

    var circleOutlineContext = circleOutlineCanvas.getContext('2d');

    window.addEventListener('resize', resizeCanvas, false);
    var canvasWidth;
    var canvasHeight;
    var dragId;
    var dragOffsetX;
    var dragOffsetY;
    var drag = false;
    var majorPremiseMet;
    var minorPremiseMet;
    var level;
    var levelComplete = false;
    var fadedAlphaLevel = 0.2;
    var tutorialMode = false;
    var tutorialStage = 0;
    var currentFontSize;
    var setTheoryCurrentStage = 0;
    var font;
    var setTheoryColours = ["#3498db", "#2ecc71", "#f1c40f"];

    var GameState = function (movableTextArray, clickedInArray) {
        this.movableTextArray = movableTextArray;
        this.clickedInArray = clickedInArray;
    };
    var Click = function (circleClickedIn, x, y) {
        this.circleClickedIn = circleClickedIn;
        this.x = x;
        this.y = y;
    };
    var Circle = function (x, y, radius) {
        this.x = x; //Centre of the circle
        this.y = y; //Centre of the circle
        this.radius = radius;
    };

    var circlesArray = [];
    var undoStack = [];
    var redoStack = [];
    var clickedInArray = [];
    var isTextMovable = true;

    function renderText() {
        tutorialCanvasContext.font = font;
        var text = "A set is a collection of things";
        var textWidth = tutorialCanvasContext.measureText(text);
        tutorialCanvasContext.fillText(text, ((canvasWidth / 2) - (textWidth.width / 2)), canvasHeight / 4);
    }

    document.fonts.load('18pt "comicNeue"').then(renderText);

    function resizeCanvas() {
        layer1.width = window.innerWidth;
        layer1.height = window.innerHeight;

        layer2.height = window.innerHeight;
        layer2.width = window.innerWidth;

        layer3.height = window.innerHeight;
        layer3.width = window.innerWidth;

        circleBorder.height = window.innerHeight;
        circleBorder.width = window.innerWidth;

        tutorialCanvas.height = window.innerHeight;
        tutorialCanvas.width = window.innerWidth;

        circleOutlineCanvas.height = window.innerHeight;
        circleOutlineCanvas.width = window.innerWidth;

        canvasWidth = layer1.width;
        canvasHeight = layer1.height;
        font = getFont();
    }

    // window.addEventListener("resize", resizeCanvas);

    $(window).mousedown(function (e) {
        var pos = getMousePos(layer1, e);

        if (!levelComplete && !tutorialMode) {
            var clickedOn = textClickedOn(pos.x, pos.y);
            if (clickedOn >= 0) {
                if (level.type != "setTheory") {
                    tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
                    tutorialStage = 0;
                }
                $("#tutorialBackwards").invisible();
                $("#tutorialForwards").invisible();
                if (pos.x > 0 && pos.x < canvasWidth && pos.y > 0 && pos.y < canvasHeight) {
                    var clonedMovableTextArray = clone(level.movableTextArray);
                    var clonedClickedInArray = clone(clickedInArray);
                    undoStack.push(new GameState(clonedMovableTextArray, clonedClickedInArray));
                }
                var textX = level.movableTextArray[clickedOn].x;
                var textY = level.movableTextArray[clickedOn].y;
                dragId = clickedOn;
                dragOffsetX = pos.x - textX;
                dragOffsetY = pos.y - textY;
                drag = true;
            }
            if (!drag) {
                if (level.type === "syllogism") {
                    whichCircleClickedIn(pos.x, pos.y);
                    checkIfSyllogismIsMet();
                    checkIfAnyPropositionsAreMet();
                }
                if (level.type === "venn") {
                    checkIfVennDiagramIsCorrect();
                }
                if (level.type === "setTheory") {
                    whichCircleClickedIn(pos.x, pos.y);
                    checkIfSetTheoryIsMet(level.correctPlacement[setTheoryCurrentStage]);
                }
                if (level.type === "emptySet"){
                    whichCircleClickedIn(pos.x, pos.y);
                    checkIfEmptySetIsCorrect();
                }
            }
        }
    });

    $(window).mousemove($.throttle(10, function (e) {
        var pos = getMousePos(layer1, e);
        enableOrDisableUndoRedoButtons();
        if (isTextMovable) {
            if (drag) {
                level.movableTextArray[dragId].x = pos.x - dragOffsetX;
                level.movableTextArray[dragId].y = pos.y - dragOffsetY;
                requestAnimationFrame(animate);
            }
        }
    }));

    $(window).mouseup(function () {

        if (!tutorialMode) {
            if (level.type === "venn") {
                checkIfVennDiagramIsCorrect();
            }
            if (level.type === "syllogism") {
                checkIfSyllogismIsMet();
                checkIfAnyPropositionsAreMet();
            }
            if (level.type === "setTheory") {
                checkIfSetTheoryIsMet(level.correctPlacement[setTheoryCurrentStage]);
            }
            if (level.type === "emptySet"){
                checkIfEmptySetIsCorrect();
            }
            if (drag) {
                circleOutlineContext.clearRect(0, 0, canvasWidth, canvasHeight);

            }
            drag = false;
            dragId = -1;
        }
    });

    $("#tutorialForwards").click(function () {
        if (level.type === "venn") {
            tutorialStage++;
            vennDiagramTutorial();
            return;
        }
        if (level.type === "syllogism" && level.particularSyllogism === false) {
            tutorialStage++;
            syllogismTutorial();
        } else if (level.type === "syllogism" && level.particularSyllogism) {
            tutorialStage++;
            someXTutorial();
        }
        if (level.type === "unionIntersectionTutorial") {
            if (!tutorialMode) {
                $("#tutorialForwards").invisible();
                $("#tutorialBackwards").invisible();
                tearDown();
                tutorialStage = 0;
                setTheoryTutorial();
            } else {
                tutorialStage++;
                unionIntersectionTutorial();
            }
        }
        if (level.type === "setTheory") {
            tutorialStage++;
            setTheoryTutorial();
            return;
        }
        if (level.type === "emptySet"){
            tutorialStage++;
            emptySetTutorial();
            return;
        }
    });

    $("#tutorialBackwards").click(function () {
        if (level.type === "venn") {
            tutorialStage--;
            vennDiagramTutorial();
            return;
        }
        if (level.type === "syllogism" && level.particularSyllogism === false) {
            tutorialStage--;
            syllogismTutorial();
        } else if (level.type === "syllogism" && level.particularSyllogism) {
            tutorialStage--;
            someXTutorial();
        }
        if (level.type === "setTheory") {
            tutorialStage++;
            unionIntersectionTutorial();
        }
        if (level.type === "emptySet"){
            tutorialStage--;
            emptySetTutorial();
            return;
        }
    });

    $("#undoButton").click(function () {
        undo();
        $("#nextLevelButton").invisible();
        if (level.type === "venn") {
            checkIfVennDiagramIsCorrect();
        }
    });

    $("#redoButton").click(function () {
        redo();
        if (level.type === "venn") {
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
        if (nextLevel == 3) {
            syllogismTutorial();
        } else if (nextLevel == 4) {
            someXTutorial();
        } else if (nextLevel === 5) {
            unionIntersectionTutorial();
        } else {
            tearDown();
            setupLevel(nextLevel);
            main(nextLevel);
        }
        $("#nextLevelButton").invisible();
    });

    $("#tutorial").click(function () {
        if (level.type === "venn") {
            vennDiagramTutorial()
        }
        if (level.type === "syllogism") {
            syllogismTutorial();
        }
        if (level.type === "setTheory") {
            tutorialStage = 0;
            setTheoryTutorial();
        }
    });

    $("#skipLevel").click(function () {
        tutorialMode = false;
        tearDown();
        majorPremiseMet = false;
        minorPremiseMet = false;
        var currentLevel = level.levelNumber;
        var nextLevel = currentLevel + 1;
        if (nextLevel == 2) {
            syllogismTutorial();
        } else {
            setupLevel(nextLevel);
            main(nextLevel);
        }
        $("#nextLevelButton").invisible();
    });

    function main(levelNumber) {
        setupLevel(levelNumber);
        context1.fillStyle = "white";
        context1.fillRect(0, 0, layer1.width, layer1.height);
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
        if (level.type === "setTheory") {
            setupMovableText();
            drawStaticText();
            drawMovableText();
            createCircles();
            drawCircles();
        }
    }

    function enableOrDisableUndoRedoButtons() {
        if (undoStack.length < 1) {
            $('#undoButton').prop('disabled', true).css('opacity', '0.3');
        } else {
            $('#undoButton').prop('disabled', false).css('opacity', '1');
        }
        if (redoStack.length < 1) {
            $('#redoButton').prop('disabled', true).css('opacity', '0.3');
        } else {
            $('#redoButton').prop('disabled', false).css('opacity', '1');
        }
    }

    function clearAllCanvases() {
        context1.clearRect(0, 0, canvasWidth, canvasHeight);
        context2.clearRect(0, 0, canvasWidth, canvasHeight);
        context3.clearRect(0, 0, canvasWidth, canvasHeight);
        circleBorderContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    function levelCompleteScreen() {
        levelComplete = true;
        clearAllCanvases();
        drawCircles();
        if (level.type === "venn") {
            drawStaticTextForVennDiagram();
        }
        drawMovableText();

        //refill circles with faded black
        for (var i = 0; i < clickedInArray.length; i++) {
            context1.globalAlpha = fadedAlphaLevel;
            context1.fillStyle = "#1d1d1d";
            floodFill.fill(clickedInArray[i].x, clickedInArray[i].y, 100, context1, null, null, 90);
            context1.globalAlpha = 1;
        }

        var width = document.getElementById('nextLevelButton').offsetWidth;
        var x = canvasWidth / 2 - (width / 2);
        $("#nextLevelButton").css({left: x}).visible();
        context3.font = font;
        var text = "Level complete!";
        var textWidth = (context3.measureText(text).width);
        context3.fillText(text, ((canvasWidth / 2) - (textWidth / 2)), canvasHeight / 2);
    }

    function gameCompleteScreen() {
        levelComplete = true;
        clearAllCanvases();
        drawCircles();
        if (level.type === "venn") {
            drawStaticTextForVennDiagram();
        }
        drawMovableText();

        //refill circles with faded black
        for (var i = 0; i < clickedInArray.length; i++) {
            context1.globalAlpha = fadedAlphaLevel;
            context1.fillStyle = "#1d1d1d";
            floodFill.fill(clickedInArray[i].x, clickedInArray[i].y, 100, context1, null, null, 90);
            context1.globalAlpha = 1;
        }

        $("#nextLevelButton").invisible();
        context3.font = font;
        var text = "Game complete!";
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

    function checkIfEmptySetIsCorrect() {
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

        var correctEmptyLocation = false;
        if(clickedInArray.length > 0){
            correctEmptyLocation = (clickedInArray[0].circleClickedIn.equals([0,1]) && clickedInArray.length === 1);
        }

        if (tempCircle1.equals(level.circle1) && tempCircle2.equals(level.circle2) && tempIntersection.equals(level.intersection) && correctEmptyLocation) {
            if (!levelComplete) {
                levelComplete = true;
                levelCompleteScreen();
            }
        }
    }

    function undo() {
        var clickedInArrayBeforePop = clone(clickedInArray);
        if (levelComplete) {
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
            context1.fillStyle = "black";
            floodFill.fill(after[index].x, after[index].y, 100, context1, null, null, 90);
        }
    }

    function setupLevel(levelNumber) {
        $.ajaxSetup({
            async: false
        });

        $.getJSON("minimallevels.json", function (json) {
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
        if (level.type === "syllogism" || level.type === "setTheory") {
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
        } else if (level.type === "syllogism") {
            if (_.isEqual(level.blankSyllogism, level.correctSyllogism)) {
                levelComplete = true;
                levelCompleteScreen();
            }
        }
    }

    function checkIfSetTheoryIsMet(correctSyllogism) {
        //all of these are arrays
        var a = whichCircleIsPremiseIn(level.movableTextArray[0]);
        var b = whichCircleIsPremiseIn(level.movableTextArray[1]);
        var c = whichCircleIsPremiseIn(level.movableTextArray[2]);
        var particular;
        if (level.movableTextArray.length > 3) {
            particular = whichCircleIsPremiseInReturnsAllCircles(level.movableTextArray[3]);
        }


        var acIntersection;
        var cbIntersection;
        var abIntersection;
        var acbIntersection;

        if (c !== null && b !== null && a !== null) {
            acIntersection = [c[0], a[0]].sort();
            cbIntersection = [c[0], b[0]].sort();
            abIntersection = [a[0], b[0]].sort();
            acbIntersection = [a[0], c[0], b[0]].sort();
        }

        level.blankSyllogism.c = arrayContainsAnotherArray(clickedInArray, c);
        level.blankSyllogism.a = arrayContainsAnotherArray(clickedInArray, a);
        level.blankSyllogism.b = arrayContainsAnotherArray(clickedInArray, b);
        level.blankSyllogism.acIntersection = arrayContainsAnotherArray(clickedInArray, acIntersection);
        level.blankSyllogism.abIntersection = arrayContainsAnotherArray(clickedInArray, abIntersection);
        level.blankSyllogism.acbIntersection = arrayContainsAnotherArray(clickedInArray, acbIntersection);
        level.blankSyllogism.cbIntersection = arrayContainsAnotherArray(clickedInArray, cbIntersection);


        var particularLocation;
        if (particular) {
            if (particular.equals(a)) {
                particularLocation = "a";
            }

            if (particular.equals(b)) {
                particularLocation = "b";
            }

            if (particular.equals(c)) {
                particularLocation = "c";
            }

            if (particular.equals(acIntersection)) {
                particularLocation = "acIntersection";
            }

            if (particular.equals(cbIntersection)) {
                particularLocation = "cbIntersection";
            }

            if (particular.equals(abIntersection)) {
                particularLocation = "abIntersection";
            }

            if (particular.equals(acbIntersection)) {
                particularLocation = "acbIntersection";
            }
        }

        if (_.isEqual(level.blankSyllogism, correctSyllogism)) {
            isTextMovable = false;
            if (setTheoryCurrentStage < level.correctPlacement.length - 1) {
                setTheoryCurrentStage++;
                var tempClickedInArray = clone(clickedInArray);
                clickedInArray = [];
                clearAllCanvases();
                drawStaticText();
                drawMovableText();
                drawCircles();
                for (var i = 0; i < tempClickedInArray.length; i++) {
                    context1.globalAlpha = 0.5;
                    context1.fillStyle = setTheoryColours[setTheoryCurrentStage - 1];
                    floodFill.fill(tempClickedInArray[i].x, tempClickedInArray[i].y, 100, context1, null, null, 90);
                    context1.globalAlpha = 1;

                }
                tutorialStage++;
                tutorialMode = true;
                setTheoryTutorial();
            } else {
                levelCompleteScreen();
                gameCompleteScreen();
                requestAnimationFrame(drawConfetti);
                // setTimeout(drawConfetti, 20);
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

        if (dragId === 3) {
            return;
        }

        if (level.type === "syllogism" || level.type === "setTheory") {
            var circlePremiseIsIn = whichCircleIsPremiseIn(level.movableTextArray[dragId]);

            for (var i = 0; i < level.movableTextArray.length; i++) {
                if (i != dragId) {
                    var c = whichCircleIsPremiseIn(level.movableTextArray[i]);
                    if (c != null && circlePremiseIsIn != null) {
                        if (c.equals(circlePremiseIsIn)) {
                            return;
                        }
                    }
                }
            }

            if (circlePremiseIsIn) {
                circleOutlineContext.clearRect(0, 0, canvasWidth, canvasHeight);
                var circle = circlesArray[circlePremiseIsIn[0]];
                circleOutlineContext.beginPath();
                circleOutlineContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
                circleOutlineContext.lineWidth = 5;
                circleOutlineContext.strokeStyle = '#2ecc71';
                circleOutlineContext.stroke();
                circleOutlineContext.closePath();
            } else {
                circleOutlineContext.clearRect(0, 0, canvasWidth, canvasHeight);
            }
        }
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

            context1.font = getFont();
            level.staticTextArray[i].width = (context1.measureText(level.staticTextArray[i].text).width);
            level.staticTextArray[i].x = ((layer1.width / 2) - (level.staticTextArray[i].width / 2));
            level.staticTextArray[i].y = (i * (canvasHeight / 30) + (canvasHeight / 6.5));
            level.staticTextArray[i].height = currentFontSize;

            if (i == level.staticTextArray.length - 1) {
                level.staticTextArray[i].y += (currentFontSize / 2);
            }

            drawLineBetween();

            context1.fillText(level.staticTextArray[i].text, level.staticTextArray[i].x, level.staticTextArray[i].y);
        }
        context1.globalAlpha = 1;
    }

    function drawLineBetween() {
        if (!(level.type === "setTheory")) {
            var biggestLineWidthIndex = 0;
            var biggestLineWidth = 0;
            for (var i = 0; i < level.staticTextArray.length; i++) {
                var lineWidth = level.staticTextArray[i].width;
                var x = level.staticTextArray[i].x;
                if (lineWidth > biggestLineWidth) {
                    biggestLineWidth = lineWidth;
                    biggestLineWidthIndex = i;
                }
            }

            var y = ((level.staticTextArray[1].y + level.staticTextArray[2].y) / 2) - currentFontSize / 2;

            context1.beginPath();
            context1.strokeStyle = 'black';
            context1.moveTo(level.staticTextArray[biggestLineWidthIndex].x, y);
            context1.lineTo(level.staticTextArray[biggestLineWidthIndex].x + level.staticTextArray[biggestLineWidthIndex].width, y);
            context1.stroke();
        }
    }

    function drawStaticTextForVennDiagram(staticTextArray) {
        if (levelComplete) {
            context1.globalAlpha = fadedAlphaLevel;
        }
        for (var i = 0; i < staticTextArray.length; i++) {
            context1.font = font;
            context1.fillStyle = "#1d1d1d";
            staticTextArray[i].width = (context1.measureText(staticTextArray[i].text).width);
            // level.staticTextArray[i].x = ((layer1.width / 2) - (level.staticTextArray[i].width / 2));
            if (i === 0) {
                staticTextArray[i].x = (layer1.width / 2) - staticTextArray[i].width - (layer1.width / 25);
            }
            if (i === 1) {
                staticTextArray[i].x = (layer1.width / 2) + (layer1.width / 25);
            }
            staticTextArray[i].y = (canvasHeight / 2) - (canvasHeight / 5);
            staticTextArray[i].height = currentFontSize;
            context1.fillText(staticTextArray[i].text, staticTextArray[i].x, staticTextArray[i].y);
        }
        context1.globalAlpha = 1;
    }

    function drawMovableText() {
        if (levelComplete) {
            context2.globalAlpha = fadedAlphaLevel;
        }
        context2.clearRect(0, 0, layer1.width, layer2.height);
        for (var i = 0; i < level.movableTextArray.length; i++) {
            context2.fillStyle = "#3498db";
            if (level.type === "setTheory") {
                context2.fillStyle = "#2c3e50";
            }
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

        var tempArray = [];
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

            if (level.type === "setTheory") {
                context1.fillStyle = setTheoryColours[setTheoryCurrentStage];
                context1.globalAlpha = 0.7;
                floodFill.fill(x, y, 100, context1, null, null, 90)
                context1.globalAlpha = 1;
            } else {
                context1.fillStyle = "#1d1d1d";
                floodFill.fill(x, y, 100, context1, null, null, 90)
            }
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
            var maxHeight = canvasHeight / 3;
            var radius = maxHeight / 2;
            var overlap = radius / 2;
            circlesArray.push(new Circle((canvasWidth / 2) - (overlap), (canvasHeight / 2), radius));
            circlesArray.push(new Circle((canvasWidth / 2) + (overlap), (canvasHeight / 2), radius));
        }
        else if (level.circlesNeeded === 3) {
            var segments = canvasHeight / 4;
            var radius = segments / 2 * 1.25;
            var overlap = radius / 2;
            circlesArray.push(new Circle((canvasWidth / 2), (segments + (segments * 2)) / 2 + (segments / 6), radius));
            circlesArray.push(new Circle((canvasWidth / 2) - overlap, (segments * 2 + (segments * 3)) / 2 - (segments / 6), radius));
            circlesArray.push(new Circle((canvasWidth / 2) + overlap, (segments * 2 + (segments * 3)) / 2 - (segments / 6), radius));

        } else {
            var maxHeight = canvasHeight / 3;
            var radius = maxHeight / 2;
            var overlap = radius / 2;
            circlesArray.push(new Circle((canvasWidth / 2) - (overlap), (canvasHeight / 2), radius));
            circlesArray.push(new Circle((canvasWidth / 2) + (overlap), (canvasHeight / 2), radius));
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

    function vennDiagramTutorial() {
        tutorialMode = true;
        $("#undoButton").invisible();
        $("#redoButton").invisible();
        $("#refreshButton").invisible();
        $("#tutorial").invisible();


        if (tutorialStage === 0) {
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").visible();
            tearDown();
            setupLevel(1);
            setupMovableText();
            createCircles();
            drawCircles();

            // var segment = canvasWidth/6;
            // for (var i = 1; i < 6; i++) {
            //     context1.beginPath();
            //     context1.moveTo(segment*i,0);
            //     context1.lineTo(segment*i,canvasHeight);
            //     context1.stroke();
            // }

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = font;
            tutorialCanvasContext.fillStyle = 'black';
        }

        if (tutorialStage === 1) {
            $("#tutorialBackwards").visible();
            $("#tutorialForwards").visible();
            drawStaticTextForVennDiagram(level.staticTextArray);
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = font;
            tutorialCanvasContext.fillStyle = 'black';
            var text = "This is the set of even numbers";
            var textWidth = (tutorialCanvasContext.measureText(text).width);
            var textX = circlesArray[0].x - circlesArray[0].radius - (textWidth / 2);
            var textY = (canvasHeight / 3) * 2 + (canvasHeight / 3 / 2);
            tutorialCanvasContext.fillText(text, textX, textY);


            var circle = circlesArray[0];
            tutorialCanvasContext.beginPath();
            tutorialCanvasContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            tutorialCanvasContext.lineWidth = 2;
            tutorialCanvasContext.strokeStyle = '#c0392b';
            tutorialCanvasContext.fillStyle = '#c0392b';
            tutorialCanvasContext.fill();
            tutorialCanvasContext.stroke();
            tutorialCanvasContext.closePath();

            var startX = textX + (textWidth / 2);
            var startY = textY - currentFontSize - 5;

            var endpointX = circlesArray[0].x;
            var endpointY = circlesArray[0].y + circlesArray[0].radius;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
        }

        if (tutorialStage === 2) {
            $("#tutorialForwards").visible();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = font;
            tutorialCanvasContext.fillStyle = 'black';

            var text = "This is the set of multiples of 5";
            var textWidth = (tutorialCanvasContext.measureText(text).width);
            var textX = circlesArray[1].x + circlesArray[1].radius - (textWidth / 2);
            var textY = (canvasHeight / 3) * 2 + (canvasHeight / 3 / 2);
            tutorialCanvasContext.fillText(text, textX, textY);

            var circle = circlesArray[1];
            tutorialCanvasContext.beginPath();
            tutorialCanvasContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            tutorialCanvasContext.lineWidth = 2;
            tutorialCanvasContext.strokeStyle = '#c0392b';
            tutorialCanvasContext.fillStyle = '#c0392b';
            tutorialCanvasContext.fill();
            tutorialCanvasContext.stroke();
            tutorialCanvasContext.closePath();

            var startX = textX + (textWidth / 2);
            var startY = textY - currentFontSize - 5;

            var endpointX = circlesArray[1].x;
            var endpointY = circlesArray[1].y + circlesArray[0].radius;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = (startY + endpointY) / 2;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY + 40);
        }

        if (tutorialStage === 3) {
            $("#tutorialForwards").visible();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = font;
            tutorialCanvasContext.fillStyle = 'black';
            var text = "This is the set of even numbers and multiples of 5";
            var textWidth = (tutorialCanvasContext.measureText(text).width);
            var textX = ((canvasWidth / 2) - (textWidth / 2));
            var textY = (canvasHeight / 3) * 2 + (canvasHeight / 3 / 2);
            tutorialCanvasContext.fillText(text, textX, textY);


            context1.fillStyle = "#c0392b";
            floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);

            var startX = textX + (textWidth / 2);
            var startY = textY - currentFontSize - 5;

            var endpointX = canvasWidth / 2;
            var endpointY = canvasHeight / 2;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = (startY + endpointY) / 2;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY + 40);
        }

        if (tutorialStage === 4) {
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            drawMovableText();
            context1.fillStyle = "white";
            floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);
            tutorialCanvasContext.font = font;

            var segment = canvasWidth / 6;

            var text = "Drag the numbers below into the correct circles to complete the level";


            var textWidth = (tutorialCanvasContext.measureText(text).width);
            var maxWidth = segment;
            var textX = segment;
            var textY = (circlesArray[0].y + (circlesArray[0].radius / 2));


            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);


            var startX = textX + (maxWidth / 2);
            var startY = lastY + currentFontSize;

            var endpointX = canvasWidth / 3;
            var endpointY = (canvasHeight / 3 * 2) + canvasHeight / 3 / 2;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);


            tutorialMode = false;
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            $("#tutorial").visible();
            $("#tutorialForwards").invisible();
        }


    }

    function syllogismTutorial() {
        tutorialMode = true;
        $("#undoButton").invisible();
        $("#redoButton").invisible();
        $("#refreshButton").invisible();
        $("#tutorial").invisible();

        if (tutorialStage === 0) {
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").visible();
            tearDown();
            setupLevel(3);
            createCircles();
            drawStaticText();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            var text2 = "These three lines are what makes up a syllogism";
            var maxWidth = canvasWidth / 6;
            var textWidth = tutorialCanvasContext.measureText(text2).width;
            var text2X = circlesArray[2].x + circlesArray[2].radius;
            var text2Y = (canvasHeight / 4 + (canvasHeight / 8));
            var last2Y = wrapText(tutorialCanvasContext, text2, text2X, text2Y, maxWidth, currentFontSize);

            var start2X = text2X + (maxWidth / 2);
            var start2Y = text2Y - currentFontSize;

            var endpoint2X = level.staticTextArray[1].x + level.staticTextArray[1].width + (canvasWidth / 60);
            var endpoint2Y = level.staticTextArray[1].y;

            var midpoint2X = (start2X + endpoint2X) / 2;
            var midpoint2Y = ((start2Y + endpoint2Y) / 2) - canvasHeight / 24;

            drawCurvedArrow(start2X, start2Y, endpoint2X, endpoint2Y, midpoint2X, midpoint2Y);
            tutorialCanvasContext.fillText(text, textX, textY);

        }

        if (tutorialStage === 1) {
            $("#tutorialForwards").visible();
            tearDown();
            setupLevel(3);
            createCircles();
            drawStaticText();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            var text2 = "The first two lines are simply premises.";
            var maxWidth = canvasWidth / 6;
            var textWidth = tutorialCanvasContext.measureText(text2).width;
            var text2X = maxWidth;
            var text2Y = (canvasHeight / 4 + (canvasHeight / 8));
            var last2Y = wrapText(tutorialCanvasContext, text2, text2X, text2Y, maxWidth, currentFontSize);

            var start2X = text2X + (maxWidth / 2);
            var start2Y = text2Y - currentFontSize;

            var endpoint2X = level.staticTextArray[0].x - (canvasWidth / 60);
            var endpoint2Y = level.staticTextArray[0].y;

            var midpoint2X = (start2X + endpoint2X) / 2;
            var midpoint2Y = ((start2Y + endpoint2Y) / 2) - canvasHeight / 24;

            drawCurvedArrow(start2X, start2Y, endpoint2X, endpoint2Y, midpoint2X, midpoint2Y);
            tutorialCanvasContext.fillText(text, textX, textY);

        }
        if (tutorialStage === 2) {
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").visible();
            tearDown();
            setupLevel(3);
            createCircles();
            drawStaticText();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            var text2 = "The last line is the conclusion. It follows on logically from the two premises.";
            var maxWidth = canvasWidth / 6;
            var textWidth = tutorialCanvasContext.measureText(text2).width;
            var text2X = circlesArray[2].x + circlesArray[2].radius;
            var text2Y = (canvasHeight / 4 + (canvasHeight / 8));
            var last2Y = wrapText(tutorialCanvasContext, text2, text2X, text2Y, maxWidth, currentFontSize);

            var start2X = text2X + (maxWidth / 2);
            var start2Y = text2Y - currentFontSize;

            var endpoint2X = level.staticTextArray[2].x + level.staticTextArray[2].width + (canvasWidth / 60);
            var endpoint2Y = level.staticTextArray[2].y;

            var midpoint2X = (start2X + endpoint2X) / 2;
            var midpoint2Y = ((start2Y + endpoint2Y) / 2) - canvasHeight / 24;

            drawCurvedArrow(start2X, start2Y, endpoint2X, endpoint2Y, midpoint2X, midpoint2Y);
            tutorialCanvasContext.fillText(text, textX, textY);

        }
        if (tutorialStage === 3) {
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").visible();
            tearDown();
            setupLevel(3);
            setupMovableText();
            createCircles();
            drawCircles();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            var text = "So now we have three sets.";
            var textWidth = tutorialCanvasContext.measureText(text).width;
            var textX = circlesArray[1].x - circlesArray[1].radius - textWidth;
            var textY = (canvasHeight / 4);
            tutorialCanvasContext.fillText(text, textX, textY);

        }
        if (tutorialStage === 4) {
            tearDown();
            setupMovableText();
            createCircles();
            drawCircles();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            var text = "Clicking in a segment of the circle will fill it in. This represents the empty set. The empty set is a set with nothing in. For example, the set of dogs with six legs is an empty set.";
            var textWidth = tutorialCanvasContext.measureText(text).width;
            var maxWidth = canvasWidth / 6;
            var textX = circlesArray[2].x + circlesArray[2].radius;
            var textY = (canvasHeight / 4);
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
            context1.fillStyle = "#1d1d1d";

            var startX = textX + (maxWidth / 2);
            var startY = lastY + (currentFontSize / 2);

            var endpointX = circlesArray[0].x + circlesArray[0].radius;
            var endpointY = circlesArray[0].y;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);

            var x = circlesArray[0].x;
            var y = circlesArray[0].y - circlesArray[0].radius + (circlesArray[0].radius / 5);
            floodFill.fill(Math.round(x), Math.round(y), 100, context1, null, null, 90);
        }
        if (tutorialStage === 5) {
            tearDown();
            setupMovableText();
            createCircles();
            drawCircles();
            drawStaticText();
            drawMovableText();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            var segment = canvasWidth / 6;

            var text = "Drag the words below into the circles";


            var maxWidth = segment;
            var textX = segment;
            var textY = (circlesArray[1].y + (circlesArray[1].radius / 2));


            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);


            var startX = textX + (maxWidth / 2);
            var startY = lastY + currentFontSize;

            var endpointX = canvasWidth / 3;
            var endpointY = (canvasHeight / 3 * 2) + canvasHeight / 3 / 2;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);


            var text2 = "Fill in sections of the circle to complete the syllogism";
            var maxWidth = canvasWidth / 6;
            var textWidth = tutorialCanvasContext.measureText(text2).width;
            var text2X = circlesArray[2].x + circlesArray[2].radius;
            var text2Y = (canvasHeight / 4 + (canvasHeight / 8));
            var last2Y = wrapText(tutorialCanvasContext, text2, text2X, text2Y, maxWidth, currentFontSize);

            var start2X = text2X + (maxWidth / 2);
            var start2Y = text2Y - currentFontSize;

            var endpoint2X = level.staticTextArray[1].x + level.staticTextArray[1].width + (canvasWidth / 60);
            var endpoint2Y = level.staticTextArray[1].y;

            var midpoint2X = (start2X + endpoint2X) / 2;
            var midpoint2Y = ((start2Y + endpoint2Y) / 2) - canvasHeight / 24;

            drawCurvedArrow(start2X, start2Y, endpoint2X, endpoint2Y, midpoint2X, midpoint2Y);

            tutorialMode = false;
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            $("#tutorial").visible();
            $("#tutorialForwards").invisible();
            tutorialStage = 0;
        }
    }

    function someXTutorial() {
        tutorialMode = true;
        $("#undoButton").invisible();
        $("#redoButton").invisible();
        $("#refreshButton").invisible();
        $("#tutorial").invisible();

        if (tutorialStage === 0) {
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").visible();
            tearDown();
            setupLevel(3);
            setupMovableText();
            drawStaticText();
            createCircles();
            drawCircles();

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            var text = "Now we have the term 'some'";
            var maxWidth = canvasWidth / 6;
            var textX = circlesArray[1].x - circlesArray[1].radius - maxWidth;
            var textY = (canvasHeight / 4);
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
            context1.fillStyle = "#1d1d1d";
            var startX = textX + (maxWidth / 2);
            var startY = textY - (currentFontSize);
            var endpointX = level.staticTextArray[1].x - currentFontSize / 2;
            var endpointY = level.staticTextArray[1].y - currentFontSize / 2;
            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) - canvasHeight / 24;
            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
        }

        if (tutorialStage === 1) {
            $("#tutorialBackwards").visible();
            tearDown();
            setupMovableText();
            drawStaticText();
            createCircles();
            drawCircles();
            drawMovableText();
            drawStaticText();


            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            var text = "Drag the 'X' into the correct segment to represent 'some'";
            var maxWidth = canvasWidth / 6;
            var segment = canvasWidth / 6;
            var textX = segment * 4;
            var textY = circlesArray[2].y;
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);
            context1.fillStyle = "#1d1d1d";
            var startX = textX + (maxWidth / 2);
            var startY = lastY + (currentFontSize / 2);
            var endpointX = level.movableTextArray[3].x;
            var endpointY = level.movableTextArray[3].y - currentFontSize;
            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) - canvasHeight / 24;
            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
            tutorialMode = false;
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            $("#tutorial").visible();
            $("#tutorialForwards").invisible();

        }

    }

    function unionIntersectionTutorial() {
        tutorialMode = true;
        $("#undoButton").invisible();
        $("#redoButton").invisible();
        $("#refreshButton").invisible();
        $("#tutorial").invisible();

        if (tutorialStage === 0) {
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").visible();
            tearDown();
            setupLevel(4);
            setupMovableText();
            createCircles();
            drawCircles();
            drawStaticTextForVennDiagram();

            tutorialCanvasContext.font = getFont();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            drawNumbersForSetTheoryTutorial(tutorialCanvasContext, circlesArray, canvasWidth);

            var segment = canvasWidth / 6;
            var text = "As before we have two sets. Even numbers and multiples of 5.";
            var maxWidth = segment;
            var textX = segment;
            var textY = canvasHeight - segment;
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);
            var startX = textX + (maxWidth / 2);
            var startY = lastY + currentFontSize;
            var endpointX = canvasWidth / 2;
            var endpointY = canvasHeight / 2 + circlesArray[0].radius;
            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 6;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);

        }

        if (tutorialStage === 1) {
            $("#tutorialBackwards").visible();
            tearDown();
            setupMovableText();
            createCircles();
            drawCircles();
            drawStaticTextForVennDiagram();

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            tutorialCanvasContext.fillStyle = "#3498db";

            drawNumbersForSetTheoryTutorial(tutorialCanvasContext, circlesArray, canvasWidth);

            var text = "The union of two sets is everything in both sets. It is represented with the symbol - ∪";
            var maxWidth = canvasWidth / 6;
            var segment = canvasWidth / 6;
            var textX = segment * 4;
            var textY = canvasHeight - segment;
            tutorialCanvasContext.fillStyle = "#1d1d1d";
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);
            var startX = textX - (currentFontSize / 2);
            var startY = (lastY + textY) / 2;

            floodFill.fill(Math.round(circlesArray[0].x - (circlesArray[0].radius / 2)), Math.round(circlesArray[0].y), 100, context1, null, null, 90);
            floodFill.fill(Math.round(circlesArray[1].x + (circlesArray[1].radius / 2)), Math.round(circlesArray[1].y), 100, context1, null, null, 90);
            floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);

            var endpointx1 = circlesArray[0].x - (circlesArray[0].radius / 2);
            var endpointy1 = circlesArray[0].y + (circlesArray[0].radius / 2);

            var endpointx2 = canvasWidth / 2;
            var endpointy2 = canvasHeight / 2 + (circlesArray[0].radius / 2);

            var endpointx3 = circlesArray[1].x + (circlesArray[1].radius / 2);
            var endpointy3 = circlesArray[1].y + (circlesArray[1].radius / 2);


            drawCurvedArrow(startX, startY, endpointx1, endpointy1, (startX + endpointx1) / 2.5, ((startY + endpointy1) / 2) + canvasHeight / 5);
            drawCurvedArrow(startX, startY, endpointx2, endpointy2, (startX + endpointx2) / 2.2, ((startY + endpointy2) / 2) + canvasHeight / 6);
            drawCurvedArrow(startX, startY, endpointx3, endpointy3, (startX + endpointx3) / 2.2, ((startY + endpointy3) / 2) + canvasHeight / 12);
        }

        if (tutorialStage === 2) {
            $("#tutorialBackwards").visible();
            tearDown();
            setupMovableText();
            createCircles();
            drawCircles();
            drawStaticTextForVennDiagram();

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            tutorialCanvasContext.fillStyle = "#3498db";

            drawNumbersForSetTheoryTutorial(tutorialCanvasContext, circlesArray, canvasWidth);

            var text = "The intersection is just the elements in both sets. It is represented with the symbol - ∩";
            var segment = canvasWidth / 6;
            var textX = segment;
            var maxWidth = segment;
            var textY = canvasHeight - segment;
            tutorialCanvasContext.fillStyle = "#1d1d1d";
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);
            var startX = textX + maxWidth;
            var startY = (lastY + textY) / 2;
            var endpointX = canvasWidth / 2;
            var endpointY = canvasHeight / 2 + circlesArray[0].radius;
            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 12;

            floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);

            tutorialMode = false;
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            $("#tutorial").visible();
        }
    }

    function setTheoryTutorial() {
        tutorialMode = true;
        $("#undoButton").invisible();
        $("#redoButton").invisible();
        $("#refreshButton").invisible();
        $("#tutorial").invisible();

        if (tutorialStage === 0) {
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").visible();
            tearDown();
            setupLevel(5);
            setupMovableText();
            createCircles();
            drawCircles();
            drawStaticText();

            // tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();

            var text = "This is the distributive law of sets. You will need to show that this is true.";
            var maxWidth = canvasWidth / 6;
            var textX = circlesArray[1].x - circlesArray[1].radius - maxWidth;
            var textY = circlesArray[0].y;
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
            context1.fillStyle = "#1d1d1d";

            var startX = textX + (maxWidth / 2);
            var startY = textY - (currentFontSize);


            var endpointX = canvasWidth / 2;
            var endpointY = level.staticTextArray[0].y + currentFontSize;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);

        }

        if (tutorialStage === 1) {
            $("#tutorialForwards").invisible();
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            $("#tutorial").visible();
            tearDown();
            setupMovableText();
            drawMovableText();
            createCircles();
            drawCircles();
            drawStaticText();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();

            var text = "First show (A ∪ B) by dragging in the letters and filling in the correct circle segments";
            var maxWidth = canvasWidth / 3;
            var textX = circlesArray[2].x + circlesArray[2].radius;
            var textY = circlesArray[0].y;
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);
            context1.fillStyle = "#1d1d1d";

            var startX = textX + (maxWidth / 2);
            var startY = textY - (currentFontSize);


            var endpointX = canvasWidth / 2 + canvasWidth / 36;
            var endpointY = level.staticTextArray[0].y + currentFontSize / 2;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
            tutorialMode = false;
        }

        if (tutorialStage === 2) {
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            $("#tutorial").visible();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();

            var text = "Now show (A ∪ C)";
            var maxWidth = canvasWidth / 6;
            var textX = circlesArray[1].x - circlesArray[1].radius - maxWidth;
            var textY = circlesArray[0].y;
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
            context1.fillStyle = "#1d1d1d";

            var startX = textX + (maxWidth / 2);
            var startY = textY - (currentFontSize);


            var textWidth = (context3.measureText(level.staticTextArray[0].text).width);

            var endpointX = (canvasWidth / 2) + textWidth / 3;
            var endpointY = level.staticTextArray[0].y + currentFontSize / 2;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
            tutorialMode = false;
        }

        if (tutorialStage === 3) {
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            $("#tutorial").visible();
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();

            var text = "Now using what you've just done show (A ∪ B) ∩ (A ∪ C)";
            var maxWidth = canvasWidth / 6;
            var textX = circlesArray[2].x + circlesArray[2].radius;
            var textY = circlesArray[0].y;
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
            context1.fillStyle = "#1d1d1d";

            var startX = textX + (maxWidth / 2);
            var startY = textY - (currentFontSize);


            var endpointX = canvasWidth / 2;
            var endpointY = level.staticTextArray[0].y + currentFontSize / 2;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            // drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
            tutorialMode = false;
        }

    }

    function emptySetTutorial(){
        tutorialMode = true;
        $("#undoButton").invisible();
        $("#redoButton").invisible();
        $("#refreshButton").invisible();
        $("#tutorial").invisible();

        if (tutorialStage === 0) {
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").visible();
            // level = {
            //     type: "syllogism",
            //     circlesNeeded: 2,
            //     particularSyllogism: false
            // };
            setupLevel(2);
            tearDown();
            createCircles();
            drawCircles();

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();
            var text = "Next you need to understand the empty set. This is a set with nothing in it.";
            var textWidth = tutorialCanvasContext.measureText(text).width;
            var maxWidth = canvasWidth / 6;
            var textX = circlesArray[1].x + circlesArray[1].radius;
            var textY = (canvasHeight / 4);
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);

            var startX = textX + (maxWidth / 2);
            var startY = lastY + (currentFontSize / 2);

            var endpointX = circlesArray[0].x + circlesArray[0].radius;
            var endpointY = circlesArray[0].y;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;
        }

        if (tutorialStage === 1) {
            $("#tutorialBackwards").visible();
            $("#tutorialForwards").visible();
            tearDown();
            createCircles();
            drawCircles();

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();

            var text = "Clicking in a circle will fill it black. This is how we represent the empty set.";
            var textWidth = tutorialCanvasContext.measureText(text).width;
            var maxWidth = canvasWidth / 6;
            var textX = circlesArray[0].x - circlesArray[0].radius - maxWidth;
            var textY = (canvasHeight / 4);
            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);

            var startX = textX + (maxWidth / 2);
            var startY = lastY + (currentFontSize / 2);

            var endpointX = circlesArray[0].x - circlesArray[0].radius / 4;
            var endpointY = circlesArray[0].y;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);

            var x = circlesArray[0].x;
            var y = circlesArray[0].y - circlesArray[0].radius + (circlesArray[0].radius / 5);
            context1.fillStyle = "#2c3e50";
            floodFill.fill(Math.round(x), Math.round(y), 100, context1, null, null, 90);
            floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);
        }

        if (tutorialStage === 2) {
            $("#tutorialBackwards").visible();
            $("#tutorialForwards").visible();
            tearDown();
            createCircles();
            drawCircles();

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();

            var staticTextArray =
                [
                    {
                        "text": "Dogs with 16 legs"
                    },
                    {
                        "text": "Dogs with 4 legs"
                    }
                ];


            drawStaticTextForVennDiagram(staticTextArray);

            var dog1 = new Image();
            dog1.onload = function () {
                tutorialCanvasContext.drawImage(dog1, circlesArray[1].x + (circlesArray[1].radius / 2),
                    circlesArray[1].y - (circlesArray[0].radius / 3 / 2), circlesArray[0].radius / 3, circlesArray[0].radius / 3);
            }
            dog1.src = "images/dog.svg";

            var dog2 = new Image();
            dog2.onload = function () {
                tutorialCanvasContext.drawImage(dog2, circlesArray[1].x + (circlesArray[1].radius / 4),
                    circlesArray[1].y + (circlesArray[1].radius / 2) - (circlesArray[0].radius / 3 / 2),
                    circlesArray[0].radius / 3, circlesArray[0].radius / 3);
            }
            dog2.src = "images/bulldog.svg";

            var dog3 = new Image();
            dog3.onload = function () {
                tutorialCanvasContext.drawImage(dog3, circlesArray[1].x + (circlesArray[1].radius / 4),
                    circlesArray[1].y - (circlesArray[1].radius / 2) - (circlesArray[0].radius / 3 / 2),
                    circlesArray[0].radius / 3, circlesArray[0].radius / 3);
            }
            dog3.src = "images/bulldog-1.svg";


            var text = "Here the set of dogs with 16 legs is empty because there are no dogs with 16 legs!";
            var segment = canvasWidth / 6;

            var maxWidth = segment;
            var textX = segment;
            var textY = (circlesArray[1].y + (circlesArray[1].radius));

            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);


            var startX = textX + (maxWidth / 2);
            var startY = textY - currentFontSize;

            var endpointX = circlesArray[0].x;
            var endpointY = circlesArray[0].y;

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
            var x = circlesArray[0].x;
            var y = circlesArray[0].y - circlesArray[0].radius + (circlesArray[0].radius / 5);
            context1.fillStyle = "#2c3e50";
            floodFill.fill(Math.round(x), Math.round(y), 100, context1, null, null, 90);
            floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);
        }

        if (tutorialStage === 3) {
            $("#tutorialBackwards").visible();
            $("#tutorialForwards").visible();
            tearDown();
            createCircles();
            drawCircles();
            setupLevel(2)
            drawStaticTextForVennDiagram(level.staticTextArray);
            setupMovableText();
            drawMovableText();

            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            tutorialCanvasContext.font = getFont();

            var text = "Drag the numbers in to the correct place and fill in the empty set";
            var segment = canvasWidth / 6;

            var maxWidth = segment;
            var textX = circlesArray[1].x + circlesArray[1].radius;
            var textY = (circlesArray[1].y + (circlesArray[1].radius));

            var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);

            var startX = textX + (maxWidth / 2);
            var startY = lastY + currentFontSize;

            var endpointX = canvasWidth/2;
            var endpointY = level.movableTextArray[0].y - (currentFontSize*2);

            var midpointX = (startX + endpointX) / 2;
            var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

            drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);


            tutorialMode = false;
            $("#undoButton").visible();
            $("#redoButton").visible();
            $("#refreshButton").visible();
            $("#tutorial").visible();
            $("#tutorialForwards").invisible();
        }
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        var lastY;

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
                lastY = y;
            }
            else {
                line = testLine;
            }

        }
        context.fillText(line, x, y);
        return lastY;
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

    function drawNumbersForSetTheoryTutorial(tutorialCanvasContext, circlesArray, canvasWidth) {
        tutorialCanvasContext.fillText("2", circlesArray[0].x - (circlesArray[0].radius / 2), circlesArray[0].y);
        tutorialCanvasContext.fillText("12", circlesArray[0].x - (circlesArray[0].radius / 4), circlesArray[0].y + (circlesArray[0].radius / 2));
        tutorialCanvasContext.fillText("8", circlesArray[0].x - (circlesArray[0].radius / 4), circlesArray[0].y - (circlesArray[0].radius / 2));

        tutorialCanvasContext.fillText("15", circlesArray[1].x + (circlesArray[1].radius / 2), circlesArray[1].y);
        tutorialCanvasContext.fillText("25", circlesArray[1].x + (circlesArray[1].radius / 4), circlesArray[1].y + (circlesArray[1].radius / 2));
        tutorialCanvasContext.fillText("5", circlesArray[1].x + (circlesArray[1].radius / 4), circlesArray[1].y - (circlesArray[1].radius / 2));

        tutorialCanvasContext.fillText("10", canvasWidth / 2 - (canvasWidth / 50), circlesArray[0].y - circlesArray[0].radius / 4);
        tutorialCanvasContext.fillText("40", canvasWidth / 2 + (canvasWidth / 50), circlesArray[0].y + circlesArray[0].radius / 4);
    }

    function drawCurvedArrow(startPointX, startPointY, endPointX, endPointY, quadPointX, quadPointY) {

        tutorialCanvasContext.strokeStyle = '#2ecc71';
        tutorialCanvasContext.lineWidth = 6;
        tutorialCanvasContext.lineCap = "round";

        var arrowAngle = Math.atan2(quadPointX - endPointX, quadPointY - endPointY) + Math.PI;
        var arrowWidth = 20;

        tutorialCanvasContext.beginPath();
        tutorialCanvasContext.moveTo(startPointX, startPointY);

        tutorialCanvasContext.quadraticCurveTo(quadPointX, quadPointY, endPointX, endPointY);

        tutorialCanvasContext.moveTo(endPointX - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)),
            endPointY - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)));

        tutorialCanvasContext.lineTo(endPointX, endPointY);

        tutorialCanvasContext.lineTo(endPointX - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)),
            endPointY - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)));

        tutorialCanvasContext.stroke();
        tutorialCanvasContext.closePath();
    }

    (function ($) {
        $.fn.invisible = function () {
            return this.each(function () {
                $(this).css("visibility", "hidden");
            });
        };
        $.fn.visible = function () {
            return this.each(function () {
                $(this).css("visibility", "visible");
            });
        };
    }(jQuery));

    resizeCanvas();

    vennDiagramTutorial();
    // syllogismTutorial();
    // someXTutorial();
    // unionIntersectionTutorial();
    // main(4);
    // setTheoryTutorial();
    // emptySetTutorial();

    function getFont() {
        // var ratio = fontSize / fontBase;   // calc ratio
        var ratio = 24 / 1440;   // calc ratio
        var size = canvasWidth * ratio;   // get font size based on current width
        currentFontSize = size;
        return (size | 0) + 'px comicNeue'; // set font
    }

    var mp = 200; //max particles
    var particles = [];
    for (var i = 0; i < mp; i++) {
        particles.push({
            x: Math.random() * layer1.width, //x-coordinate
            y: Math.random() * layer1.height, //y-coordinate
            r: Math.random() * 15 + 1, //radius
            d: Math.random() * mp, //density
            color: "rgba(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", 0.8)",
            tilt: Math.floor(Math.random() * 5) - 5
        });
    }

    function drawConfetti() {
        circleOutlineContext.clearRect(0, 0, canvasWidth, canvasHeight);

        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            circleOutlineContext.beginPath();
            circleOutlineContext.lineWidth = p.r;
            circleOutlineContext.strokeStyle = p.color; // Green path
            circleOutlineContext.moveTo(p.x, p.y);
            circleOutlineContext.lineTo(p.x + p.tilt + p.r / 2, p.y + p.tilt);
            circleOutlineContext.stroke(); // Draw it
        }

        update();
    }

    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0;

    function update() {
        angle += 0.01;
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;

            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if (p.x > canvasWidth + 5 || p.x < -5 || p.y > canvasHeight) {
                if (i % 3 > 0) //66.67% of the flakes
                {
                    particles[i] = {
                        x: Math.random() * canvasWidth,
                        y: -10,
                        r: p.r,
                        d: p.d,
                        color: p.color,
                        tilt: p.tilt
                    };
                } else {
                    //If the flake is exitting from the right
                    if (Math.sin(angle) > 0) {
                        //Enter from the left
                        particles[i] = {
                            x: -5,
                            y: Math.random() * canvasHeight,
                            r: p.r,
                            d: p.d,
                            color: p.color,
                            tilt: p.tilt
                        };
                    } else {
                        //Enter from the right
                        particles[i] = {
                            x: canvasWidth + 5,
                            y: Math.random() * canvasHeight,
                            r: p.r,
                            d: p.d,
                            color: p.color,
                            tilt: p.tilt
                        };
                    }
                }
            }
        }
    }


})
;