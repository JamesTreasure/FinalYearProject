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

function setupMovableImageArray() {
    for (var i = 0; i < level.movableTextArray.length; i++) {
        level.movableTextArray[i].width = circlesArray[0].radius / 3;
        level.movableTextArray[i].height = circlesArray[0].radius / 3;

        var regions = canvasWidth / level.movableTextArray.length;
        var middleOfRegion = regions / 2;
        var middleOffSet = level.movableTextArray[i].width / 2;

        level.movableTextArray[i].y = (canvasHeight / 1.09);
        level.movableTextArray[i].x = ((i + 1) * regions) - middleOfRegion - middleOffSet;
    }

}

function setupCircles(circlesNeeded, canvasHeight) {
    if (circlesNeeded == 1) {
        var maxHeight = canvasHeight / 3;
        var radius = maxHeight / 2;
        var overlap = radius / 2;
        circlesArray.push(new Circle((canvasWidth / 2), (canvasHeight / 2), radius));
    }
    else if (circlesNeeded == 2) {
        var maxHeight = canvasHeight / 3;
        var radius = maxHeight / 2;
        var overlap = radius / 2;
        circlesArray.push(new Circle((canvasWidth / 2) - (overlap), (canvasHeight / 2), radius));
        circlesArray.push(new Circle((canvasWidth / 2) + (overlap), (canvasHeight / 2), radius));
    }
    else if (circlesNeeded === 3) {
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