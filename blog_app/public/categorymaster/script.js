$(document).ready(function () {
  // Sidebar toggle
  $(".menu-btn").click(function () {
    $("#sidebar").toggle();
    if ($("#sidebar").is(":visible")) {
      $("#main-content").css("margin-left", "240px");
    } else {
      $("#main-content").css("margin-left", "0");
    }
  });

  // Logout
  $("#logout-btn").click(function () {
    $.ajax({
      url: "/api/v1/auth/logout",
      method: "POST",
      success: function () {
        window.location.href = "/login";
      }
    });
  });

  $(".add-category").click(function () {
    if ($("#category-creation-dailog").is(":visible")) {
      $("#category-creation-dailog").css("display", "none");
    } else {
      $("#category-creation-dailog").css("display", "block");
    }
  });

  function fetchCategory(){
    $('#categoryTable').DataTable({
      responsive: true,
      autoWidth: true,
      processing: true,
      serverSide: false,
      ajax: {
        url: '/api/v1/category/list',
        type: 'GET',
        dataSrc: function (json) {
          $("#categoryCount").empty();
          $("#categoryCount").text(json.data.length);
          return json.data;
        }
      },
      columns: [
        { 
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + 1; 
          }
        },
        { data: 'name' },
        { 
          data: 'createdAt',
          render: function (data) {
            return new Date(data).toLocaleDateString();
          }
        }
      ],
      pageLength: 10,  // default rows per page
      lengthMenu: [5, 10, 20, 50], // dropdown options
    });
  }

  fetchCategory();


  $("#category-creation").submit(function(e){
    e.preventDefault();

    $.ajax({
      url: `/api/v1/category/create`,
      type: "POST",
      data: {
        name:$("#name").val(),
      },
      success: function(response) {
        console.log(response);
        if(response.success) {
          window.location.href = "/dashboard";
        }
      },
      error: function(error) {
        console.log(error,"123123");
      }
    });
  });
});