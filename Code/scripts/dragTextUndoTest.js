$(document).ready(function () {
    var layer1 = document.getElementById('layer1');
    var context1 = layer1.getContext('2d');
    var canvasWidth = layer1.width;
    var canvasHeight = layer1.height;
    var dragId;
    var dragOffsetX;
    var dragOffsetY;
    var drag = false;
    var font = '20pt san-serif';
    var movableTextArray = [];
    var moveText;

    var undoStack = [];
    var redoStack = [];
    var GameState = function (movableTextArray) {
        this.movableTextArray = movableTextArray;
    }
    var Text = function (x, y, width, height, content) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.content = content;
    }

    $(window).mousedown(function (e) {
        var pos = getMousePos(layer1, e);
        if (pos.x > 0 && pos.x < canvasWidth && pos.y > 0 && pos.y < 600) {
            var cloned = clone(movableTextArray);
            undoStack.push(new GameState(cloned));
            console.log("pushed");
        }
        var clickedOn = textClickedOn(pos.x, pos.y);
        if (clickedOn >= 0) {
            moveText = true;
            var textX = movableTextArray[clickedOn].x;
            var textY = movableTextArray[clickedOn].y;
            dragId = clickedOn;
            dragOffsetX = pos.x - textX;
            dragOffsetY = pos.y - textY;
            drag = true;
        }
    });

    $(window).mousemove(function (e) {
        var pos = getMousePos(layer1, e);
        if (moveText) {
            if (drag) {
                movableTextArray[dragId].x = pos.x - dragOffsetX;
                movableTextArray[dragId].y = pos.y - dragOffsetY;
                requestAnimationFrame(animate);
            }
        }
    });

    $(window).mouseup(function (e) {
        $("#stackSize").html(undoStack.length);
        var pos = getMousePos(layer1, e);
        drag = false;
        moveText = false;
        dragId = -1;

    });


    $("#undoButon").click(function () {
        undo();
    });
    $("#redoButton").click(function () {
        redo();
    });

    function main() {
        console.log("Main called");
        context1.fillStyle = "white";
        context1.fillRect(0, 0, layer1.width, layer1.height);
        setupMovableText();
        drawMovableText();
    }

    function undo() {
        redoStack.push(new GameState(movableTextArray));
        var previousGameState = undoStack.pop();
        movableTextArray = previousGameState.movableTextArray;
        drawMovableText();

    }

    function redo() {
        undoStack.push(new GameState(movableTextArray));
        var redoGameState = redoStack.pop();
        movableTextArray = redoGameState.movableTextArray;
        drawMovableText();

    }


    function animate() {
        $("#stackSize").html(undoStack.length);
        drawMovableText();
    }

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function setupMovableText() {
        context1.fillStyle = "#003300";
        context1.font = font;
        movableTextArray.push(new Text(null, null, null, null, "Test1"));
        movableTextArray.push(new Text(null, null, null, null, "Test2"));
        movableTextArray.push(new Text(null, null, null, null, "Test3"));
        for (var i = 0; i < movableTextArray.length; i++) {
            movableTextArray[i].width = context1.measureText(movableTextArray[i].text).width;
            movableTextArray[i].y = (canvasHeight / 1.09);
            var regions = canvasWidth / movableTextArray.length;
            var middleOfRegion = regions / 2;
            var middleOffSet = movableTextArray[i].width / 2;
            movableTextArray[i].x = ((i + 1) * regions) - middleOfRegion - middleOffSet;
            movableTextArray[i].height = 20;
        }

    }

    function drawMovableText() {
        context1.clearRect(0, 0, layer1.width, layer1.height)
        for (var i = 0; i < movableTextArray.length; i++) {
            context1.fillStyle = "#003300";
            context1.font = font;
            context1.fillText(movableTextArray[i].content, movableTextArray[i].x, movableTextArray[i].y);
        }
    }

    function textClickedOn(x, y) {
        for (var i = 0; i < movableTextArray.length; i++) {
            var textWidth = context1.measureText(movableTextArray[i].text).width;
            if (x >= movableTextArray[i].x && x <= movableTextArray[i].x + textWidth && y >= (movableTextArray[i].y - 20) && y <= movableTextArray[i].y) {
                return i;
            }
        }
        return -1;
    }

    function clone(obj) {
        if (obj == null || typeof(obj) != 'object') {
            return obj;
        }
        var temp = new obj.constructor();
        for (var key in obj) {
            temp[key] = clone(obj[key]);
        }
        return temp;
    }

    main();
})
;
