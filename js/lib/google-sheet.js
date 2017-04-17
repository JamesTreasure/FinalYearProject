// Variable to hold request
var request;

// Bind to the submit event of our form

function postData(data, spreadsheetURL){
    var serializedData = $.param(data);

    request = $.ajax({
        url: spreadsheetURL,
        type: "post",
        data: serializedData,
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log("Hooray, it worked!");
        console.log(response);
        console.log(textStatus);
        console.log(jqXHR);
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
    });

    // Prevent default posting of form
    event.preventDefault();

}