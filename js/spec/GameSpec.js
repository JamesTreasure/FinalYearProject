//helper tests

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

        expect(arrayContainsAnotherArray(array1, array2)).toEqual(true);
    });
});

describe("When the clone function is given an object", function () {
    it("creates a duplicate object", function () {

        var testObject = [
            {
                "circleClickedIn": [
                    1
                ],
                "x": 619,
                "y": 420
            }
        ];

        var cloned = clone(testObject);

        expect(testObject).not.toBe(cloned);
    });
});

//drawingHelpers are hard to test because I can't test if something is drawn on Canvas

//setupDrawableObjects tests

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

        expect(imageClickedOn(x, y, movableImageArray)).toEqual(1);
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


        var movableImageArrayBefore = [
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

describe("Given a number of circles to setup", function () {
    it("sets up that many circles images", function () {

        var x = 714;
        var y = 702;
        var canvasWidth = 1920;
        var canvasHeight = 935;

        var circlesArray = [];

        var expected = [];
        expected.push(new Circle(960, 467.5, 155.83333333333334));

        var actual = setupCircles(1, canvasHeight, canvasWidth, circlesArray);

        expect(_.isEqual(actual, expected)).toEqual(true);
    });
});


describe("POST data to Google Sheets", function () {
    var id;
    var returnedSpreadsheetResponse;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    beforeEach(function (done) {
        var testSpreadsheetURL = "https://script.google.com/macros/s/AKfycbzJB6_HPPKzLWbG_rth3K3prvNgfV5ZLtxQtN7ISDjYwftL7jAT/exec";
        id = generateGuid();
        var myData = {
            "name": id,
            "level1time": 1,
            "level1moves": 1,
            "level2time": 2,
            "level2moves": 2,
            "level3time": 3,
            "level3moves": 3,
            "level4time": 4,
            "level4moves": 4,
            "level5time": 5,
            "level5moves": 5,
            "level6time": 6,
            "level6moves": 6,
            "level7time": 7,
            "level7moves": 7,
            "level8time": 8,
            "level8moves": 8,
            "level9time": 9,
            "level9moves": 9,
            "level10time": 10,
            "level10moves": 10,
            "level11time": 11,
            "level11moves": 11,
            "levelsSkipped": 0,
            "totalTime": 100
        };
        postData(myData, testSpreadsheetURL);
        done();

    });

    beforeEach(function (done) {
        var myCallback = function (error, options, response) {
            returnedSpreadsheetResponse = response.rows.length;
            done();
        };

        $('#spreadsheet').sheetrock({
            url: "https://docs.google.com/spreadsheets/d/1tXdVVOC5QnDm5zg-xAMfwrxFqX3cBAf8xnRwtWWl2Lk/edit#gid=0",
            query: "select B,Y,AD where B = '" + id + "' order by AB asc",
            labels: ['Name', 'Levels Skipped', 'Time'],
            fetchSize: 10,
            callback: myCallback
        });
    });

    it("Sheetrock.js can read data back", function () {
        expect(returnedSpreadsheetResponse).toEqual(2);
    });
});


function generateGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}