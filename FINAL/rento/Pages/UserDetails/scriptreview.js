

document.addEventListener('DOMContentLoaded', () => {

  // Function to fetch and display comments
  function fetchComments() {
    var url = location.href;
    const queryString = url.split("?")[1];
    const id = queryString.split("=")[1];

    const apiUrl = '/getuserreviewdata/' + id;

    // Make an AJAX request to fetch the comments data
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const commentsContainer = document.getElementById('commentsContainer');


        // Clear any existing content in the container
        commentsContainer.innerHTML = '';

        // Loop through the fetched comments data and create comment boxes
        data.forEach((comment) => {
          let commentBox = document.createElement('div');
          commentBox.className = 'comment-box';
          // Create the comment box content based on the comment data
          commentBox.innerHTML = `

                                  <div class="box-top">
                                  <div class="Profile">
                                    <div class="profile-image">
                                        <img src="/getimage/${comment.reviewerphoto}">
                                    </div>
                                    <div class="Name">
                                        <strong>${comment.reviewerflname}</strong>
                                        <span>@${comment.reviewer}</span>
                                    </div>
                                  </div>
                                  </div>
                                  <div class="comment">
                    <span class="rating">
                        ${comment.rating} / 5 <i class="fa fa-star" style="color: cyan;"></i>
                    </span>
                    <p>${comment.reviews}</p>
                </div>
                                  `;




          // Append the comment box to the comments container
          commentsContainer.appendChild(commentBox);
        });
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  }

  // Call the fetchComments function to initially load comments
  fetchComments();

});




