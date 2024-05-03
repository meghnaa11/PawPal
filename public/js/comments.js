$(document).ready(function() {
    $('#addCommentForm').submit(function(event) {
      event.preventDefault(); 
      
      $('#submitComment').prop('disabled', true);
      
      const commentText = $('#comment').val();
      const url = window.location.href;
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const pathParts = pathname.split('/');
      const postId = pathParts[pathParts.length - 1];
      console.log(postId);

      const commentUrl = "http://localhost:3000/posts/comments/" + postId + "/add"

      console.log(commentUrl)

      console.log(commentText)
      
      $.ajax({
        url: commentUrl, 
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ comment: commentText }),
        contentType: 'application/json',
        success: function(response) {
          $('#submitComment').prop('disabled', false);

          console.log(response)
          
          const commentHTML = `
          <li class="list-group-item">
          <div class="comment-content">
            <p>${response.comment}</p>
          </div>
          <div class="comment-edit-form" style="display: none;">
            <textarea class="form-control comment-edit-textarea" style="margin-bottom: 10px;">${response.comment}</textarea>
            <button type="button" class="btn btn-primary btn-sm comment-submit-btn">Submit</button>
            <button type="button" class="btn btn-sm btn-link comment-cancel-btn" style="color: red;">Cancel</button>
          </div>
          <small>Commented by:  ${response.author} | <button data-id="{{_id}}" class="btn btn-sm btn-link comment-edit-btn">edit comment</button> | <a data-id="{{_id}}" class="btn btn-sm btn-link comment-delete-btn">delete comment</a></small>
        </li>
          `;
          $('.list-group').append(commentHTML);
          
          $('#comment').val('');
        },
        error: function(xhr, status, error) {
            console.log(xhr);
            console.log(status)
          console.error(error);
          $('#submitComment').prop('disabled', false);
        }
      });
    });

    $('.comment-delete-btn').click(function(event){
        event.preventDefault()

        const commentId = $(this).data('id');
        
        // Construct the JSON object for deletion
        const dataToDelete = { commentId: commentId };

        const listItemToRemove = $(this).closest('.list-group-item');   
        const commentUrl = "http://localhost:3000/posts/comments/delete"

        
        $.ajax({
            url: commentUrl,
            type: 'POST', 
            data: JSON.stringify(dataToDelete), 
            contentType: 'application/json', 
            success: function(response) {
              console.log('Comment deleted successfully:', response);

              listItemToRemove.remove();
            },
            error: function(xhr, status, error) {
              console.error('Failed to delete comment:', error);
            }
          });
    })

    $('.comment-submit-btn').click(function() {


        const updatedComment = $(this).closest('.list-group-item').find('.comment-edit-textarea').val();

        const commentId = $(this).closest('.list-group-item').find('.comment-delete-btn').data('id');
    
        const data = {
        commentId: commentId,
        updatedComment: updatedComment
        };

        let clickedElement = $(this);

        const commentUrl = "http://localhost:3000/posts/comments/edit"

        
        $.ajax({
        url: commentUrl, 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify(data), 
        success: function(response) {
            console.log('Comment updated successfully:', response);
            
            clickedElement.closest('.list-group-item').find('.comment-edit-form').hide();
            clickedElement.closest('.list-group-item').find('.comment-content').show();

            clickedElement.closest('.list-group-item').find('.comment-content p').text(updatedComment);

            console.log('P updateed')
            
        },
        error: function(xhr, status, error) {
            console.error('Failed to update comment:', error);
        }
        });
        
        // $(this).closest('.list-group-item').find('.comment-content p').text(updatedComment);
        
        // $(this).closest('.list-group-item').find('.comment-edit-form').hide();
        // $(this).closest('.list-group-item').find('.comment-content').show();


      });

    $('.comment-edit-btn').click(function() {
        // Hide the comment content and show the edit form
        $(this).closest('.list-group-item').find('.comment-content').hide();
        $(this).closest('.list-group-item').find('.comment-edit-form').show();
      });

      $('.comment-cancel-btn').click(function() {
        // Hide the edit form and show the comment content without saving changes
        $(this).closest('.list-group-item').find('.comment-edit-form').hide();
        $(this).closest('.list-group-item').find('.comment-content').show();
      });

  });