document.addEventListener('DOMContentLoaded', () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token'));

    if (token) {
        document.getElementById('loginbutton').textContent = "Account";
        document.getElementById('loginbutton').href = "/account";
        document.getElementById("edrop").style.visibility = "visible";
    }
   
});

var navBar = document.getElementById("navbar");

function togglebtn() {
    navBar.classList.toggle("hidemenu")
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('extrastep').hidden = true;
    document.getElementById('money_per_person').hidden = true;
    document.getElementById('extramoney').hidden = true;
    document.getElementById('extrapeople').hidden = true;
    const housetext = document.getElementById('housetext');
    const housename = document.getElementById('housename');
    const beds = document.getElementById('beds');
    const bathrooms = document.getElementById('bathrooms');
    const rented_space_type = document.getElementById('rented_space_type');
    const bedrooms = document.getElementById('bedrooms');
    const area_space = document.getElementById('area_space');
    const livingroom = document.getElementById('livingroom');
    const wifi = document.getElementById('wifi');
    const aircondition = document.getElementById('aircondition');
    const heat = document.getElementById('heat');
    const kitchen = document.getElementById('kitchen');
    const tv = document.getElementById('tv');
    const parking = document.getElementById('parking');
    const hotwater = document.getElementById('hotwater');
    const elevator = document.getElementById('elevator');

    const smoking = document.getElementById('smoking');
    const pets = document.getElementById('pets');
    const parties = document.getElementById('parties');
    const mindaysrent = document.getElementById('mindaysrent');

    const country = document.getElementById('country');
    const city = document.getElementById('city');
    const address = document.getElementById('address');
    const postcode = document.getElementById('postcode');
    const price = document.getElementById('price');
    const downphototext = document.getElementById('downphototext');
    const reviews1 = document.getElementById('reviews1');

    const location1 = document.getElementById('location1');
    const map = document.getElementById('map');


    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    const daysrent = document.getElementById('daysrent');
    const max_persons = document.getElementById('max_persons');
    const extrapeople = document.getElementById('extrapeople');
    const dayprice = document.getElementById('dayprice');
    const extramoney = document.getElementById('extramoney');
    const days = document.getElementById('days');
    const totaldays = document.getElementById('totaldays');
    const max_persons1 = document.getElementById('max_persons1');
    const owner_id = document.getElementById('owner_id');
    const price1 = document.getElementById('price1');
    // Function to fetch user data and populate the form

    function fetchRent() {
        var url = location.href;
        const queryString = url.split("?")[1];
        const id = queryString.split("=")[1];

        fetch('/getrentdetails/' + id)
            .then(response => response.json())
            .then(rent => {
                if (rent) {
                    housetext.textContent = rent.housetext;
                    housename.textContent = rent.housename;
                    beds.textContent = "Number Of Beds : " + rent.beds;
                    bathrooms.textContent = "Number Of Bathrooms : " + rent.bathrooms;
                    rented_space_type.textContent = "Type of Rental Space : " + rent.housetype;
                    bedrooms.textContent = "Number Of Bed Rooms : " + rent.bedrooms;
                    area_space.textContent = "Acreage Space : " + rent.area_space;
                    downphototext.textContent = "Location : " + rent.address + " " + rent.city + " " + rent.postcode + " " + rent.country;
                    if (rent.livingroom) { livingroom.textContent = "Existence of Living Room : Yes"; } else { livingroom.textContent = "Existence of Living Room : No"; }
                    if (rent.wifi) { wifi.textContent = "Existence of Wi-Fi : Yes"; } else { wifi.textContent = "Existence of Wi-Fi : No"; }
                    if (rent.aircondition) { aircondition.textContent = "Existence of Aircondition : Yes"; } else { aircondition.textContent = "Existence of Aircondition : No"; }
                    if (rent.heat) { heat.textContent = "Existence of Heat : Yes"; } else { heat.textContent = "Existence of Heat : No"; }
                    if (rent.kitchen) { kitchen.textContent = "Existence of Kitchen : Yes"; } else { kitchen.textContent = "Existence of Kitchen : No"; }
                    if (rent.tv) { tv.textContent = "Existence of Tv : Yes"; } else { tv.textContent = "Existence of Tv : No"; }
                    if (rent.parking) { parking.textContent = "Existence of Parking : Yes"; } else { parking.textContent = "Existence of Parking : No"; }
                    if (rent.hotwater) { hotwater.textContent = "Existence of Hot Water : Yes"; } else { hotwater.textContent = "Existence of Hot Water : No"; }
                    if (rent.elevator) { elevator.textContent = "Existence of Elevator : Yes"; } else { elevator.textContent = "Existence of Elevator : No"; }

                    if (rent.smoking) { smoking.textContent = "Smoking Allowed : Yes"; } else { smoking.textContent = "Smoking Allowed : No"; }
                    if (rent.pets) { pets.textContent = "Pets Allowed : Yes"; } else { pets.textContent = "Pets Allowed : No"; }
                    if (rent.parties) { parties.textContent = "Parties Allowed : Yes"; } else { parties.textContent = "Parties Allowed : No"; }
                    mindaysrent.textContent = "Minimum Days Of Rent : " + rent.mindaysrent;
                    country.textContent = "County : " + rent.country;
                    city.textContent = "City : " + rent.city;
                    address.textContent = "Address : " + rent.address;
                    postcode.textContent = "Postal Code : " + rent.postcode;
                    mindaysrent.textContent = "Minium Days Of Rent : " + rent.mindaysrent;
                    price.textContent = "$ " + rent.price + " / day";
                    location1.textContent = "Location : " + rent.address + " " + rent.city + " " + rent.postcode + " " + rent.country;
                    map.src = "https://www.google.com/maps?q=" + rent.address + " " + rent.city + " " + rent.postcode + " " + rent.country + "&output=embed"
                    const urlParams = new URLSearchParams(window.location.search);



                    max_persons.textContent = "Maximum number of people : " + rent.max_persons;
                    dayprice.textContent = "House rent : " + rent.price + " $ /day";
                    price1.value = rent.price;
                    max_persons1.value = rent.max_persons;
                    max_persons_price1.value = rent.add_persons;
                    owner_id.value = rent.owner_id;




                    const reviews = document.getElementById('reviews');
                    const rating = document.getElementById('rating');
                    const rating1 = document.getElementById('rating1');
                    //fetch reviews

                    const flname = document.getElementById('userflname');
                    const usphoto = document.getElementById('userphoto');
                    const usphotolink = document.getElementById('userphotolink');


                    function fetchUser() {
                        fetch('/getuserpublic/' + rent.owner_id)
                            .then(response => response.json())
                            .then(user => {
                                if (user) {
                                    flname.textContent = user.firstName + " " + user.lastName;
                                    flname.href = "https://rento.panosgio.org:4000/user?id=" + rent.owner_id;

                                    document.getElementById('useremail').value = user.email;

                                    const urlParams = new URLSearchParams(window.location.search);
                                    const imageName = user.image;
                                    usphoto.src = '/getimage/' + imageName;
                                    usphotolink.href = "https://rento.panosgio.org:4000/user?id=" + rent.owner_id;



                                    function fetchreviewsuser() {
                                        fetch('/getuserreview/' + rent.owner_id)
                                            .then(response => response.json())
                                            .then(user => {
                                                if (user) {
                                                    rating.textContent = user[0] + " Stars" + ",   " + user[1] + " Reviews";

                                                    let ratingValue = user[0];
                                                    const starContainer = document.getElementById("ratingStars");

                                                    if (ratingValue < 0 || ratingValue > 5) {
                                                        starContainer.innerHTML = "Μη έγκυρη βαθμολογία";
                                                    } else {
                                                        for (let i = 1; i <= 5; i++) {
                                                            if (i <= ratingValue) {
                                                                starContainer.innerHTML += '<i class="fa-solid fa-star"></i>';
                                                            } else if (i - 0.5 <= ratingValue) {
                                                                starContainer.innerHTML += '<i class="fa-regular fa-star-half-stroke"></i>';
                                                            } else {
                                                                starContainer.innerHTML += '<i class="far fa-star"></i>';
                                                            }
                                                        }
                                                    }


                                                }
                                            })
                                            .catch(error => {
                                                console.error(error);
                                                alert(error);
                                            });
                                    }

                                    // Fetch user data when the page loads
                                    fetchreviewsuser('');

                                } else {
                                    alert('User not found');
                                }
                            })
                            .catch(error => {
                                console.error(error);
                                alert(error);
                            });
                    }

                    // Fetch user data when the page loads
                    fetchUser('');

                    const galleryContainer = document.getElementById('rentgallery');

                    // Loop through the image data and create HTML elements
                    rent.image.forEach((imageName, index) => {
                        const imageLink = document.createElement('a');
                        imageLink.href = '/getimage/' + imageName;
                        imageLink.dataset.lightbox = 'gallery';

                        const imageElement = document.createElement('img');
                        imageElement.src = '/getimage/' + imageName;
                        imageElement.width = 380;
                        imageElement.height = 330;

                        imageLink.appendChild(imageElement);
                        galleryContainer.appendChild(imageLink);
                    });


                    // Function to fetch and display comments
                    function fetchComments() {
                        // Replace this URL with the actual API endpoint that provides comments data in JSON format.
                        const apiUrl = '/getrentreviewdata/' + id;

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

                } else {
                    alert('Rent not found');
                }
            })
            .catch(error => {
                console.error(error);
                alert('An error occurred');
            });
    }

    // Fetch user data when the page loads
    fetchRent('');

    function fetchreviews() {
        var url = location.href;
        const queryString = url.split("?")[1];
        const id = queryString.split("=")[1];
        fetch('https://rento.panosgio.org:4000/getrentreview/' + id)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const averageRating = data.averageRating;
                // console.log("averageRating =" + averageRating);

                if (averageRating === null || typeof averageRating === 'undefined') {
                    rating1.textContent = " 0 Stars";
                } else {
                    rating1.textContent = averageRating + " Stars";
                }

                let ratingValue = averageRating;

                const starContainer = document.getElementById("ratingStars1");

                if (ratingValue < 0 || ratingValue > 5) {
                    starContainer.innerHTML = "Μη έγκυρη βαθμολογία";
                } else {
                    for (let i = 1; i <= 5; i++) {
                        if (i <= ratingValue) {
                            starContainer.innerHTML += '<i class="fa-solid fa-star"></i>';
                        } else if (i - 0.5 <= ratingValue) {
                            starContainer.innerHTML += '<i class="fa-regular fa-star-half-stroke"></i>';
                        } else {
                            starContainer.innerHTML += '<i class="far fa-star"></i>';
                        }
                    }
                }

                var url = location.href;
                const queryString = url.split("?")[1];
                const id = queryString.split("=")[1];
                const requestBody = {
                    visited: id,
                };
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                };
            
                fetch('/addlog', requestOptions);
            })
            .catch(error => {
                console.error(error);
                alert(error);
            });
    }

    // Fetch user data when the page loads
    fetchreviews('');
    async function fetchHousesFromUser() {
        try {

          const response = await fetch('/getuservector/panos3333');
          const houses = await response.json();
          const filteredHouses = houses.map(item => item[0]); // Παρε μονο τα σπιτια χωρις την ομοιοτητα.
          //console.log("filteredHouses = ", filteredHouses);


          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse);
          }
          const houseContainer = document.getElementById('houseContainer');

          // Clear any existing content in the container
          houseContainer.innerHTML = '';

          // Loop through the fetched data and create house cards
          filteredHouses.slice(0, 4).forEach((house, star_rating) => {
            const houseCard = document.createElement('div');
            houseCard.className = 'col-md-6 col-lg-3';
            houseCard.innerHTML =
              `
                          <div class="card height-whole-card">
                              <a href="https://rento.panosgio.org:4000/house?id=${house._id}" target="_blank"><img src="/getimage/${house.image[0]}" class="vh-image-top-card" alt="..."></a>
                              <div class="mx-auto">
                                  <div class="d-flex justify-content-center align-content-center icon-position-bg">
                                      <i class="fas fa-hamburger icon-position fs-2 text-white"></i>
                                  </div>
                              </div>
                              <div class="card-body text-center">
                                  <span class="card-title text-danger">${house.housetype}</span>
                                  <h4 class="card-text">${house.housename}</h4>
                                  <div><span><i class="fas fa-location-pin text-danger"></i></span> <span class="text-secondary">${house.address + ", " + house.city}</span></div>
                                  <div>
                                      <img src="images/phone icon.png" alt="Image Description" width="20" height="20">
                                      <span class="text-secondary">${house.price}</span>
                                      <hr>
                                      <div>
                                          <p>${house.averageRating}  Stars</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      `;
            houseContainer.appendChild(houseCard);
          });
        } catch (error) {
          console.error('Error fetching houses:', error);
        }
      }


      // Call the function to fetch and display houses for the specified user
      fetchHousesFromUser();

});