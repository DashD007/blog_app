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

  $(".add-user").click(function () {
    if ($("#user-creation-dailog").is(":visible")) {
      $("#user-creation-dailog").css("display", "none");
    } else {
      $("#user-creation-dailog").css("display", "block");
    }
  });

  $(".add-role").click(function () {
    if ($("#role-creation-dailog").is(":visible")) {
      $("#role-creation-dailog").css("display", "none");
    } else {
      $("#role-creation-dailog").css("display", "block");
    }
  });

  function fetchUserAndRoleCount(){
    $.ajax({
      url: "/api/v1/user/count",
      type: "GET",
      success: function(response) {
        let {data} = response; 
        $("#userCount").empty();
        $("#userCount").html(data.userCount);
        $("#roleCount").empty();
        $("#roleCount").html(data.roleCount);
      },
      error: function() {
        
      }
    });
  }

  function fetchUsersList(){
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
      columns: [
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
        }
      ],
      pageLength: 10,  // default rows per page
      lengthMenu: [5, 10, 20, 50], // dropdown options
    });
  }

  function fetchRolesList(){
    $('#roleTable').DataTable({
      responsive: true,
      autoWidth: true,
      processing: true,
      serverSide: false,
      ajax: {
        url: '/api/v1/role/list',
        type: 'GET',
        dataSrc: 'data'
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
      drawCallback: function(settings) {
        let api = this.api();
        let roles = api.rows({ page: 'current' }).data();
        console.log(roles);

        $("#role").empty();
        roles.each(role => {
          $("#role").append(`<option value="${role.id}">${role.name}</option>`)
        })
      }
    });

  }

  fetchUserAndRoleCount();
  fetchUsersList();
  fetchRolesList();


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


  // reusable update function
  function setupMultiSelect(containerId){
    function updateSelected(){
      const container = $(containerId);
      container.empty();
      const checked = container.closest(".dropdown").find("input:checked");

      if(checked.length === 0){
        container.append('<span class="placeholder text-muted">Select options...</span>');
      } else {
        checked.each(function(){
          const val = $(this).val();
          const chip = $(`<span class="chip">${val} <span class="remove">&times;</span></span>`);
          chip.find(".remove").click(() => {
            $(this).prop("checked", false).trigger("change");
          });
          container.append(chip);
        });
      }
    }
    $(containerId).closest(".dropdown").find("input[type=checkbox]").change(updateSelected);
  }

  // Initialize for 5 dropdowns
  setupMultiSelect("#users-permissions");
  setupMultiSelect("#roles-permissions");
  setupMultiSelect("#categories-permissions");
  setupMultiSelect("#blogs-permissions");


  $("#role-creation").submit(function(e){
    e.preventDefault();
    let permissions = [];
    $("#users-permissions").closest(".dropdown").find("input:checked").toArray().forEach(el=> permissions.push(el.value));
    $("#roles-permissions").closest(".dropdown").find("input:checked").toArray().forEach(el=> permissions.push(el.value));
    $("#categories-permissions").closest(".dropdown").find("input:checked").toArray().forEach(el=> permissions.push(el.value));
    $("#blogs-permissions").closest(".dropdown").find("input:checked").toArray().forEach(el=> permissions.push(el.value));
    
    console.log(permissions,"permissions 123123");

    $.ajax({
      url: `/api/v1/role/create`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        name:$("#name").val(),
        permissions,
      }),
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
  })
});