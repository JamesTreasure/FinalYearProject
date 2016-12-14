$(document).ready(function () {
// Canvas setup
    var cv = document.getElementById('cv');
    var context = cv.getContext('2d');
    var canvasWidth = cv.width,
        canvasHeight = cv.height;

    drawSomething();

    function drawSomething() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.fillStyle = '#0F0';
        context.fillRect(10, 20, 50, 50);
        context.fillRect(180, 200, 50, 50);
        context.fillRect(70, 100, 70, 70);
        context.fillStyle = '#F0F';
        context.fillRect(40, 180, 30, 50);
        context.fillRect(80, 100, 100, 50);
        context.fillRect(270, 100, 20, 70);
        context.fillRect(270, 100, 20, 70);

        context.arc(120, 50, 40, 0, 6.24);
        context.fill();
    }

    function getMousePos(cv, e) {
        var rect = cv.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }


    $(window).mousedown(function (e) {
        var pos = getMousePos(cv, e);
        WilliamMaloneFill(pos.x, pos.y);
    })

    var colorLayer = null;
    var startR = 0,
        startG = 0,
        startB = 0;

    var fillColorR = 230,
        fillColorG = 200,
        fillColorB = 50;

    function WilliamMaloneFill(startX, startY) {
        console.log(startX);
        console.log(startY);
        colorLayer = context.getImageData(0, 0, canvasWidth, canvasHeight);

        pixelPos = (startY * canvasWidth + startX) * 4;

        startR = colorLayer.data[pixelPos];
        startG = colorLayer.data[pixelPos + 1];
        startB = colorLayer.data[pixelPos + 2];

        var pixelStack = [
            [startX, startY]
        ];


        var drawingBoundTop = 0;
        var guard = 10000;
        while (pixelStack.length) {
            if (guard-- < 0) break;
            var newPos, x, y, pixelPos, reachLeft, reachRight;
            newPos = pixelStack.pop();
            x = newPos[0];
            y = newPos[1];

            pixelPos = (y * canvasWidth + x) * 4;
            while (y-- >= drawingBoundTop && matchStartColor(pixelPos)) {
                pixelPos -= canvasWidth * 4;
            }
            pixelPos += canvasWidth * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            while (y++ < canvasHeight - 1 && matchStartColor(pixelPos)) {
                colorPixel(pixelPos);

                if (x > 0) {
                    if (matchStartColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < canvasWidth - 1) {
                    if (matchStartColor(pixelPos + 4)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += canvasWidth * 4;
            }
        }
        context.putImageData(colorLayer, 0, 0);

    }

    function matchStartColor(pixelPos) {
        var r = colorLayer.data[pixelPos];
        var g = colorLayer.data[pixelPos + 1];
        var b = colorLayer.data[pixelPos + 2];

        return (r == startR && g == startG && b == startB);
    }

    function colorPixel(pixelPos) {
        colorLayer.data[pixelPos] = fillColorR;
        colorLayer.data[pixelPos + 1] = fillColorG;
        colorLayer.data[pixelPos + 2] = fillColorB;
        colorLayer.data[pixelPos + 3] = 255;
    }
});