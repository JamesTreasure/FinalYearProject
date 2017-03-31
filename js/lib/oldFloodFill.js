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

    //first x and y location of click is added to a stack
    var pixelStack = [
        [startX, startY]
    ];


    var drawingBoundTop = 0;
    //guard stops any infinite loop issues
    var guard = 100000;

    //while the stack is not empty
    while (pixelStack.length) {
        if (guard-- < 0) break;
        var newPos, x, y, pixelPos, reachLeft, reachRight;

        //get pixel from stack
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];

        //some math to get pixel position
        pixelPos = (y * canvasWidth + x) * 4;

        //travel upwards until top is reached and pixel colour is same as start colour
        while (y-- >= drawingBoundTop && matchStartColor(colorLayer, pixelPos, startR, startG, startB)) {
            pixelPos -= canvasWidth * 4;
        }

        //now top is reached, travel downwards one pixel
        pixelPos += canvasWidth * 4;
        ++y;


        reachLeft = false;
        reachRight = false;

        //travel downwards until bottom or canvas is reached or colour is different from start colour
        while (y++ < canvasHeight - 1 && matchStartColor(colorLayer, pixelPos, startR, startG, startB)) {

            //colour pixel with new colour
            colorPixel(colorLayer, pixelPos, r, g, b);

            //if x is not at left hand boundary
            if (x > 0) {
                //if the colour of the pixel to the left is same as start colour
                if (matchStartColor(colorLayer, pixelPos - 4, startR, startG, startB)) {
                    //if boolean reachLeft has not yet been set to true
                    if (!reachLeft) {
                        //add this pixel to stack and set reachLeft to true
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            //if x is not at right hand boundary
            if (x < canvasWidth - 1) {
                //if the colour of the pixel to the right is same as start colour
                if (matchStartColor(colorLayer, pixelPos + 4, startR, startG, startB)) {
                    //if boolean reachRight has not yet been set to true
                    if (!reachRight) {
                        //add this pixel to stack and set reachLeft to true
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }
            //move one pixel down
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