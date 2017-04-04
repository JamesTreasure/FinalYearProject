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
var setTheoryLevel = 10;
var dogs = false;
var startTime, endTime;
var levelsSkipped = [];
var playerName;
var gameStarted = false;
var retrievedObject = JSON.parse(localStorage.getItem('gameObject'));

var layer1;
var layer2;
var layer3;
var layer4;
var circleBorder;
var tutorialCanvas;
var circleOutlineCanvas;

//Context 1 has undo, redo and refresh. Also has static text, circles.
var context1;

//Context 2 has movable textf
var context2;

//Context 3 has win screen
var context3;

var context4;

//Layer for the second circles
var circleBorderContext;

//Layer for the tutorial
var tutorialCanvasContext;

var circleOutlineContext;

var staticTextContext;

function setupCanvases() {
    layer1 = document.getElementById('layer1');
    layer2 = document.getElementById('layer2');
    layer3 = document.getElementById('layer3');
    layer4 = document.getElementById('layer4');
    circleBorder = document.getElementById('circleBorder');
    tutorialCanvas = document.getElementById('tutorialCanvas');
    circleOutlineCanvas = document.getElementById('circleOutlineCanvas');
    staticTextCanvas = document.getElementById('staticTextCanvas');
    //Context 1 has undo, redo and refresh. Also has static text, circles.
    context1 = layer1.getContext('2d');

//Context 2 has movable text
    context2 = layer2.getContext('2d');

//Context 3 has win screen
    context3 = layer3.getContext('2d');

    context4 = layer4.getContext('2d');

//Layer for the second circles
    circleBorderContext = circleBorder.getContext('2d');

//Layer for the tutorial
    tutorialCanvasContext = tutorialCanvas.getContext('2d');

    circleOutlineContext = circleOutlineCanvas.getContext('2d');
    staticTextContext = staticTextCanvas.getContext('2d');
}

// window.addEventListener('resize', resizeCanvas, false);

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
var isImageMovable = false;
var dog1, dog2, dog3;

var mySpreadsheet = "https://docs.google.com/spreadsheets/d/1JMUw0MvV7Yksj8SejL_YM2CgrumpafeoPwPSRsqi1Vw/edit?usp=sharing#gid=0";
var spreadsheetData;
var level1startTime, level2startTime, level3startTime, level4startTime, level5startTime, level6startTime, level7startTime,
    level8startTime, level9startTime, level10startTime, level11startTime;
var level1endTime, level2endTime, level3endTime, level4endTime, level5endTime, level6endTime, level7endTime,
    level8endTime, level9endTime, level10endTime, level11endTime;
var level1moves, level2moves, level3moves, level4moves, level5moves, level6moves, level7moves, level8moves, level9moves, level10moves, level11moves;
var moveCounter = 0;

function renderText() {
    tutorialCanvasContext.font = font;
    var text = "A set is a collection of things";
    var textWidth = tutorialCanvasContext.measureText(text);
    tutorialCanvasContext.fillText(text, ((canvasWidth / 2) - (textWidth.width / 2)), canvasHeight / 4);
}

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

    staticTextCanvas.height = window.innerHeight;
    staticTextCanvas.width = window.innerWidth;

    canvasWidth = layer1.width;
    canvasHeight = layer1.height;

    font = getFont();
}

// window.addEventListener("resize", resizeCanvas);

function setupNextLevel() {
    if(playerName == null){
        playerName = retrievedObject.playerName;
    }
    var game = new gameObject(level.levelNumber, playerName);
    console.log(game);
    localStorage.setItem('gameObject', JSON.stringify(game));
    tearDown();
    majorPremiseMet = false;
    minorPremiseMet = false;
    tutorialStage = 0;
    var currentLevel = level.levelNumber;
    var nextLevel = currentLevel + 1;
    $('#levelSelect').text('Level ' + nextLevel);
    $("#nextLevelButton").invisible();
    main(nextLevel);
    postDataToGoogleSheets(playerName);
}

function gameObject(levelNumber, playerName) {
    this.levelNumber = levelNumber;
    this.playerName = playerName;
}

