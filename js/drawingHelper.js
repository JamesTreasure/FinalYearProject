function drawStaticText() {
    if (levelComplete) {
        staticTextContext.globalAlpha = fadedAlphaLevel;
    }
    for (var i = 0; i < level.staticTextArray.length; i++) {
        if (i === 0 && majorPremiseMet) {
            staticTextContext.fillStyle = "#2ecc71";
        } else if (i === 1 && minorPremiseMet) {
            staticTextContext.fillStyle = "#2ecc71";
        } else {
            staticTextContext.fillStyle = "#003300";
        }

        staticTextContext.font = font;
        level.staticTextArray[i].width = (staticTextContext.measureText(level.staticTextArray[i].text).width);
        level.staticTextArray[i].x = ((layer1.width / 2) - (level.staticTextArray[i].width / 2));
        level.staticTextArray[i].y = (i * (canvasHeight / 30) + (canvasHeight / 6.5));
        level.staticTextArray[i].height = currentFontSize;

        if (i == level.staticTextArray.length - 1) {
            level.staticTextArray[i].y += (currentFontSize / 2);
        }

        if (level.type === "syllogism") {
            drawLineBetweenPremisesAndConclusion();
        }

        staticTextContext.fillText(level.staticTextArray[i].text, level.staticTextArray[i].x, level.staticTextArray[i].y);
    }
    staticTextContext.globalAlpha = 1;
}

function drawLineBetweenPremisesAndConclusion() {
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

function drawStaticTextForOneCircle(staticTextArray) {
    if (levelComplete) {
        context1.globalAlpha = fadedAlphaLevel;
    }
    context1.font = font;
    context1.fillStyle = "#1d1d1d";
    context1.font = font;
    staticTextArray[0].width = (context1.measureText(staticTextArray[0].text).width);
    staticTextArray[0].x = ((layer1.width / 2) - (staticTextArray[0].width / 2));
    staticTextArray[0].y = circlesArray[0].y - circlesArray[0].radius - (canvasHeight / 30);
    staticTextArray[0].height = currentFontSize;
    context1.fillText(staticTextArray[0].text, staticTextArray[0].x, staticTextArray[0].y);
    context1.globalAlpha = 1;
}

function drawStaticTextForMenMortalLevel(titleArray, staticTextArray) {
    if (levelComplete) {
        context1.globalAlpha = fadedAlphaLevel;
    }
    context1.font = font;
    context1.fillStyle = "#1d1d1d";
    context1.font = font;
    titleArray[0].width = (context1.measureText(titleArray[0].text).width);
    titleArray[0].x = ((layer1.width / 2) - (titleArray[0].width / 2));
    titleArray[0].y = (1 * (canvasHeight / 30) + (canvasHeight / 6.5));
    titleArray[0].height = currentFontSize;
    context1.fillText(titleArray[0].text, titleArray[0].x, titleArray[0].y);

    for (var i = 0; i < staticTextArray.length; i++) {
        context2.font = font;
        context2.fillStyle = "#1d1d1d";
        staticTextArray[i].width = (context1.measureText(staticTextArray[i].text).width);
        if (i === 0) {
            // staticTextArray[i].x = (layer1.width / 2) - staticTextArray[i].width - (layer1.width / 25);
            staticTextArray[i].x = circlesArray[0].x - staticTextArray[i].width - circlesArray[0].radius / 6;
        }
        if (i === 1) {
            staticTextArray[i].x = circlesArray[1].x + circlesArray[0].radius / 6;
        }
        staticTextArray[i].y = circlesArray[0].y - circlesArray[0].radius / 2;
        staticTextArray[i].height = currentFontSize;
        context2.fillText(staticTextArray[i].text, staticTextArray[i].x, staticTextArray[i].y);

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
        context1.strokeStyle = '#FF0000';
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

function drawDogs() {
    if (levelComplete) {
        context2.globalAlpha = fadedAlphaLevel;
    }
    context2.clearRect(0, 0, layer1.width, layer2.height);

    context2.drawImage(dog1, level.movableTextArray[0].x,
        level.movableTextArray[0].y, level.movableTextArray[0].width, level.movableTextArray[0].height);

    context2.drawImage(dog2, level.movableTextArray[1].x,
        level.movableTextArray[1].y, level.movableTextArray[1].width, level.movableTextArray[1].height);


    context2.drawImage(dog3, level.movableTextArray[2].x,
        level.movableTextArray[2].y, level.movableTextArray[2].width, level.movableTextArray[2].height);


    context2.globalAlpha = 1;
}