function clone(object) {
    if (object == null || typeof(object) != 'object') {
        return object;
    }
    var temp = new object.constructor();
    for (var key in object) {
        temp[key] = clone(object[key]);
    }
    return temp;
}

function arrayContainsAnotherArray(array1, array2) {
    for (var i = 0; i < array1.length; i++) {
        if (array1[i].circleClickedIn.equals(array2)) {
            return true;
        }
    }
    return false;
}