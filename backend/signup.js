// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
//https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js


import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {

    apiKey: "AIzaSyBe1TiqYnc05q6r3G6MDIouR3QUn1eIrcI",
    authDomain: "share-ideas-af309.firebaseapp.com",
    projectId: "share-ideas-af309",
    storageBucket: "share-ideas-af309.firebasestorage.app",
    messagingSenderId: "757953988207",
    appId: "1:757953988207:web:fe8a929c63bac73fd66f9a"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Submit button event listener
const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
  event.preventDefault();

  // Get inputs
  const email = document.getElementById("email").value;
  const username = document.getElementById("uname").value;
  const password = document.getElementById("password").value;

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username });

    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      username: username,
    });

    // Send email verification
    await sendEmailVerification(user);

    alert("Account created successfully. Please verify email.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
});