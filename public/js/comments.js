$(document).ready(function() { 

    let commentErrorDiv = $('#comment-error-div')

    function displayError(error){
      commentErrorDiv.html('<p>' + error + '</p>')
    }

    function resetErrorDiv(){
      commentErrorDiv.html('')
    }

    $('#addCommentForm').submit(function(event) {
      event.preventDefault(); 
      
      $('#submitComment').prop('disabled', true);
      
      let commentText = $('#comment').val();
      const url = window.location.href;
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const pathParts = pathname.split('/');
      const postId = pathParts[pathParts.length - 1];
      //console.log(postId);

      const commentUrl = "http://localhost:3000/posts/comments/" + postId + "/add"

      //console.log(commentUrl);

      //console.log(commentText);

      if(commentText.trim() == ''){
        // alert('Comment cannot ce empty!');
        displayError('Comment cannot be empty')
        $('#submitComment').prop('disabled', false);

        return
      }

      commentText = commentText.trim();
      
      $.ajax({
        url: commentUrl, 
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ comment: commentText }),
        contentType: 'application/json',
        success: function(response) {
          $('#submitComment').prop('disabled', false);

          //console.log(response);

          resetErrorDiv()
          
          const commentHTML = `
          <li class="list-group-item">
          <div class="commenter-profile">
            <img src="/${response.profileImg}" width="50" height="50" alt="${response.author}'s profile picture">
            <small>
              <div class="commenter-name">${response.author} </div> 
              <button data-id="${response.commentId}" class="btn btn-sm btn-link comment-edit-btn">edit comment</button> | <a data-id="${response.commentId}" class="btn btn-sm btn-link comment-delete-btn">delete comment</a> 
            </small>
          </div>
          <div class="commenter-comment">
            <div class="comment-content">
              <p>${response.comment}</p>
            </div>
            <div class="comment-edit-form" style="display: none;">
              <textarea class="form-control comment-edit-textarea" style="margin-bottom: 10px;">${response.comment}</textarea>
              <button type="button" class="btn btn-primary btn-sm comment-submit-btn">Submit</button>
              <button type="button" class="btn btn-sm btn-link comment-cancel-btn" style="color: red;">Cancel</button>
            </div>
          </div>
        </li>
          `;
          $('.list-group').append(commentHTML);
          
          $('#comment').val('');
        },
        error: function(xhr, status, error) {
          let jsonResponse;
              try {
                  jsonResponse = JSON.parse(xhr.responseText);
              } catch (parseError) {
                  console.error('Error parsing JSON response:', parseError);
                  return;
              }

            // alert(jsonResponse.message);
            displayError(jsonResponse.message)
          $('#submitComment').prop('disabled', false);
        }
      });
    });

    $('.comment-list').on('click', '.comment-delete-btn', function(event){
        event.preventDefault()

        const commentId = $(this).data('id');
        
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
              resetErrorDiv()
              listItemToRemove.remove();
            },
            error: function(xhr, status, error) {
              let jsonResponse;
              try {
                  jsonResponse = JSON.parse(xhr.responseText);
              } catch (parseError) {
                  console.error('Error parsing JSON response:', parseError);
                  return;
              }

              // alert(jsonResponse.message);
              displayError(jsonResponse.message)
              // console.error('Failed to delete comment:', error);
            }
          });
    })

    $('.comment-list').on('click', '.comment-submit-btn', function() {


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
            resetErrorDiv()
            clickedElement.closest('.list-group-item').find('.comment-edit-form').hide();
            clickedElement.closest('.list-group-item').find('.comment-content').show();

            clickedElement.closest('.list-group-item').find('.comment-content p').text(updatedComment);

            console.log('P updateed')
            
        },
        error: function(xhr, status, error) {
          let jsonResponse;
              try {
                  jsonResponse = JSON.parse(xhr.responseText);
              } catch (parseError) {
                  console.error('Error parsing JSON response:', parseError);
                  return;
              }

              // alert(jsonResponse.message);
              displayError(jsonResponse.message)
            // console.error('Failed to update comment:', error);
        }
        });
        
        // $(this).closest('.list-group-item').find('.comment-content p').text(updatedComment);
        
        // $(this).closest('.list-group-item').find('.comment-edit-form').hide();
        // $(this).closest('.list-group-item').find('.comment-content').show();


      });

      $('.comment-list').on('click', '.comment-edit-btn', function(event){

        console.log('Edit cliecked')
        $(this).closest('.list-group-item').find('.comment-content').hide();
        $(this).closest('.list-group-item').find('.comment-edit-form').show();

      });

      $('.comment-list').on('click', '.comment-cancel-btn', function(event){

        $(this).closest('.list-group-item').find('.comment-edit-form').hide();
        $(this).closest('.list-group-item').find('.comment-content').show();

      });

    // $('.comment-edit-btn').click(function() {
    //   console.log('Edit cliecked')
    //     $(this).closest('.list-group-item').find('.comment-content').hide();
    //     $(this).closest('.list-group-item').find('.comment-edit-form').show();
    //   });

    //   $('.comment-cancel-btn').click(function() {
    //     $(this).closest('.list-group-item').find('.comment-edit-form').hide();
    //     $(this).closest('.list-group-item').find('.comment-content').show();
    //   });

  });