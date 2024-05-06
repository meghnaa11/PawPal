$(document).ready(function(){


    //Citation: https://stackoverflow.com/questions/3043775/how-to-escape-html
    function escapeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    function appendJournalEntryToTimeline(entry) {
        entry.content = escapeHtml(entry.content)
        const template = `
        <div class="row">
            <div class="col-md-12">
                <div class="row timeline-right p-t-35">
                    <div class="col-2 col-sm-2 col-xl-1">
                    <img class="img-radius timeline-icon" src="/${entry.pet.profileImage.path}" alt="${entry.pet.name}'s picture">
                    </div>
                    <div class="col-10 col-sm-10 col-xl-11 p-l-5 p-b-35">
                        <div class="card">
                            <div class="card-block post-timelines">
                                <div class="d-flex">
                                <div class="chat-header f-w-600">${entry.pet.name}</div>
                                <button class="btn btn-sm btn-outline-danger float-right delete-btn delete-journal-btn" data-id="${entry._id}">X</button>
                                </div>
                                <div class="social-time text-muted">Now</div>
                                </div>
                            <div class="card-block">
                                <div class="timeline-details">
                                <p class="text-muted">${entry.content}</p>
                                </div>
                            </div>
                            ${entry.hasImage ? `<img src="/${entry.image}" class="img-fluid width-100" alt="${entry.content}">` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    
        $('.timeline-container').prepend(template);
    }
    
    $('#journalStatusForm').submit( function(event){
        event.preventDefault()


        const formData = new FormData(this);
        const content = formData.get('content');
        const image = formData.get('image');
        const pet = formData.get('pet');

        if (!content && !image) {
            alert('Either content or image is required');
            return;
        }

        $.ajax({
            url: '/journal/newentry',
            type: 'POST',
            data: formData,
            contentType: false, 
            processData: false, 
            success: function(response) {
                console.log(response);
                appendJournalEntryToTimeline(response)
                $('#journalStatusForm')[0].reset()
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                let jsonResponse;
              try {
                  jsonResponse = JSON.parse(xhr.responseText);
              } catch (parseError) {
                  console.error('Error parsing JSON response:', parseError);
                  return;
              }

              alert(jsonResponse.error);
            }
        });

    })

    $('.timeline-container').on('click','.delete-journal-btn', function() {
        const journalId = $(this).data('id');

        $.ajax({
            url: '/journal/delete',
            type: 'POST',
            data: { id: journalId },
            success: function(response) {
                $(`.delete-journal-btn[data-id="${journalId}"]`).closest('.row').remove();
                console.log('Journal entry deleted successfully.');
            },
            error: function(xhr, status, error) {
                console.error('Error deleting journal entry:', error);
                let jsonResponse;
              try {
                  jsonResponse = JSON.parse(xhr.responseText);
              } catch (parseError) {
                  console.error('Error parsing JSON response:', parseError);
                  return;
              }

              alert(jsonResponse.error);
            }
        });
    });

})