$("#startButton").click(function () {
    start();
});

$("#tutorialForwards").click(function () {

    if (level.levelNumber === 1) {
        tutorialStage++;
        level1Tutorial(1);
        return;
    }
    if (level.levelNumber === 4) {
        tutorialStage++;
        level4Tutorial(4);
        return;
    }
    if (level.type === "venn") {
        tutorialStage++;
        level2Tutorial(2);
        return;
    }
    if (level.type === "syllogism" && level.particularSyllogism === false) {
        if (tutorialStage === 8) {
            tutorialStage = 0;
            setupNextLevel();
        } else {
            tutorialStage++;
            level5Tutorial(5);
        }
    } else if (level.type === "syllogism" && level.particularSyllogism) {
        tutorialStage++;
        level7Tutorial(7);
    }
    if (level.type === "unionIntersectionTutorial") {
        if (!tutorialMode) {
            $("#tutorialForwards").invisible();
            $("#tutorialBackwards").invisible();
            tearDown();
            tutorialStage = 0;
            var nextLevel = level.levelNumber + 1;
            main(nextLevel);
        } else {
            tutorialStage++;
            level9Tutorial(8);
        }
    }
    if (level.type === "setTheory") {
        tutorialStage++;
        level10And11Tutorial(level.levelNumber);
        return;
    }
    if (level.type === "emptySet") {
        tutorialStage++;
        level3Tutorial();
        return;
    }
});

$("#tutorialBackwards").click(function () {
    if (level.levelNumber === 1) {
        tutorialStage--;
        level1Tutorial(1);
        return;
    }
    if (level.levelNumber === 4) {
        tutorialStage--;
        level4Tutorial(4);
        return;
    }
    if (level.type === "venn") {
        tutorialStage--;
        level2Tutorial(2);
        return;
    }
    if (level.type === "syllogism" && level.particularSyllogism === false) {
        tutorialStage--;
        level5Tutorial(5);
    } else if (level.type === "syllogism" && level.particularSyllogism) {
        tutorialStage--;
        level7Tutorial(7);
    }
    if (level.type === "setTheory") {
        tutorialStage++;
        level9Tutorial(8);
    }
    if (level.type === "emptySet") {
        tutorialStage--;
        level3Tutorial();
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
    tutorialStage = 0;
    main(level.levelNumber);
    $("#nextLevelButton").invisible();
});

$("#nextLevelButton").click(function () {
    setupNextLevel();
});

$("#skip").click(function () {
    levelsSkipped.push(level.levelNumber);
    tutorialMode = false;
    tearDown();
    majorPremiseMet = false;
    minorPremiseMet = false;
    var currentLevel = level.levelNumber;
    var nextLevel = currentLevel + 1;
    console.log("Current level number is " + nextLevel);
    if (nextLevel === 12) {
        gameCompleteScreen();
    } else {
        tutorialStage = 0;
        setupNextLevel();
    }
    $("#nextLevelButton").invisible();
});

$("#continueButton").click(function () {
    continueGame();
});

$("#leaderboard").click(function () {
    $(".launchPage").remove();
    setupLeaderboard();
});

$('form').submit(function () {
    return start();
});