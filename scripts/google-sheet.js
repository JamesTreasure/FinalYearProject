// Variable to hold request
var request;

// Bind to the submit event of our form

function postData(data){
    var serializedData = $.param(data);

    // $inputs.prop("disabled", true);

    // Fire off the request to /form.php
    request = $.ajax({
        url: "https://script.google.com/macros/s/AKfycbxVGVxoQxNFK7_nxKfglL8yLNUmdPwP2e9j8IMO6JY5wzLEdSE/exec",
        type: "post",
        data: serializedData
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

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    // request.always(function () {
    //     // Reenable the inputs
    //     $inputs.prop("disabled", false);
    // });

    // Prevent default posting of form
    event.preventDefault();

}