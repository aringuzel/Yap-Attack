// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
//https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js

// Firebase configuration
const firebaseConfig = {

    apiKey: "",
    authDomain: "share-ideas-af309.firebaseapp.com",
    projectId: "share-ideas-af309",
    storageBucket: "share-ideas-af309.firebasestorage.app",
    messagingSenderId: "757953988207",
    appId: "1:757953988207:web:fe8a929c63bac73fd66f9a"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();



const submit = document.getElementById('submit');
submit.addEventListener("click", function (event) {
    event.preventDefault()
    //alert("works")

    //get inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        if (user.emailVerified) {
            window.location.href = "/index.html";
          } else {
            alert("Please verify your email before logging in.");
          }
        })
        .catch((error) => {
          alert(error.message);
        });
});

// Get the "Forgot Password" link
const forgotPasswordLink = document.getElementById("forgot-password-link");

// Handle the password reset request
forgotPasswordLink.addEventListener("click", (event) => {
  event.preventDefault();

  // Prompt the user for their email
  const email = prompt("Please enter your email address:");

  if (email) {
    // Send the password reset email
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Inform the user that the email has been sent
        alert("Password reset email sent! Please check your inbox.");
      })
      .catch((error) => {
        // Handle errors, e.g. invalid email
        const errorCode = error.code;
        const errorMessage = error.message;
        
        if (errorCode === 'auth/invalid-email') {
          alert("The email address is invalid. Please check your email.");
        } else if (errorCode === 'auth/user-not-found') {
          alert("No user found with this email address.");
        } else {
          alert("An error occurred: " + errorMessage);
        }
      });
  } else {
    alert("Email is required.");
  }
});
