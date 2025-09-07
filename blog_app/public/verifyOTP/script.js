function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
$(document).ready(function(){
    let email = getQueryParam("email");
    console.log(email);
    $("#email").empty();
    $("#email").val(email);
    $("#email").prop("disabled", true);

    $("#verifyOTP").submit(function(e){
        e.preventDefault();
        if($("#newPassword").val() !== $("#confirmPassword").val()){
            return $("#responseMessage").html(
                `<p id="errorMessage">Password doesn't match</p>`
            );
        }
        $.ajax({
        url: `/api/v1/auth/reset-password`,
        type: "POST",
        data: {
            email,
            otp:$("#otp").val(),
            newPassword: $("#newPassword").val()
        },
        success: function(response) {
            $("#responseMessage").html(
            `<p id="successMessage">${response.message}</p>`
            );
            if(response.success) {
                window.location.href = "/login"
            }
        },
        error: function(response) {
            $("#responseMessage").html(
            `<p id="errorMessage">${response.responseJSON?.message || "Invalid credentials"}</p>`
            );
        }
        });
    });
});