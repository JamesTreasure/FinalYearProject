function level1Tutorial(levelNumber) {
    tutorialMode = true;
    $("#undoButton").invisible();
    $("#redoButton").invisible();
    $("#refreshButton").invisible();
    $("#tutorial").invisible();
    $("#skip").invisible();

    if (tutorialStage === 0) {
        $("#tutorialBackwards").invisible();
        $("#tutorialForwards").visible();
        tearDown();
        setupLevel(levelNumber);
        document.fonts.load('18pt "comicNeue"').then(renderText);
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
    }

    if (tutorialStage === 1) {
        $("#tutorialBackwards").visible();
        $("#tutorialForwards").visible();
        tearDown();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticTextForOneCircle(level.staticTextArray);

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = level.tutorialText[0];
        var maxWidth = canvasWidth / 6;
        var textX = circlesArray[0].x - circlesArray[0].radius - maxWidth;
        var textY = circlesArray[0].y;
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
        context1.fillStyle = "#1d1d1d";

        var startX = textX + (maxWidth / 2);
        var startY = lastY + (currentFontSize);


        var endpointX = canvasWidth / 2;
        var endpointY = canvasHeight / 2;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);

    }

    if (tutorialStage === 2) {
        $("#tutorialBackwards").visible();
        $("#tutorialForwards").invisible();
        tearDown();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticTextForOneCircle(level.staticTextArray);

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var segment = canvasWidth / 6;

        var text = "Drag the dogs below into the circle to add them to the set";


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
        dogs = true;
        tutorialMode = false;
        setupMovableImageArray();
        loadImages();
        drawDogs();
        isImageMovable = true;
        isTextMovable = false;
        $("#undoButton").visible();
        $("#redoButton").visible();
        $("#refreshButton").visible();
        $("#tutorial").visible();
        $("#skip").visible();
        $("#skip").visible();
    }

}

