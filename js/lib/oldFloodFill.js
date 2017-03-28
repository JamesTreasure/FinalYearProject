function paintLocation(startX, startY, r, g, b) {
    var colorLayer = context1.getImageData(0, 0, canvasWidth, canvasHeight);
    var startR = 0,
        startG = 0,
        startB = 0;

    pixelPos = (startY * canvasWidth + startX) * 4;

    startR = colorLayer.data[pixelPos];
    startG = colorLayer.data[pixelPos + 1];
    startB = colorLayer.data[pixelPos + 2];

    //commenting out red check because it is being checked when the circle is clicked.
    // if (startR === 255 && startG === 0 && startB === 0) {
    //     return;
    // }

    var pixelStack = [
        [startX, startY]
    ];


    var drawingBoundTop = 0;
    var guard = 100000;
    while (pixelStack.length) {
        if (guard-- < 0) break;
        var newPos, x, y, pixelPos, reachLeft, reachRight;
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];

        pixelPos = (y * canvasWidth + x) * 4;
        while (y-- >= drawingBoundTop && matchStartColor(colorLayer, pixelPos, startR, startG, startB)) {
            pixelPos -= canvasWidth * 4;
        }
        pixelPos += canvasWidth * 4;
        ++y;
        reachLeft = false;
        reachRight = false;
        while (y++ < canvasHeight - 1 && matchStartColor(colorLayer, pixelPos, startR, startG, startB)) {
            colorPixel(colorLayer, pixelPos, r, g, b);

            if (x > 0) {
                if (matchStartColor(colorLayer, pixelPos - 4, startR, startG, startB)) {
                    if (!reachLeft) {
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < canvasWidth - 1) {
                if (matchStartColor(colorLayer, pixelPos + 4, startR, startG, startB)) {
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
    context1.putImageData(colorLayer, 0, 0);

}

function matchStartColor(colorLayer, pixelPos, startR, startG, startB) {
    var r = colorLayer.data[pixelPos];
    var g = colorLayer.data[pixelPos + 1];
    var b = colorLayer.data[pixelPos + 2];

    return (r == startR && g == startG && b == startB);
}

function colorPixel(colorLayer, pixelPos, r, g, b) {
    colorLayer.data[pixelPos] = r;
    colorLayer.data[pixelPos + 1] = g;
    colorLayer.data[pixelPos + 2] = b;
    colorLayer.data[pixelPos + 3] = 255;
}