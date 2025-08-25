
$(document).ready(function(){
  $("#loginForm").submit(function(e){
    e.preventDefault();

    $.ajax({
      url: `/api/v1/auth/login`,
      type: "POST",
      data: {
        email: $("#email").val(),
        password: $("#password").val()
      },
      success: function(response) {
        $("#responseMessage").html(
          `<p id="successMessage">${response.message}</p>`
        );
        if(response.success) {
          window.location.href = "/dashboard";
        }
      },
      error: function() {
        $("#responseMessage").html(
          `<p id="errorMessage">Invalid credentials</p>`
        );
      }
    });
  });
});