function level2Tutorial(levelNumber) {
    tutorialMode = true;
    $("#undoButton").invisible();
    $("#redoButton").invisible();
    $("#refreshButton").invisible();
    $("#tutorial").invisible();
    $("#skip").invisible();


    if (tutorialStage === 0) {
        $("#tutorialBackwards").visible();
        $("#tutorialForwards").visible();
        tearDown();
        setupLevel(levelNumber);
        setupMovableText();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();


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

    if (tutorialStage === 1) {
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

    if (tutorialStage === 2) {
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

    if (tutorialStage === 3) {
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
        $("#skip").visible();
        $("#skip").visible();
        $("#tutorialForwards").invisible();
    }


}

function level3Tutorial(levelNumber) {
    tutorialMode = true;
    $("#undoButton").invisible();
    $("#redoButton").invisible();
    $("#refreshButton").invisible();
    $("#tutorial").invisible();
    $("#skip").invisible();


    if (tutorialStage === 0) {
        $("#tutorialBackwards").invisible();
        $("#tutorialForwards").visible();
        setupLevel(levelNumber);
        tearDown();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
        tutorialCanvasContext.fillStyle = "#1d1d1d";
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
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = "Clicking in a segment will fill it black. This is how we represent the empty set.";
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
    }

    if (tutorialStage === 2) {
        $("#tutorialBackwards").visible();
        $("#tutorialForwards").visible();
        tearDown();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var staticTextArray =
            [
                {
                    "text": "Dogs that can fly"
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


        var text = "Here the set of dogs that can fly is empty because there are no flying dogs!";
        var segment = canvasWidth / 6;

        var maxWidth = segment;
        var textX = segment;
        var textY = (circlesArray[1].y + (circlesArray[1].radius));

        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);


        var startX = textX + (maxWidth / 2);
        var startY = textY - currentFontSize;

        var endpointX = circlesArray[0].x - circlesArray[0].radius / 2;
        var endpointY = circlesArray[0].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
        var x = circlesArray[0].x;
        var y = circlesArray[0].y - circlesArray[0].radius + (circlesArray[0].radius / 5);
        context1.fillStyle = "#2c3e50";
        floodFill.fill(Math.round(x), Math.round(y), 100, context1, null, null, 90);
    }

    if (tutorialStage === 3) {
        $("#tutorialBackwards").visible();
        $("#tutorialForwards").visible();
        tearDown();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var staticTextArray =
            [
                {
                    "text": "Dogs that can fly"
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


        var text = "And the set of flying dogs with 4 legs is also empty";

        var textWidth = (tutorialCanvasContext.measureText(text).width);
        var textX = ((canvasWidth / 2) - (textWidth / 2));
        var textY = (canvasHeight / 3) * 2 + (canvasHeight / 3 / 2);
        tutorialCanvasContext.fillText(text, textX, textY);

        var startX = textX + (textWidth / 2);
        var startY = textY - currentFontSize - 5;

        var endpointX = canvasWidth / 2;
        var endpointY = canvasHeight / 2;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = (startY + endpointY) / 2;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY + 40);
        var x = circlesArray[0].x;
        var y = circlesArray[0].y - circlesArray[0].radius + (circlesArray[0].radius / 5);
        context1.fillStyle = "#2c3e50";
        floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);
        floodFill.fill(Math.round(x), Math.round(y), 100, context1, null, null, 90);
    }

    if (tutorialStage === 4) {
        $("#tutorialBackwards").visible();
        $("#tutorialForwards").visible();
        tearDown();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        // setupLevel(levelNumber);
        drawStaticTextForVennDiagram(level.staticTextArray);
        setupMovableText();
        drawMovableText();

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = "Drag the numbers in to the correct place and fill in the empty set";
        var segment = canvasWidth / 6;

        var maxWidth = segment;
        var textX = circlesArray[1].x + circlesArray[1].radius;
        var textY = (circlesArray[1].y + (circlesArray[1].radius));

        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);

        var startX = textX + (maxWidth / 2);
        var startY = lastY + currentFontSize;

        var endpointX = canvasWidth / 2;
        var endpointY = level.movableTextArray[0].y - (currentFontSize * 2);

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);


        tutorialMode = false;
        $("#undoButton").visible();
        $("#redoButton").visible();
        $("#refreshButton").visible();
        $("#tutorial").visible();
        $("#skip").visible();
        $("#tutorialForwards").invisible();
    }
}

function level4Tutorial(levelNumber) {
    tutorialMode = true;
    $("#undoButton").invisible();
    $("#redoButton").invisible();
    $("#refreshButton").invisible();
    $("#tutorial").invisible();
    $("#skip").invisible();

    if (tutorialStage === 0) {
        $("#tutorialForwards").visible();
        $("#tutorialBackwards").invisible();
        tearDown();
        setupLevel(levelNumber);
        setupMovableText();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        context1.fillStyle = "white";
        floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);

        drawStaticTextForMenMortalLevel(level.titleArray, level.staticTextArray);

        tutorialCanvasContext.fillStyle = 'black';
        var text = "We can represent this statement using the two circles below";
        var maxWidth = canvasWidth / 6;
        var textX = level.titleArray[0].x + level.titleArray[0].width + maxWidth;
        var textY = circlesArray[0].y - circlesArray[0].radius;
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
        context1.fillStyle = "#1d1d1d";

        var startX = textX + (maxWidth / 2);
        var startY = textY - currentFontSize;

        var endpointX = level.titleArray[0].x + level.titleArray[0].width + currentFontSize;
        var endpointY = level.titleArray[0].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
    }

    if (tutorialStage === 1) {
        $("#tutorialBackwards").visible();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
        tutorialCanvasContext.fillStyle = 'black';
        var text = "This set represents all immortal men";
        var maxWidth = canvasWidth / 6;
        var textX = circlesArray[0].x - circlesArray[0].radius - maxWidth;
        var textY = circlesArray[0].y;
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
        context1.fillStyle = "#1d1d1d";


        var startX = textX + (maxWidth / 2);
        var startY = lastY + currentFontSize;

        var endpointX = circlesArray[0].x - circlesArray[0].radius / 2;
        var endpointY = circlesArray[0].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
        context1.fillStyle = "#3498db";
        floodFill.fill(Math.round(circlesArray[0].x - circlesArray[0].radius / 2), Math.round(circlesArray[0].y), 100, context1, null, null, 90);
    }

    if (tutorialStage === 2) {
        context1.fillStyle = "white";
        floodFill.fill(Math.round(circlesArray[0].x - circlesArray[0].radius / 2), Math.round(circlesArray[0].y), 100, context1, null, null, 90);
        $("#tutorialForwards").visible();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
        tutorialCanvasContext.fillStyle = 'black';

        var text = "This set represents anything that is mortal";
        var textWidth = (tutorialCanvasContext.measureText(text).width);
        var maxWidth = canvasWidth / 6;
        var textX = circlesArray[1].x + circlesArray[1].radius + maxWidth / 6;
        var textY = circlesArray[1].y;
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);

        var startX = textX;
        var startY = lastY + (currentFontSize / 2);

        var endpointX = circlesArray[1].x + circlesArray[1].radius / 2;
        var endpointY = circlesArray[1].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = (startY + endpointY) / 2;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY + 40);

        tutorialCanvasContext.fillStyle = 'black';
        var text = "This set represents all immortal men";
        var maxWidth = canvasWidth / 6;
        var textX = circlesArray[0].x - circlesArray[0].radius - maxWidth;
        var textY = circlesArray[0].y;
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
        context1.fillStyle = "#1d1d1d";


        var startX = textX + (maxWidth / 2);
        var startY = lastY + currentFontSize;

        var endpointX = circlesArray[0].x - circlesArray[0].radius / 2;
        var endpointY = circlesArray[0].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
        context1.fillStyle = "#3498db";
        floodFill.fill(Math.round(circlesArray[1].x + circlesArray[1].radius / 2), Math.round(circlesArray[1].y), 100, context1, null, null, 90);
    }

    if (tutorialStage === 3) {
        context1.fillStyle = "white";
        floodFill.fill(Math.round(circlesArray[1].x + circlesArray[1].radius / 2), Math.round(circlesArray[1].y), 100, context1, null, null, 90);

        $("#tutorialForwards").visible();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
        tutorialCanvasContext.fillStyle = 'black';
        var text = "This represents the set of mortal men";
        var textWidth = (tutorialCanvasContext.measureText(text).width);
        var textX = ((canvasWidth / 2) - (textWidth / 2));
        var textY = (canvasHeight / 3) * 2 + (canvasHeight / 3 / 2);
        tutorialCanvasContext.fillText(text, textX, textY);


        context1.fillStyle = "#3498db";
        floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);

        var startX = textX + (textWidth / 2);
        var startY = textY - currentFontSize - 5;

        var endpointX = canvasWidth / 2;
        var endpointY = circlesArray[0].y + circlesArray[0].radius;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = (startY + endpointY) / 2;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY + 40);

        tutorialCanvasContext.fillStyle = 'black';

        var text = "This set represents anything that is mortal";
        var textWidth = (tutorialCanvasContext.measureText(text).width);
        var maxWidth = canvasWidth / 6;
        var textX = circlesArray[1].x + circlesArray[1].radius + maxWidth / 6;
        var textY = circlesArray[1].y;
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);

        var startX = textX;
        var startY = lastY + (currentFontSize / 2);

        var endpointX = circlesArray[1].x + circlesArray[1].radius / 2;
        var endpointY = circlesArray[1].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = (startY + endpointY) / 2;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY + 40);

        tutorialCanvasContext.fillStyle = 'black';
        var text = "This set represents all immortal men";
        var maxWidth = canvasWidth / 6;
        var textX = circlesArray[0].x - circlesArray[0].radius - maxWidth;
        var textY = circlesArray[0].y;
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
        context1.fillStyle = "#1d1d1d";

        var startX = textX + (maxWidth / 2);
        var startY = lastY + currentFontSize;

        var endpointX = circlesArray[0].x - circlesArray[0].radius / 2;
        var endpointY = circlesArray[0].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);
    }

    if (tutorialStage === 4) {
        context1.fillStyle = "white";
        floodFill.fill(Math.round(canvasWidth / 2), Math.round(canvasHeight / 2), 100, context1, null, null, 90);

        tutorialCanvasContext.fillStyle = 'black';
        var text = "Fill in the empty set to make the sentence true";
        var maxWidth = canvasWidth / 6;
        var textX = level.titleArray[0].x + level.titleArray[0].width + maxWidth;
        var textY = circlesArray[0].y - circlesArray[0].radius;
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, canvasWidth / 6, currentFontSize);
        context1.fillStyle = "#1d1d1d";

        var startX = textX + (maxWidth / 2);
        var startY = textY - currentFontSize;

        var endpointX = level.titleArray[0].x + level.titleArray[0].width + currentFontSize;
        var endpointY = level.titleArray[0].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) + canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);

        tutorialMode = false;
        $("#undoButton").visible();
        $("#redoButton").visible();
        $("#refreshButton").visible();
        $("#tutorial").visible();
        $("#skip").visible();
        $("#tutorialForwards").invisible();
        tutorialStage = 0;
    }
}

