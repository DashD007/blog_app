$(document).ready(function(){
  $("#forgetPassword").submit(function(e){
    e.preventDefault();

    $.ajax({
      url: `/api/v1/auth/forgot-password`,
      type: "POST",
      data: {
        email: $("#email").val(),
      },
      success: function(response) {
        $("#responseMessage").html(
          `<p id="successMessage">${response.message}</p>`
        );
        if(response.success) {
            window.location.href = `/forgot/verify?email=${$("#email").val()}`
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