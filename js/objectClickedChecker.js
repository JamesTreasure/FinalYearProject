function textClickedOn(x, y, movableTextArray) {
    for (var i = 0; i < movableTextArray.length; i++) {
        var textWidth = context1.measureText(movableTextArray[i].text).width;
        if (x >= movableTextArray[i].x && x <= movableTextArray[i].x + textWidth && y >= (movableTextArray[i].y - 20) && y <= movableTextArray[i].y) {
            return i;
        }
    }
    return -1;
}

function imageClickedOn(x, y, movableTextArray) {
    for (var i = 0; i < movableTextArray.length; i++) {
        if (x >= movableTextArray[i].x && x <= movableTextArray[i].x + movableTextArray[i].width && y >= movableTextArray[i].y && y <= movableTextArray[i].y + movableTextArray[i].height) {
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
        console.log("edge clicked");
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
            var t0 = performance.now();
            floodFill.fill(x, y, 100, context1, null, null, 90)
            // paintLocation(x,y,0,0,0);
            var t1 = performance.now();
            var totalTime = t1-t0;
            console.log(totalTime);
        }
    } else {
        if (level.type === "setTheory" && setTheoryCurrentStage > 0) {
            clickedInArray.splice(clickedInArrayLocation, 1);
            context1.fillStyle = "white";
            floodFill.fill(x, y, 100, context1, null, null, 90)
            context1.fillStyle = setTheoryColours[setTheoryCurrentStage - 1];
            context1.globalAlpha = 0.5;
            floodFill.fill(x, y, 100, context1, null, null, 90)
            context1.globalAlpha = 1;
        } else {
            clickedInArray.splice(clickedInArrayLocation, 1);
            context1.fillStyle = "white";
            floodFill.fill(x, y, 100, context1, null, null, 90)
        }

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