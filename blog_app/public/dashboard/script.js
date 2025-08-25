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


  $(".add-blog").click(function () {
    if ($("#blog-creation-dailog").is(":visible")) {
      $("#blog-creation-dailog").css("display", "none");
    } else {
      $("#blog-creation-dailog").css("display", "block");
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
      pageLength: 6,  // blogs per page
      searching: false,    
      info: false,   
      lengthChange: false,
      ordering: false,
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
            <a class="blog" href="/blog/${blog.categorySlug}/${blog.titleSlug}" style="text-decoration: none; max-width:100%">
              <div class="card h-100 shadow-sm p-1">
                <img src="${blog.coverImageUrl}" class="card-img-top" alt="Banner">
                <div class="card-body">
                  <h5 class="card-title">${blog.title}</h5>
                  <p class="card-text text-muted">By ${blog.author || ""}</p>
                  ${blog.category ? `<p class="blog-category">${blog.category}</p>` : `<div></div>`}
                </div>
              </div>
            </a>
          `);
        });

        // 👇 Move pagination controls
        $("#blogPagination").html($(blogTable.table().container()).find('.dataTables_paginate'));
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
