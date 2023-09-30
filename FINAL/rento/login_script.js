const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  buttons = document.querySelector("loginbtn"),
  pwShowHide = document.querySelectorAll(".pw_hide");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

buttons.addEventListener("signup", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
buttons.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});


document.querySelector("loginbtn").addEventListener("login", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const requestBody = {
    username: username,
    password: password,
  };


  const xhr = new XMLHttpRequest();
  const url = "/loginuser"; // Replace with your Node.js server URL

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        document.getElementById('loginbutton').textContent = "Account";
        document.getElementById('loginbutton').href = "/account";
        document.getElementById("edrop").style.visibility = "visible";
      } else if (xhr.status === 401) {
        alert("Wrong Credentials");
      } else {
        alert("Login failed: Error occurred");
      }
    }
  };

  const data = JSON.stringify({ username: username, password: password });
  xhr.send(data);
  
});