function postDataToGoogleSheets(name, time) {
    var allSkippedLevels = (levelsSkipped.join(", "));

    var myData = {
        "name": playerName,
        "level1time": (level1endTime - level1startTime) / 1000,
        "level1moves": level1moves,
        "level2time": (level2endTime - level2startTime) / 1000,
        "level2moves": level2moves,
        "level3time": (level3endTime - level3startTime) / 1000,
        "level3moves": level3moves,
        "level4time": (level4endTime - level4startTime) / 1000,
        "level4moves": level4moves,
        "level5time": (level5endTime - level5startTime) / 1000,
        "level5moves": level5moves,
        "level6time": (level6endTime - level6startTime) / 1000,
        "level6moves": level6moves,
        "level7time": (level7endTime - level7startTime) / 1000,
        "level7moves": level7moves,
        "level8time": (level8endTime - level8startTime) / 1000,
        "level8moves": level8moves,
        "level9time": (level9endTime - level9startTime) / 1000,
        "level9moves": level9moves,
        "level10time": (level10endTime - level10startTime) / 1000,
        "level10moves": level10moves,
        "level11time": (level11endTime - level11startTime) / 1000,
        "level11moves": level11moves,
        "levelsSkipped": allSkippedLevels,
        "totalTime": ((level1endTime - level1startTime) / 1000) + ((level2endTime - level2startTime) / 1000) + ((level3endTime - level3startTime) / 1000) +
        ((level4endTime - level4startTime) / 1000) + ((level5endTime - level5startTime) / 1000) + ((level6endTime - level6startTime) / 1000) + ((level7endTime - level7startTime) / 1000)
        + ((level8endTime - level8startTime) / 1000) + ((level9endTime - level9startTime) / 1000) + ((level10endTime - level10startTime) / 1000) + ((level11endTime - level11startTime) / 1000)
    }

    postData(myData);
}

