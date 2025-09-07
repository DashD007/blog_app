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
    if (e.key === "Escape" && $("#user-creation-dailog").is(":visible")) {
      $("#user-creation-dailog").css("display", "none");
      $("#detail-card-container").css("display", "grid");
      $("#usermaster-container").css("display", "flex");
    }
  });


  $(".add-user").click(function () {
    if ($("#user-creation-dailog").is(":visible")) {
      $("#user-creation-dailog").css("display", "none");
      $("#detail-card-container").css("display", "grid");
      $("#usermaster-container").css("display", "flex");
    } else {
      $("#user-creation-dailog").css("display", "block");
      $("#detail-card-container").css("display", "none");
      $("#usermaster-container").css("display", "none");
    }
  });


  function fetchUsersList(){
    const columns = [
        { 
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + 1; 
          }
        },
        { data: 'username' },
        { data: 'email' },
        { data: 'role' },
        { 
          data: 'createdAt',
          render: function (data) {
            return new Date(data).toLocaleDateString();
          }
        },
      ];
    // ✅ Add Actions column only if user has any of these permissions
    if (userPermissions.includes("user.update") || userPermissions.includes("user.delete")) {
      columns.push({
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          let buttons = "";

          if (userPermissions.includes("user.update")) {
            buttons += `
              <button class="btn btn-sm btn-primary editBtn" data-id="${row.id}">
                <i class="bi bi-pencil"></i> Edit
              </button>
            `;
          }

          if (userPermissions.includes("user.delete")) {
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
    $('#userTable').DataTable({
      responsive: true,
      autoWidth: true,
      processing: true,
      serverSide: false,
      ajax: {
        url: '/api/v1/user/list',
        type: 'GET',
        dataSrc: 'data'
      },
      columns: columns,
      pageLength: 10,  // default rows per page
      lengthMenu: [5, 10, 20, 50], // dropdown options
      drawCallback: function(settings) {
        let api = this.api();
        let users = api.rows({ page: 'current' }).data();
        $("#userCount").empty();
        $("#userCount").html(users.length || 0);
        
      }
    });
  }

  function fetchRolesList() {
      $.ajax({
        url: "/api/v1/role/list",
        type: "GET",
        success: function(response) {
          const {data} = response;
          data.forEach((role) => {
            $(".select-role").append(`<option value="${role.id}">${role.name}</option>`);
          });
        },
        error : function(){

        }
      });
  }

  fetchRolesList();

  // fetchUserAndRoleCount();
  fetchUsersList();
  
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
      url: `/api/v1/user/update`,
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
      url: `/api/v1/user/delete`,
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


  $("#user-creation").submit(function(e){
    e.preventDefault();

    $.ajax({
      url: `/api/v1/auth/register`,
      type: "POST",
      data: {
        username:$("#username").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        roleId:$("#role").val(),
      },
      success: function(response) {
        if(response.success) {
          location.reload();
        }
      },
      error: function(error) {
        console.log(error,"123123");
      }
    });
  });


  
});