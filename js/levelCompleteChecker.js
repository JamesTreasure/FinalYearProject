function checkIfLevel1IsCorrect() {
    console.log("Checking...");
    for (var i = 0; i < level.movableTextArray.length; i++) {
        var inCircle = whichCircleIsPremiseIn(level.movableTextArray[i]);
        if (inCircle === null) {
            return false;
        }
    }
    if (!levelComplete) {
        levelComplete = true;
        isTextMovable = true;
        isImageMovable = false;
        levelCompleteScreen();
        level1endTime = performance.now();
    }
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
    if (clickedInArray.length > 0) {
        correctEmptyLocation = (clickedInArray[0].circleClickedIn.equals([0, 1]) && clickedInArray.length === 1);
    }

    if (tempCircle1.equals(level.circle1) && tempCircle2.equals(level.circle2) && tempIntersection.equals(level.intersection)) {
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        tutorialCanvasContext.font = font;

        var text = "Remember to fill in the empty set!";
        var textWidth = (tutorialCanvasContext.measureText(text).width);
        var maxWidth = canvasWidth / 6;
        var textX = canvasWidth / 6;
        var textY = (circlesArray[0].y + (circlesArray[0].radius / 2));
        wrapText(tutorialCanvasContext, text, textX, textY, maxWidth, currentFontSize);


        if (!levelComplete && correctEmptyLocation) {
            tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            levelComplete = true;
            levelCompleteScreen();
        }
    }
}

function checkIfMenMortalIsCorrect() {
    var correctEmptyLocation = false;
    if (clickedInArray.length > 0) {
        correctEmptyLocation = (clickedInArray[0].circleClickedIn.equals([0]) && clickedInArray.length === 1);
    }
    if (!levelComplete && correctEmptyLocation) {
        tutorialCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
        levelComplete = true;
        levelCompleteScreen();
    }

}

function checkPremiseAllInTheirOwnCircle() {
    var middle = whichCircleIsPremiseIn(level.movableTextArray[0]);
    var predicate = whichCircleIsPremiseIn(level.movableTextArray[1]);
    var subject = whichCircleIsPremiseIn(level.movableTextArray[2]);

    if (middle == null || predicate == null || subject == null) {
        return false
    } else {
        return !(middle.equals(predicate) || middle.equals(subject) || predicate.equals(subject));

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
    console.log(checkPremiseAllInTheirOwnCircle());

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
            if (level.levelNumber === 5) {
                tutorialStage++;
                level5Tutorial(5);
            }
            if (level.levelNumber === 6) {
                levelComplete = true;
                levelCompleteScreen();
            }
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
            level9And10Tutorial();
        } else {
            isTextMovable = true;
            setTheoryCurrentStage = 0;
            tutorialStage = 0;
            if (level.levelNumber === 10) {
                gameCompleteScreen();
            } else {
                levelCompleteScreen();
            }
            // gameCompleteScreen();
            // var confetti = createConfetti();
            // requestAnimationFrame(drawConfetti(confetti));
            // setTimeout(drawConfetti, 20);
        }
    }
}

function checkIfMajorPremiseIsMet() {
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
    return majorPremiseMet;
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