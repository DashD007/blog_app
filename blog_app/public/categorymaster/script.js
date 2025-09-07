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


   // Close on ESC
  $(document).on("keydown", function(e) {
    if (e.key === "Escape" && $("#category-creation-dailog").is(":visible")) {
      $("#category-creation-dailog").css("display", "none");
      $("#detail-card-container").css("display", "grid");
      $("#categorymaster-container").css("display", "flex");
    }
  });

  $(".add-category").click(function () {
    if ($("#category-creation-dailog").is(":visible")) {
      $("#category-creation-dailog").css("display", "none");
      $("#detail-card-container").css("display", "grid");
      $("#categorymaster-container").css("display", "flex");
    } else {
      $("#category-creation-dailog").css("display", "block");
      $("#detail-card-container").css("display", "none");
      $("#categorymaster-container").css("display", "none");
    }
  });

  function fetchCategory(){
    let columns = [
      { 
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1; 
        }
      },
      { data: "name" },
      { 
        data: "createdAt",
        render: function(data) {
          return new Date(data).toLocaleDateString();
        }
      }
    ];

    // ✅ Add Actions column only if user has any of these permissions
    if (userPermissions.includes("category.update") || userPermissions.includes("category.delete")) {
      columns.push({
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          let buttons = "";

          if (userPermissions.includes("category.update")) {
            buttons += `
              <button class="btn btn-sm btn-primary editBtn" data-id="${row.id}">
                <i class="bi bi-pencil"></i> Edit
              </button>
            `;
          }

          if (userPermissions.includes("category.delete")) {
            buttons += `
              <button class="btn btn-sm btn-danger deleteBtn" data-id="${row.id}">
                <i class="bi bi-trash"></i> Delete
              </button>
            `;
          }

          return buttons;
        }
      });
    }

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
      columns:columns,
      pageLength: 10,  // default rows per page
      lengthMenu: [5, 10, 20, 50], // dropdown options
    });
  }

  fetchCategory();

  var myModal = new bootstrap.Modal(document.getElementById('formModal'));
  var deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

  $(document).on("click", ".editBtn", function() {
    let id = $(this).data("id");
    $("#hiddenId").val(id);
    myModal.show();
  });

  $(document).on("click", ".deleteBtn", function() {
    let id = $(this).data("id");
    $("#hiddenIdInDeleteModal").val(id);
    deleteModal.show();
  });

  $("#modalForm").on("submit", function(e) {
    e.preventDefault();
    let formData = {};
    $.each($(this).serializeArray(), function(_, field) {
      formData[field.name] = field.value;
    });
    
    $.ajax({
      url: `/api/v1/category/update`,
      type: "PATCH",
      data: formData,
      success: function(response) {
        if(response.success) {
          location.reload();
        }
      },
      error: function(error) {

      }
    });
    myModal.hide();
    this.reset();
  });

  $("#deleteForm").on("submit", function(e) {
    e.preventDefault();
    let formData = {};
    $.each($(this).serializeArray(), function(_, field) {
      formData[field.name] = field.value;
    });
    $.ajax({
      url: `/api/v1/category/delete`,
      type: "DELETE",
      data: formData,
      success: function(response) {
        if(response.success) {
          location.reload();
        }
      },
      error: function(error) {

      }
    });
    myModal.hide();
    this.reset();
  });

  

  $("#category-creation").submit(function(e){
    e.preventDefault();

    $.ajax({
      url: `/api/v1/category/create`,
      type: "POST",
      data: {
        name:$("#name").val(),
      },
      success: function(response) {
        if(response.success) {
          location.reload();
        }
      },
      error: function(error) {

      }
    });
  });
});