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
    if (e.key === "Escape" && $("#blog-creation-dailog").is(":visible")) {
      $("#blog-creation-dailog").css("display", "none");
      $("#detail-card-container").css("display", "grid");
      $("#blogContainer").css("display", "grid");
    }
  });

  $(".add-blog").click(function () {
    if ($("#blog-creation-dailog").is(":visible")) {
      $("#blog-creation-dailog").css("display", "none");
      $("#detail-card-container").css("display", "grid");
      $("#blogContainer").css("display", "grid");
    } else {
      $("#blog-creation-dailog").css("display", "block");
      $("#detail-card-container").css("display", "none");
      $("#blogContainer").css("display", "none");
    }
  });

  function fetchCount(){
    $.ajax({
      url: `/api/v1/blog/count`,
      method: "GET",
      success: function (response) {
        const {data} = response;
        $("#totalCount").empty();
        $("#totalCount").html(data.totalBlogs || 0);

        $("#yourBlogsCount").empty();
        $("#yourBlogsCount").html(data.blogsPublishedByYou || 0);
      },
    });
  }


  var blogTable; 
  
  // fetch blogs
  function fetchBlog(){
    blogTable  = $('#hiddenDataTable').DataTable({
      processing: true,
      serverSide: true,
      paging: true,
      pageLength: 5,  // blogs per page
      searching: false,    
      info: false,   
      lengthChange: false,
      ordering: false,
      pagingType: "simple",
      ajax: {
        url: '/api/v1/blog/list',
        type: 'POST',
        contentType: 'application/json',
        data: function(d) {
          d.query = $('#searchInput').val() || "";
          return JSON.stringify(d);
        },
        dataSrc: function (json) {
          return json.data || json; // fallback
        }
      },
      columns: [
        { data: 'title' },
      ],
      drawCallback: function(settings) {
        let api = this.api();
        let blogs = api.rows({ page: 'current' }).data();

        $("#blogContainer").empty();

        blogs.each(function(blog) {

          $("#blogContainer").append(`
            <div class="blog">
              <div class="card h-100 shadow-sm p-1">
              <a class="blog" href="/blog/${blog.categorySlug}/${blog.titleSlug}" style="text-decoration: none; max-width:100%">
                <img src="${blog.coverImageUrl}" class="card-img-top" alt="Banner">
                <div class="card-body">
                  <h5 class="card-title" style="color:black">${blog.title}</h5>
                  <p class="card-text text-muted">By ${blog.author || ""}</p>
              </a>
                  <div style="display:flex; flex-direction:row;align-items:center; justify-content:space-between;">
                    ${blog.category ? `<p class="blog-category">${blog.category}</p>` : `<div></div>`}
                    ${(blog.publishedBy == userId) ? `<div style="display:flex; flex-direction:row; gap:10px; align-items:center;">
                      <button class="btn btn-sm btn-danger deleteBtn" data-id="${blog.id}">
                        <i class="bi bi-trash"></i> delete
                      </button>
                    </div>` : `<div><div>`}
                  </div>
                </div>
              </div>
            </div>
          `);
        });

        // 👇 Always keep pagination synced
        let paginate = $(blogTable.table().container()).find('.dataTables_paginate');
        $("#blogPagination").empty().append(paginate);
      }
    })
  }
  
  fetchBlog();

  function fetchCategory(){
    $.ajax({
      url: "/api/v1/category/list",
      type: "GET",
      success: function(response) {
        let {data} = response;
        let selectCategory = $(".select-category");
        selectCategory.empty();

        data.forEach((category,index) => {
          let option = `<option value="${category.id}">${category.name}</option>`;
          selectCategory.append(option);
        });
        

      },
      error: function() {

      }
    });
  }

  fetchCategory();


  // Initial fetch
  fetchCount();

  // var myModal = new bootstrap.Modal(document.getElementById('formModal'));
  var deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

  // $(document).on("click", ".editBtn", function() {
  //   let id = $(this).data("id");
  //   $("#hiddenId").val(id);
  //   myModal.show();
  // });

  $(document).on("click", ".deleteBtn", function() {
    let id = $(this).data("id");
    $("#hiddenIdInDeleteModal").val(id);
    deleteModal.show();
  });
  $("#deleteForm").on("submit", function(e) {
    e.preventDefault();
    let formData = {};
    $.each($(this).serializeArray(), function(_, field) {
      formData[field.name] = field.value;
    });
    $.ajax({
      url: `/api/v1/blog/delete`,
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
  // Search blogs
  $("#searchInput").on("keyup", function () {
    blogTable.ajax.reload();
  });

  $("#blog-creation").submit(function(e){
    e.preventDefault();

    let formData = new FormData();
    formData.append("title", $("#title").val());
    formData.append("content", $("#content").val());
    formData.append("categoryId", $("#category").val());
    formData.append("coverimage", $("#coverimage")[0].files[0]);

    $.ajax({
      url: `/api/v1/blog/create`,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
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
