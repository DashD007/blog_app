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
      },
    });
  });

  // Close on ESC
  $(document).on("keydown", function(e) {
    if (e.key === "Escape" && $("#role-creation-dailog").is(":visible")) {
      $("#role-creation-dailog").css("display", "none");
      $("#detail-card-container").css("display", "grid");
      $("#usermaster-container").css("display", "flex");
    }
  });

  $(".add-role").click(function () {
    if ($("#role-creation-dailog").is(":visible")) {
      $("#role-creation-dailog").css("display", "none");
      $("#detail-card-container").css("display", "grid");
      $("#usermaster-container").css("display", "flex");
    } else {
      $("#role-creation-dailog").css("display", "block");
      $("#detail-card-container").css("display", "none");
      $("#usermaster-container").css("display", "none");
    }
  });

  function fetchRolesList() {
    const columns = [
        {
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + 1;
          },
        },
        { data: "name" },
        {
          data: "createdAt",
          render: function (data) {
            return new Date(data).toLocaleDateString();
          },
        },
      ];
      // ✅ Add Actions column only if user has any of these permissions
    if (userPermissions.includes("role.update") || userPermissions.includes("role.delete")) {
      columns.push({
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          let buttons = "";

          if (userPermissions.includes("role.update")) {
            buttons += `
              <button class="btn btn-sm btn-primary editBtn" data-id="${row.id}">
                <i class="bi bi-pencil"></i> Edit
              </button>
            `;
          }

          if (userPermissions.includes("role.delete")) {
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

    $("#roleTable").DataTable({
      responsive: true,
      autoWidth: true,
      processing: true,
      serverSide: false,
      ajax: {
        url: "/api/v1/role/list",
        type: "GET",
        dataSrc: "data",
      },
      columns: columns,
      pageLength: 10, // default rows per page
      lengthMenu: [5, 10, 20, 50], // dropdown options
      drawCallback: function (settings) {
        let api = this.api();
        let roles = api.rows({ page: "current" }).data();
        console.log(roles.length);
        $("#roleCount").empty();
        $("#roleCount").html(roles.length);
        $("#role").empty();
        roles.each((role) => {
          $("#role").append(`<option value="${role.id}">${role.name}</option>`);
        });
      },
    });
  }

  fetchRolesList();

  // reusable update function
  function setupMultiSelect(containerId) {
    function updateSelected() {
      const container = $(containerId);
      container.empty();
      const checked = container.closest(".dropdown").find("input:checked");

      if (checked.length === 0) {
        container.append(`<div class="multiselect-container form-control w-100"  id="users-permissions" data-bs-toggle="dropdown" aria-expanded="false">
              <div class="px-3 w-100" style="display: flex; justify-content: space-between; align-items: center;">
                <span class="text-muted">Select options...</span>
                <span class="text-muted" style="font-size: 24px;">˅</span>
              </div>
            </div>`);
      } else {
        checked.each(function () {
          const chip = $(
            `<span class="chip">${this.id} <span class="remove">&times;</span></span>`
          );
          chip.find(".remove").click(() => {
            $(this).prop("checked", false).trigger("change");
          });
          container.append(chip);
        });
      }
    }
    $(containerId)
      .closest(".dropdown")
      .find("input[type=checkbox]")
      .change(updateSelected);
  }

  // Initialize for 5 dropdowns
  setupMultiSelect(".users-permissions");
  setupMultiSelect(".roles-permissions");
  setupMultiSelect(".categories-permissions");
  setupMultiSelect(".blogs-permissions");


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

    let permissions = [];
      $(".users-permissions")
        .closest(".dropdown")
        .find("input:checked")
        .toArray()
        .forEach((el) => permissions.push(el.value));
      $(".roles-permissions")
        .closest(".dropdown")
        .find("input:checked")
        .toArray()
        .forEach((el) => permissions.push(el.value));
      $(".categories-permissions")
        .closest(".dropdown")
        .find("input:checked")
        .toArray()
        .forEach((el) => permissions.push(el.value));
      $(".blogs-permissions")
        .closest(".dropdown")
        .find("input:checked")
        .toArray()
        .forEach((el) => permissions.push(el.value));
    formData.permissions = permissions;
    $.ajax({
      url: `/api/v1/role/update`,
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
      url: `/api/v1/role/delete`,
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

  $("#formModal").on("hidden.bs.modal", function () {
    $(".dropdown input[type=checkbox]").prop("checked", false).trigger("change");
  });

  $("#role-creation").validate({
    rules: {
      name: {
        required: true,
        minlength: 4,
      },
    },
    messages: {
      name: {
        required: "role name is required",
        minlength: "role name must be at least 4 characters",
      },
    },
    errorClass: "text-danger",
    // Highlight/unhighlight fields like react-hook-form
    highlight: function (element) {
      $(element).addClass("error").removeClass("valid");
    },
    unhighlight: function (element) {
      $(element).removeClass("error").addClass("valid");
    },
    // Place error messages right under input
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },
    submitHandler: function (form) {
      let permissions = [];
      $(".users-permissions")
        .closest(".dropdown")
        .find("input:checked")
        .toArray()
        .forEach((el) => permissions.push(el.value));
      $(".roles-permissions")
        .closest(".dropdown")
        .find("input:checked")
        .toArray()
        .forEach((el) => permissions.push(el.value));
      $(".categories-permissions")
        .closest(".dropdown")
        .find("input:checked")
        .toArray()
        .forEach((el) => permissions.push(el.value));
      $(".blogs-permissions")
        .closest(".dropdown")
        .find("input:checked")
        .toArray()
        .forEach((el) => permissions.push(el.value));

      $.ajax({
        url: `/api/v1/role/create`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          name: $("#name").val(),
          permissions,
        }),
        success: function (response) {
          if(response.success) {
            location.reload();
          }
        },
        error: function (error) {
          console.log(error, "123123");
        },
      });
    },
  });
  //   $("#role-creation").submit(function(e){
  //     e.preventDefault();
  //     let permissions = [];
  //     $("#users-permissions").closest(".dropdown").find("input:checked").toArray().forEach(el=> permissions.push(el.value));
  //     $("#roles-permissions").closest(".dropdown").find("input:checked").toArray().forEach(el=> permissions.push(el.value));
  //     $("#categories-permissions").closest(".dropdown").find("input:checked").toArray().forEach(el=> permissions.push(el.value));
  //     $("#blogs-permissions").closest(".dropdown").find("input:checked").toArray().forEach(el=> permissions.push(el.value));

  //     $.ajax({
  //       url: `/api/v1/role/create`,
  //       type: "POST",
  //       contentType: "application/json",
  //       data: JSON.stringify({
  //         name:$("#name").val(),
  //         permissions,
  //       }),
  //       success: function(response) {
  //         console.log(response);
  //         if(response.success) {
  //           window.location.href = "/dashboard";
  //         }
  //       },
  //       error: function(error) {
  //         console.log(error,"123123");
  //       }
  //     });
  //   })
});
