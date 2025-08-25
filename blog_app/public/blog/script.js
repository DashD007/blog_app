$(document).ready(function(){
  let blogId;
  $("#comment-form").submit(function(e){
    e.preventDefault();
    $.ajax({
      url: `/api/v1/comment/create`,
      type: "POST",
      data: {
        content: $("#commentbox").val(),
        blogId,
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
  })
    // Fetch blogs
  function fetchBlog() {
    const {pathname} = window.location; 
    $.ajax({
      url: `/api/v1${pathname}`,
      method: "GET",
      success: function (response) {
        const {data} = response;
        blogId = data?.id;
        $(".blog-container").empty();

        $(".blog-container").html(
            `
            <img src="${data.coverImageUrl}" alt="Blog Banner" style="height:250px; width:100%; object-fit: cover; border-radius: 10px; overflow: hidden;">
        
            <div>
                <h1 class="mb-1 mt-3">${data.title}</h1>
            </div>
            <div>
                <p style="font-size:small;font-weight:400;">By ${data.User.username} • ${new Date(data.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
                <p>${data.content}</p>
            </div>
            `
        )
        
        $("#comments").empty();
        data.Comments.forEach(comment => $("#comments").append(
            `<div class="comment-card">
                <p class="comment-author">${comment.User.username}</p>
                <p class="comment-content">${comment.content}</p>
            </div>`
        ))
        
      },
      error : function(response){
        showErrorToast(response.responseJSON?.message);
        setTimeout(function() {
          window.location.href = "/dashboard"
        }, 5000);
      }
    });
  }

  // Initial fetch
  fetchBlog();


})