function level5Tutorial(levelNumber) {
    tutorialMode = true;
    $("#undoButton").invisible();
    $("#redoButton").invisible();
    $("#refreshButton").invisible();
    $("#tutorial").invisible();
    $("#skip").invisible();

    if (tutorialStage === 0) {
        $("#tutorialBackwards").invisible();
        $("#tutorialForwards").visible();
        tearDown();
        setupLevel(levelNumber);
        setupCircles(level.circlesNeeded, canvasHeight);
        drawStaticText();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
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
        setupCircles(level.circlesNeeded, canvasHeight);
        drawStaticText();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
        var text2 = "The first two lines are called premises.";
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
        setupCircles(level.circlesNeeded, canvasHeight);
        drawStaticText();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
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
        setupMovableText();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticText();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
        var text = "So now we have three sets.";
        var textWidth = tutorialCanvasContext.measureText(text).width;
        var textX = circlesArray[1].x - circlesArray[1].radius - textWidth;
        var textY = (canvasHeight / 4);
        tutorialCanvasContext.fillText(text, textX, textY);

    }
    if (tutorialStage === 4) {
        tearDown();
        setupMovableText();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticText();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
        var text = "Remember, to represent the empty set just click in the circle.";
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
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticText();
        drawMovableText();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        var segment = canvasWidth / 6;

        var text = "Drag each word into its own circle to represent the set";


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

        tutorialMode = false;
        $("#tutorialForwards").invisible();
        $("#tutorialBackwards").visible();
        $("#undoButton").visible();
        $("#redoButton").visible();
        $("#refreshButton").visible();
        $("#tutorial").visible();
        $("#skip").visible();
        $("#tutorialForwards").invisible();
    }

    if (tutorialStage === 6) {
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);


        var text2 = "Fill in the empty set to make the first line true";
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

        tutorialMode = false;
        $("#undoButton").visible();
        $("#redoButton").visible();
        $("#refreshButton").visible();
        $("#tutorial").visible();
        $("#skip").visible();
        $("#tutorialForwards").invisible();
    }

    if (tutorialStage === 7) {

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

        var text2 = "Now fill in the empty set to show the second line is true";
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
        $("#skip").visible();
        $("#tutorialForwards").invisible();
    }

    if (tutorialStage === 8) {
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        var text2 = "By showing the first two lines the conclusion is automatically true";
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

        $("#undoButton").visible();
        $("#redoButton").visible();
        $("#refreshButton").visible();
        $("#tutorial").visible();
        $("#skip").visible();
        $("#tutorialForwards").visible();
    }
}

