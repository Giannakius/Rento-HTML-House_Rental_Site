document.addEventListener('DOMContentLoaded', () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token'));

    if (token) {
        document.getElementById('loginbutton').textContent = "Account";
        document.getElementById('loginbutton').href = "/account";
        document.getElementById("edrop").style.visibility = "visible";
    }
    if (document.cookie.indexOf("anonymous_token") === -1) {
        if(document.cookie.indexOf("token") === -1) {
          window.location.href = "/login";
        }
    }
    var navBar = document.getElementById("navbar");

    function togglebtn() {
        navBar.classList.toggle("hidemenu");
    }
    document.getElementById('houseid').hidden = true;
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
    let t_ownerid = "";
    var url = location.href;
    const queryString = url.split("?")[1];
    const id = queryString.split("=")[1];
    // Function to fetch user data and populate the form
    function fetchRent() {
        return new Promise((resolve, reject) => {


            fetch('/getrentdetails/' + id)
                .then(response => response.json())
                .then(rent => {
                    housetext.textContent = rent.housetext;
                    housename.textContent = rent.housename;
                    beds.textContent = "Number Of Beds : " + rent.beds;
                    bathrooms.textContent = "Number Of Bathrooms : " + rent.bathrooms;
                    rented_space_type.textContent = "Type of Rental Space : " + rent.housetype;
                    bedrooms.textContent = "Number Of Bed Rooms : " + rent.bedrooms;
                    area_space.textContent = "Acreage Space : " + rent.area_space;
                    downphototext.innerHTML = "<strong><b>Location:</b></strong> " + rent.address + " " + rent.city + " " + rent.postcode + " " + rent.country + "<br><strong><b>Neighbourhood:</b></strong> " + rent.neighbourhood;
                    downphototext.style.color = "#01bdf6";
                    downphototext.style.fontSize = "28px";


                    


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
                    location1.textContent = "";
                    map.src = "https://www.google.com/maps?q=" + rent.address + " " + rent.city + " " + rent.postcode + " " + rent.country + "&output=embed"
                    const urlParams = new URLSearchParams(window.location.search);



                    max_persons.textContent = "Maximum number of people : " + rent.max_persons;
                    dayprice.textContent = "House rent : " + rent.price + " $ /day";
                    price1.value = rent.price;
                    max_persons1.value = rent.max_persons;
                    max_persons_price1.value = rent.add_persons;
                    owner_id.value = rent.owner_id;
                    t_ownerid = rent.owner_id;
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
                    resolve(); // Resolve the promise when this fetch is complete
                })
                .catch(error => {
                    console.error(error);
                    alert('An error occurred');
                    reject(error); // Reject the promise if there's an error
                });
        });
    }

    // Function to fetch user data
    function fetchUser() {
        return new Promise((resolve, reject) => {
            // ... Existing code ...

            fetch('/getuserpublic/' + t_ownerid)
                .then(response => response.json())
                .then(user => {

                    //fetch reviews

                    const flname = document.getElementById('userflname');
                    const usphoto = document.getElementById('userphoto');
                    const usphotolink = document.getElementById('userphotolink');
                    flname.textContent = user.firstName + " " + user.lastName;
                    flname.href = "https://rento.panosgio.org:4000/user?id=" + t_ownerid;

                    document.getElementById('useremail').value = user.email;

                    const urlParams = new URLSearchParams(window.location.search);
                    const imageName = user.image;
                    usphoto.src = '/getimage/' + imageName;
                    usphotolink.href = "https://rento.panosgio.org:4000/user?id=" + t_ownerid;
                    resolve(); // Resolve the promise when this fetch is complete
                })
                .catch(error => {
                    console.error(error);
                    alert(error);
                    reject(error); // Reject the promise if there's an error
                });
        });
    }

    // Function to fetch user data
    function fetchUserCurrent() {
        return new Promise((resolve, reject) => {
            // ... Existing code ...

            fetch('/getuserpubliccookie/')
                .then(response => response.json())
                .then(user => {
                    
                    if (user.username == t_ownerid) {

                        document.getElementById('houseid').hidden = false;
                    }

                    resolve(); // Resolve the promise when this fetch is complete
                })
                .catch(error => {
                    console.error(error);
                    alert(error);
                    reject(error); // Reject the promise if there's an error
                });
        });
    }

    // Function to fetch reviews
    function fetchreviews() {
        return new Promise((resolve, reject) => {
            // ... Existing code ...

            fetch('https://rento.panosgio.org:4000/getrentreview/' + id)
                .then(response => response.json())
                .then(data => {
                    const averageRating = data.averageRating;
                    // console.log("averageRating =" + averageRating);


                    const rating1 = document.getElementById('rating1');
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
                    resolve(); // Resolve the promise when this fetch is complete
                })
                .catch(error => {
                    console.error(error);
                    alert(error);
                    reject(error); // Reject the promise if there's an error
                });
        });
    }


    // Function to fetch reviews
    function fetchComments() {
        return new Promise((resolve, reject) => {
            // ... Existing code ...

            fetch('https://rento.panosgio.org:4000/getrentreviewdata/' + id)
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
                    resolve();
                })
                .catch(error => {
                    console.error(error);
                    alert(error);
                    reject(error); // Reject the promise if there's an error
                });
        });
    }
    // Function to fetch reviews
    function fetchUserReviews() {
        return new Promise((resolve, reject) => {
            // ... Existing code ...

            fetch('https://rento.panosgio.org:4000/getuserreview/' + t_ownerid)
                .then(response => response.json())
                .then(data => {
                    const rating = document.getElementById('rating');
                    let t_stars = data[0];
                    if (data[0] == null) {
                        t_stars = 0;
                    }
                    rating.textContent = t_stars + " Stars" + ",   " + data[1] + " Reviews";

                    let ratingValue = data[0];
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
                    resolve(); // Resolve the promise when this fetch is complete
                })
                .catch(error => {
                    console.error(error);
                    alert(error);
                    reject(error); // Reject the promise if there's an error
                });
        });
    }


    function fetchHousesRecommend() {
        return new Promise((resolve, reject) => {
            // ... Existing code ...

            fetch('https://rento.panosgio.org:4000/getRecommendedHouses')
                .then(response => response.json())
                .then(data => {
                    const filteredHouses = data;
                    const houseContainer = document.getElementById('houseContainer');

                    // Clear any existing content in the container
                    houseContainer.innerHTML = '';


                    // Loop through the fetched data and create house cards
                    filteredHouses.slice(0, 4).forEach(house => {
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
                              </div>
                          </div>
                      `;
                        houseContainer.appendChild(houseCard);
                    });
                    resolve(); // Resolve the promise when this fetch is complete
                })
                .catch(error => {
                    console.error(error);
                    alert(error);
                    reject(error); // Reject the promise if there's an error
                });
        });
    }


    // Function to fetch reviews
    function fetchAddlog() {
        return new Promise((resolve, reject) => {
            // ... Existing code ...
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
            resolve();
        });
    }
    // Fetch user data when the page loads
    fetchRent()
        .then(() => fetchUser())
        .then(() => fetchUserCurrent())
        .then(() => fetchUserReviews())
        .then(() => fetchreviews())
        .then(() => fetchComments())
        .then(() => fetchHousesRecommend())
       .then(() => fetchAddlog());
});
