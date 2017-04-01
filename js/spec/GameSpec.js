describe("Array contains another array", function () {
    it("returns true", function () {

        var array1 = [
            {
                "circleClickedIn": [
                    1
                ],
                "x": 619,
                "y": 420
            }
        ];

        var array2 = [1];

        expect(arrayContainsAnotherArray(array1,array2)).toEqual(true);
    });
});

describe("Given x and y mouse coordinates", function () {
    it("imageClickedOn returns which image was clicked on", function () {

        var x = 714;
        var y = 702;

        var movableImageArray = [
            {
                "id": "dog1",
                "width": 41.11111111111111,
                "height": 41.11111111111111,
                "y": 678.8990825688073,
                "x": 219.44444444444446
            },
            {
                "id": "dog2",
                "width": 41.11111111111111,
                "height": 41.11111111111111,
                "y": 678.8990825688073,
                "x": 699.4444444444445
            },
            {
                "id": "dog3",
                "width": 41.11111111111111,
                "height": 41.11111111111111,
                "y": 678.8990825688073,
                "x": 1179.4444444444443
            }
        ];

        expect(imageClickedOn(x,y,movableImageArray)).toEqual(1);
    });
});

describe("Given image array and circle array", function () {
    it("sets up images", function () {

        var x = 714;
        var y = 702;
        var canvasWidth = 1920;
        var canvasHeight = 935;

        var circlesArray = [
            {
                "x": 960,
                "y": 467.5,
                "radius": 155.83333333333334
            }
        ]


        var movableImageArrayBefore =  [
            {
                "id": "dog1"
            },
            {
                "id": "dog2"
            },
            {
                "id": "dog3"
            }
        ]

        var movableImageArrayAfter = [
            {
                "id": "dog1",
                "width": 51.94444444444445,
                "height": 51.94444444444445,
                "y": 857.7981651376147,
                "x": 294.02777777777777
            },
            {
                "id": "dog2",
                "width": 51.94444444444445,
                "height": 51.94444444444445,
                "y": 857.7981651376147,
                "x": 934.0277777777778
            },
            {
                "id": "dog3",
                "width": 51.94444444444445,
                "height": 51.94444444444445,
                "y": 857.7981651376147,
                "x": 1574.0277777777778
            }
        ];

        var actual = setupMovableImageArray(movableImageArrayBefore, circlesArray, canvasWidth, canvasHeight)

        expect(movableImageArrayAfter).toEqual(actual);
    });
});