$(document).ready(function () {
    var canvas = $("#myCanvas");
    var context = canvas.get(0).getContext("2d");
    var circle = {};
    var drag = false;
    var circleMade = false;
    var canvasOffset = canvas.offset();

    function draw() {
        context.beginPath();
        context.arc(circle.X, circle.Y, circle.radius, 0, 2.0 * Math.PI);
        context.stroke();

    }

    $(window).mousedown(function (e) {

        circle.startX = e.pageX - canvasOffset.left;
        circle.startY = e.pageY - canvasOffset.top;

        circle.X = circle.startX;
        circle.Y = circle.startY;

        if (!circleMade) {
            circle.radius = 0;
        }

        drag = true;
    })

    $(window).mouseup(function (e) {
        drag = false;
        circleMade = true;
    })

    $(window).mousemove(function (e) {
        if (drag) {
            circle.X = e.pageX - canvasOffset.left;
            circle.Y = e.pageY - canvasOffset.top;
            if (!circleMade) {
                circle.radius = Math.sqrt(Math.pow((circle.X - circle.startX), 2) + Math.pow((circle.Y - circle.startY), 2));
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw();


        }
    })


});