function main(levelNumber) {
    setupLevel(levelNumber);
    context1.fillStyle = "white";
    context1.fillRect(0, 0, layer1.width, layer1.height);
    $('#levelSelect').text('Level ' + levelNumber);
    if (levelNumber == 1) {
        if(level1startTime === undefined){
            level1startTime = performance.now();
        }
        level1Tutorial(1);
    } else if (levelNumber == 2) {
        if(level1moves === undefined || level1endTime === undefined || level2startTime === undefined) {
            level1moves = moveCounter;
            moveCounter = 0;
            level1endTime = performance.now();
            level2startTime = performance.now();
        }
        level2Tutorial(levelNumber);
    } else if (levelNumber == 3) {
        if(level2moves === undefined || level2endTime === undefined || level4startTime === undefined) {
            level2moves = moveCounter;
            moveCounter = 0;
            level2endTime = performance.now();
            level3startTime = performance.now();
        }
        level3Tutorial(levelNumber);
    } else if (levelNumber == 4) {
        if(level3moves === undefined || level3endTime === undefined || level4startTime === undefined) {
            level3moves = moveCounter;
            moveCounter = 0;
            level3endTime = performance.now();
            level4startTime = performance.now();
        }
        level4Tutorial(levelNumber);
    } else if (levelNumber == 5) {
        if(level4moves === undefined || level4endTime === undefined || level5startTime === undefined) {
            level4moves = moveCounter;
            moveCounter = 0;
            level4endTime = performance.now();
            level5startTime = performance.now();
        }
        level5Tutorial(levelNumber);
    } else if (levelNumber == 6) {
        if(level5moves === undefined || level5endTime === undefined || level6startTime === undefined) {
            level5moves = moveCounter;
            moveCounter = 0;
            level5endTime = performance.now()
            level6startTime = performance.now();
        }
        level6Tutorial(levelNumber);
    } else if (levelNumber === 7) {
        if(level6moves === undefined || level6endTime === undefined || level7startTime === undefined){
            level6moves = moveCounter;
            moveCounter = 0;
            level6endTime = performance.now();
            level7startTime = performance.now();
        }
        level7Tutorial(levelNumber);
    }else if (levelNumber === 8){
        if(level7moves === undefined || level7endTime === undefined || level8startTime === undefined) {
            level7moves = moveCounter;
            moveCounter = 0;
            level7endTime = performance.now();
            level8startTime = performance.now();
        }
        setupMovableText();
        drawStaticText();
        drawMovableText();
        setupCircles(level.circlesNeeded, canvasHeight, canvasWidth, circlesArray);
        drawCircles();
    } else if (levelNumber === 9) {
        if(level8moves === undefined || level8endTime === undefined || level9startTime === undefined) {
            level8moves = moveCounter;
            moveCounter = 0;
            level8endTime = performance.now();
            level9startTime = performance.now();
        }
        level9Tutorial(levelNumber);
    } else if (levelNumber === 10) {
        if(level9moves === undefined || level9endTime === undefined || level10startTime === undefined) {
            level9moves = moveCounter;
            moveCounter = 0;
            level9endTime = performance.now();
            level10startTime = performance.now();
        }
        level10And11Tutorial(level.levelNumber);
    } else if (levelNumber === 11) {
        if(level10moves === undefined || level10endTime === undefined || level9startTime === undefined) {
            level10moves = moveCounter;
            moveCounter = 0;
            level10endTime = performance.now();
            level11startTime = performance.now();
        }
        level10And11Tutorial(levelNumber);
    } else {
        tearDown();
        setupLevel(levelNumber);
        if (level.type === "venn") {
            setupMovableText();
            setupCircles(level.circlesNeeded, canvasHeight, canvasWidth, circlesArray);
            drawCircles();
            drawMovableText();
            drawStaticTextForVennDiagram(level.staticTextArray);
        }
        if (level.type === "syllogism") {
            setupMovableText();
            drawStaticText();
            drawMovableText();
            setupCircles(level.circlesNeeded, canvasHeight, canvasWidth, circlesArray);
            drawCircles();
        }
        if (level.type === "setTheory") {
            setupMovableText();
            drawStaticText();
            drawMovableText();
            setupCircles(level.circlesNeeded, canvasHeight, canvasWidth, circlesArray);
            drawCircles();
        }
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
    staticTextContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

function levelCompleteScreen() {
    levelComplete = true;
    clearAllCanvases();
    drawCircles();
    if (level.type === "venn") {
        drawStaticTextForVennDiagram(level.staticTextArray);
    }
    //need to only do this if not level 1
    if (level.levelNumber !== 1) {
        drawMovableText();
    }

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
    level11endTime = performance.now();
    levelComplete = true;
    clearAllCanvases();
    drawCircles();
    if (level.type === "venn") {
        drawStaticTextForVennDiagram(level.staticTextArray);
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
    endTime = performance.now();
    level11moves = moveCounter;
    moveCounter = 0;
    postDataToGoogleSheets("James", (endTime - startTime) / 1000);
    setupLeaderboard();


}

function setupLeaderboard(){
    $(".wrapper").hide();
    console.log("leaderboard");

    var fileref = document.createElement("link");
    fileref.rel = "stylesheet";
    fileref.type = "text/css";
    fileref.href = "materialize.min.css";
    fileref.media = "screen,projection";
    document.getElementsByTagName("head")[0].appendChild(fileref)

    $('#spreadsheet').sheetrock({
        url: mySpreadsheet,
        query: "select B,Y,AD order by AB asc",
        labels: ['Name', 'Levels Skipped', 'Time'],
        fetchSize: 10
    });

}

function undo() {
    var clickedInArrayBeforePop = clone(clickedInArray);
    if (levelComplete) {
        levelComplete = false;
        context1.clearRect(0, 0, canvasWidth, canvasHeight);
        staticTextContext.clearRect(0, 0, canvasWidth, canvasHeight);
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
        if (level.levelNumber === 1) {
            drawDogs();
        } else {
            drawMovableText();
        }
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
        if (level.levelNumber === 1) {
            drawDogs();
        } else {
            drawMovableText();
        }
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
        drawStaticTextForVennDiagram(level.staticTextArray);
    }
}

function clearStaticText() {
    for (var i = 0; i < level.staticTextArray.length; i++) {
        staticTextContext.clearRect(level.staticTextArray[i].x, level.staticTextArray[i].y - level.staticTextArray[i].height,
            level.staticTextArray[i].width, level.staticTextArray[i].height + (canvasHeight / 40));
    }
}

function animate() {

    if (level.levelNumber === 1) {
        drawDogs();
    } else {
        drawMovableText();
    }

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

function loadImages() {
    dog1 = new Image();
    dog1.onload = function () {
        console.log("loaded 1");
        drawDogs();
    };
    dog1.src = "images/dog.svg";

    dog2 = new Image();
    dog2.onload = function () {
        console.log("loaded 2");
        drawDogs();
    };
    dog2.src = "images/bulldog.svg";

    dog3 = new Image();
    dog3.onload = function () {
        console.log("loaded 3");
        drawDogs();
    };
    dog3.src = "images/bulldog-1.svg";
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var lastY = y;

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

function getFont() {
    circleOutlineCanvas.style.font = '1.4em comicNeue';
    // currentFontSize = Number(getComputedStyle(circleOutlineCanvas).fontSize.replace(/\D/g,''));
    currentFontSize = parseInt(getComputedStyle(circleOutlineCanvas).fontSize);
    return '1.4em comicNeue'; // set font
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

function start() {
    gameStarted = true;
    playerName = $('#playerInputId').val();
    $(".launchPage").remove();
    $(".wrapper").show();
    console.log("Nothing saved!");
    // drawLevelNumber(1);
    main(1);
}

function continueGame() {
    gameStarted = true;
    playerName = $('#name').val();
    $(".launchPage").remove();
    $(".wrapper").show();
    // drawLevelNumber(retrievedObject.levelNumber);
    main(retrievedObject.levelNumber);
}

$(window).mousedown(function (e) {
    var pos = getMousePos(layer1, e);
    if (!levelComplete && !tutorialMode && gameStarted) {
        moveCounter++;
        if (level.levelNumber === 1) {
            var clickedOn = imageClickedOn(pos.x, pos.y, level.movableTextArray);
        } else {
            var clickedOn = textClickedOn(pos.x, pos.y, level.movableTextArray);
        }
        if (clickedOn >= 0) {
            console.log("Clicked on!!!");
            if (level.type != "setTheory" && level.levelNumber != 5) {
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
            var clickedOnX;
            var clickedOnY
            if (level.levelNumber === 1) {
                clickedOnX = level.movableTextArray[clickedOn].x;
                clickedOnY = level.movableTextArray[clickedOn].y;
            } else {
                clickedOnX = level.movableTextArray[clickedOn].x;
                clickedOnY = level.movableTextArray[clickedOn].y;
            }
            dragId = clickedOn;
            dragOffsetX = pos.x - clickedOnX;
            dragOffsetY = pos.y - clickedOnY;
            drag = true;
        }
        if (!drag) {
            if (level.levelNumber === 1) {
                checkIfLevel1IsCorrect();
            }
            if (level.levelNumber === 4) {
                whichCircleClickedIn(pos.x, pos.y);
                checkIfMenMortalIsCorrect();
            }
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
                checkIfSetTheoryIsMet(level, level.correctPlacement[setTheoryCurrentStage]);
            }
            if (level.type === "emptySet") {
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
    if (isImageMovable) {
        if (drag) {
            level.movableTextArray[dragId].x = pos.x - dragOffsetX;
            level.movableTextArray[dragId].y = pos.y - dragOffsetY;
            requestAnimationFrame(animate);
        }
    }
}));

$(window).mouseup(function () {
    if (!tutorialMode && gameStarted) {
        if (level.levelNumber === 1) {
            checkIfLevel1IsCorrect();
        }
        if (level.type === "venn") {
            checkIfVennDiagramIsCorrect();
        }
        if (level.type === "syllogism") {
            if (tutorialStage === 5) {
                if (checkPremiseAllInTheirOwnCircle()) {
                    tutorialStage++;
                    level5Tutorial(5);
                }
            }
            if (tutorialStage === 6) {
                if (checkIfMajorPremiseIsMet()) {
                    tutorialStage++;
                    level5Tutorial(5);
                }
            }
            checkIfSyllogismIsMet();
            checkIfAnyPropositionsAreMet();
        }
        if (level.type === "setTheory") {
            checkIfSetTheoryIsMet(level, level.correctPlacement[setTheoryCurrentStage]);
        }
        if (level.type === "emptySet") {
            checkIfEmptySetIsCorrect();
        }
        if (drag) {
            circleOutlineContext.clearRect(0, 0, canvasWidth, canvasHeight);

        }
        drag = false;
        dragId = -1;
    }
});

$(window).bind('touchstart', function (jQueryEvent) {
    jQueryEvent.preventDefault();
    var event = window.event;
    if (!levelComplete && !tutorialMode && gameStarted) {
        moveCounter++;
        if (level.levelNumber === 1) {
            var clickedOn = imageClickedOn(event.touches[0].pageX, event.touches[0].pageY, level.movableTextArray);
        } else {
            var clickedOn = textClickedOn(event.touches[0].pageX, event.touches[0].pageY, level.movableTextArray);
        }
        if (clickedOn >= 0) {
            console.log("Clicked on!!!");
            if (level.type != "setTheory" || level.levelNumber != 5) {
                tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
                tutorialStage = 0;
            }
            ;
            $("#tutorialBackwards").invisible();
            $("#tutorialForwards").invisible();
            if (event.touches[0].pageX > 0 && event.touches[0].pageX < canvasWidth && event.touches[0].pageY > 0 && event.touches[0].pageY < canvasHeight) {
                var clonedMovableTextArray = clone(level.movableTextArray);
                var clonedClickedInArray = clone(clickedInArray);
                undoStack.push(new GameState(clonedMovableTextArray, clonedClickedInArray));
            }
            var clickedOnX;
            var clickedOnY
            if (level.levelNumber === 1) {
                clickedOnX = level.movableTextArray[clickedOn].x;
                clickedOnY = level.movableTextArray[clickedOn].y;
            } else {
                clickedOnX = level.movableTextArray[clickedOn].x;
                clickedOnY = level.movableTextArray[clickedOn].y;
            }
            dragId = clickedOn;
            dragOffsetX = event.touches[0].pageX - clickedOnX;
            dragOffsetY = event.touches[0].pageY - clickedOnY;
            drag = true;
        }
        if (!drag) {
            if (level.levelNumber === 1) {
                checkIfLevel1IsCorrect();
            }
            if (level.levelNumber === 4) {
                whichCircleClickedIn(event.touches[0].pageX, event.touches[0].pageY);
                checkIfMenMortalIsCorrect();
            }
            if (level.type === "syllogism") {
                whichCircleClickedIn(event.touches[0].pageX, event.touches[0].pageY);
                checkIfSyllogismIsMet();
                checkIfAnyPropositionsAreMet();
            }
            if (level.type === "venn") {
                checkIfVennDiagramIsCorrect();
            }
            if (level.type === "setTheory") {
                whichCircleClickedIn(event.touches[0].pageX, event.touches[0].pageY);
                checkIfSetTheoryIsMet(level, level.correctPlacement[setTheoryCurrentStage]);
            }
            if (level.type === "emptySet") {
                whichCircleClickedIn(event.touches[0].pageX, event.touches[0].pageY);
                checkIfEmptySetIsCorrect();
            }
        }
    }

});

$(window).bind('touchmove', function (jQueryEvent) {
    jQueryEvent.preventDefault();
    var event = window.event;
    enableOrDisableUndoRedoButtons();
    if (isTextMovable) {
        if (drag) {
            level.movableTextArray[dragId].x = event.touches[0].pageX - dragOffsetX;
            level.movableTextArray[dragId].y = event.touches[0].pageY - dragOffsetY;
            requestAnimationFrame(animate);
        }
    }
    if (isImageMovable) {
        if (drag) {
            level.movableTextArray[dragId].x = event.touches[0].pageX - dragOffsetX;
            level.movableTextArray[dragId].y = event.touches[0].pageY - dragOffsetY;
            requestAnimationFrame(animate);
        }
    }
});

$(window).bind('touchend', function (jQueryEvent) {
    if (!tutorialMode) {
        if (level.levelNumber === 1) {
            checkIfLevel1IsCorrect();
        }
        if (level.type === "venn") {
            checkIfVennDiagramIsCorrect();
        }
        if (level.type === "syllogism") {
            checkIfSyllogismIsMet();
            checkIfAnyPropositionsAreMet();
        }
        if (level.type === "setTheory") {
            checkIfSetTheoryIsMet(level, level.correctPlacement[setTheoryCurrentStage]);
        }
        if (level.type === "emptySet") {
            checkIfEmptySetIsCorrect();
        }
        if (drag) {
            circleOutlineContext.clearRect(0, 0, canvasWidth, canvasHeight);

        }
        drag = false;
        dragId = -1;
    }

});

setupCanvases();
resizeCanvas();
$(".wrapper").hide();

if (retrievedObject != null) {
    $("#continueButton").visible();
}

document.getElementById("playerInputId").value = retrievedObject.playerName;