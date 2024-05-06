$(document).ready(function(){

    function appendJournalEntryToTimeline(entry) {
        // Create a template string with the HTML structure
        const template = `
            <div class="row">
                <div class="col-md-12 timeline-dot">
                    <div class="social-timelines p-relative">
                        <div class="row timeline-right p-t-35">
                            <div class="col-2 col-sm-2 col-xl-1">
                                <div class="social-timelines-left">
                                    <img class="img-radius timeline-icon" src="/${entry.pet.profileImage.path}" alt="">
                                </div>
                            </div>
                            <div class="col-10 col-sm-10 col-xl-11 p-l-5 p-b-35">
                                <div class="card">
                                    <div class="card-block post-timelines">
                                        <div class="chat-header f-w-600">${entry.pet.name}</div>
                                        <div class="social-time text-muted">Now</div>
                                    </div>
                                    ${entry.hasImage ? `<img src="/${entry.image}" class="img-fluid width-100" alt="">` : ''}
                                    <div class="card-block">
                                        <div class="timeline-details">
                                            <p class="text-muted">${entry.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        // Append the template to the top of the timeline-container div
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
            contentType: false, // Prevent jQuery from adding a Content-Type header
            processData: false, // Prevent jQuery from processing the data
            success: function(response) {
                // Handle success response
                console.log(response);
                appendJournalEntryToTimeline(response)
            },
            error: function(xhr, status, error) {
                // Handle error response
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

    $('.delete-journal-btn').click(function() {
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