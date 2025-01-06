// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiqOJn7fHmvcjMDpam59oawOkesff1EPQ",
  authDomain: "loginsignup-d8e46.firebaseapp.com",
  projectId: "loginsignup-d8e46",
  storageBucket: "loginsignup-d8e46.firebasestorage.app",
  messagingSenderId: "613824798952",
  appId: "1:613824798952:web:925f0a5dd3e67894d3295d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formTitle = document.getElementById("form-title");
const authButton = document.getElementById("auth-button");
const toggleMessage = document.getElementById("toggle-message");
const toggleLink = document.getElementById("toggle-link");

// Toggle between Login and Signup
let isSignup = true;

// Function to update the form when toggling between login and signup
function updateForm() {
  if (isSignup) {
    formTitle.textContent = "SIGN UP";
    authButton.textContent = "Sign Up";
    toggleMessage.innerHTML = `Already have an account? <a href="#" id="toggle-link">Login</a>`;
  } else {
    formTitle.textContent = "LOGIN";
    authButton.textContent = "Login";
    toggleMessage.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Signup</a>`;
  }

  // Attach event listener to the toggle link
  const toggleLink = document.getElementById("toggle-link");
  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isSignup = !isSignup; // Toggle between login and signup mode
    updateForm(); // Update form based on the new mode
  });
}

// Initialize the form state
updateForm();

// Handle Form Submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  if (isSignup) {
    // Signup user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Signup successful! Please login withsame credentials");
        // window.open("addbirthdays.html", "_blank");
        console.log("User:", userCredential.user);
        form.reset();
      })
      .catch((error) => alert("Error: " + error.message));
  } else {
    // Login user
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login successful!");
        window.open("projectD.html", "_self");
        console.log("User:", userCredential.user);
        form.reset();
      })
      .catch((error) => alert("Error: " + error.message));
  }
});

const guest = document.getElementById("guest-button");
guest.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default button behavior if it's inside a form
  alert("You are logged in as a guest");
  window.location.href = "./projectD.html"; // Use `location.href` for navigation
});