function level6Tutorial(levelNumber) {
    tutorialMode = true;
    $("#undoButton").visible();
    $("#redoButton").visible();
    $("#refreshButton").visible();
    $("#tutorial").visible();
    $("#skip").visible();
    $("#tutorialForwards").invisible();

    if (tutorialStage === 0) {
        tearDown();
        setupLevel(levelNumber);
        setupCircles(level.circlesNeeded, canvasHeight);
        drawStaticText();
        drawCircles();
        setupMovableText();
        drawMovableText();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = "Use what you learnt in the previous level to complete this syllogism";
        var maxWidth = canvasWidth / 6;
        var textWidth = tutorialCanvasContext.measureText(text).width;
        var textX = circlesArray[2].x + circlesArray[2].radius;
        var textY = (canvasHeight / 4 + (canvasHeight / 8));
        var lastY = wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);

        var startX = textX + (maxWidth / 2);
        var startY = textY - currentFontSize;

        var endpointX = level.staticTextArray[1].x + level.staticTextArray[1].width + (canvasWidth / 60);
        var endpointY = level.staticTextArray[1].y;

        var midpointX = (startX + endpointX) / 2;
        var midpointY = ((startY + endpointY) / 2) - canvasHeight / 24;

        drawCurvedArrow(startX, startY, endpointX, endpointY, midpointX, midpointY);

        tutorialMode = false;
    }

}

function level7Tutorial(levelNumber) {
    tutorialMode = true;
    $("#undoButton").invisible();
    $("#redoButton").invisible();
    $("#refreshButton").invisible();
    $("#tutorial").invisible();
    $("#skip").invisible();

    if (tutorialStage === 0) {
        $("#tutorialBackwards").invisible();
        $("#tutorialForwards").visible();
        tearDown();
        setupLevel(levelNumber);
        setupMovableText();
        drawStaticText();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
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
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawMovableText();
        drawStaticText();


        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
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
        $("#skip").visible();
        $("#tutorialForwards").invisible();

    }

}

function level9Tutorial(levelNumber) {
    tutorialMode = true;
    $("#undoButton").invisible();
    $("#redoButton").invisible();
    $("#refreshButton").invisible();
    $("#tutorial").invisible();
    $("#skip").invisible();

    if (tutorialStage === 0) {
        $("#tutorialBackwards").invisible();
        $("#tutorialForwards").visible();
        tearDown();
        setupLevel(levelNumber);
        setupMovableText();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticTextForVennDiagram(level.staticTextArray);

        tutorialCanvasContext.font = font;
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
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticTextForVennDiagram(level.staticTextArray);

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
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
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticTextForVennDiagram(level.staticTextArray);

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;
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
        $("#skip").visible();
    }
}

function level10And11Tutorial() {
    tutorialMode = true;
    $("#undoButton").invisible();
    $("#redoButton").invisible();
    $("#refreshButton").invisible();
    $("#tutorial").invisible();
    $("#skip").invisible();

    if (tutorialStage === 0) {
        $("#tutorialBackwards").invisible();
        $("#tutorialForwards").visible();
        tearDown();
        setupLevel(setTheoryLevel);
        setupMovableText();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticText();

        // tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = level.tutorialText[0];
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
        $("#skip").visible();
        tearDown();
        setupMovableText();
        drawMovableText();
        setupCircles(level.circlesNeeded, canvasHeight);
        drawCircles();
        drawStaticText();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = level.tutorialText[1];
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
        $("#skip").visible();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = level.tutorialText[2];
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
        $("#skip").visible();
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = level.tutorialText[3];
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
