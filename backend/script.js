import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, orderBy, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 Check if the user is logged in
onAuthStateChanged(auth, (user) => {
  const body = document.body;

  if (!user) {
    // If no user is logged in, display a generic message
    document.getElementById("user-name").textContent = "Hello, Guest!";
    // Hide the logout button if no user is logged in
    document.getElementById("logout-btn").style.display = 'none';
    //show login button
    document.getElementById("login-btn").style.display = 'inline-block';
    //hide customisation
    document.getElementById("custom").style.display = 'none';
    document.getElementById("remove-bg").style.display = 'none';
    document.getElementById("bg-input").style.display = 'none';

    // Remove background
    body.style.backgroundImage = "none";


    // Find all delete buttons and hide them if the user is not logged in
    const deleteButtons = document.querySelectorAll('.delete-btn'); // Select all delete buttons
    deleteButtons.forEach(button => {
      button.style.display = 'none'; // Hide the delete button
    });


  } else {
    const username = user.displayName
    document.getElementById("user-name").textContent = `Welcome, ${username}!`;
    // Show the logout button if user is logged in
    document.getElementById("logout-btn").style.display = 'inline-block';
    // hide login button
    document.getElementById("login-btn").style.display = 'none';
    //show customisation
    document.getElementById("custom").style.display = 'block';
    document.getElementById("remove-bg").style.display = 'inline-block';

    // Restore background from localStorage if available
    const savedBg = localStorage.getItem("backgroundImage");
    if (savedBg) {
      body.style.backgroundImage = `url('${savedBg}')`;
    }


    // Show all delete buttons again (if the user is logged in)
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.style.display = 'inline-block'; // Show the delete button
    });


  }
});

// Logout function
document.getElementById("logout-btn").addEventListener("click", async function () {
  try {
    await signOut(auth); // Sign out the user from Firebase
    location.reload()
  } catch (error) {
    console.error("Error logging out:", error);
    alert("An error occurred while logging out.");
  }
});

//Login function
document.getElementById("login-btn").addEventListener("click", async function () {
  try {
    window.location.href = "/pages/login.html";
  } catch (error) {
    console.error("Error logging out:", error);
    alert("An error occurred while logging out.");
  }
});

// Get the form element and submit button
const form = document.querySelector(".form");
const submit = document.getElementById("submit");


function getPosts() {
  // Create a query to order posts by timestamp in descending order
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("timestamp", "desc")
  );

  // Real-time listener to get posts from Firestore
  onSnapshot(postsQuery, (querySnapshot) => {
    console.log("Documents retrieved:", querySnapshot.size); // Log how many docs were fetched

    // Create a container to display posts
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = ''; // Clear any previous posts

    if (querySnapshot.empty) {
      postsContainer.innerHTML = "<p>No posts available</p>";
      return;
    }

    // Loop through all posts and display them
    querySnapshot.forEach((postDoc) => {
      const postData = postDoc.data();
      console.log("Post data:", postData); // Log the post data to see it

      const postElement = document.createElement("div");
      postElement.classList.add("post");

      postElement.innerHTML = `
        <h3>${postData.username}</h3>
        <p>${postData.content}</p>
        <small>${postData.timestamp.toDate().toLocaleString()}</small>
      `;


      // Check if the logged-in user is the one who created the post
      const user = auth.currentUser;
      if (user && user.uid === postData.userId) {
        // Add delete button for the creator of the post
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Yap";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", async () => {
          try {
            // Get the document reference using doc() and the document's ID
            const postRef = doc(db, "posts", postDoc.id); // Use postDoc.id for reference
            // Delete the post using the document reference
            await deleteDoc(postRef);
            console.log("Post deleted!");
          } catch (error) {
            console.error("Error deleting post: ", error);
            alert("An error occurred while deleting the post.");
          }
        });

        postElement.appendChild(deleteButton); // Append the delete button to the post
      }


      postsContainer.appendChild(postElement);
    });
  });
}

// Call the getPosts function to display posts on page load and listen for changes
getPosts();




form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission behavior

    // Get current logged-in user
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to post.");
      return;
    }

  // Get input values
  let content = document.getElementById("content").value;

  // Check if inputs are empty
  if (!content) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Generate a unique ID for the new document
    const docId = `post_${Date.now()}`;

    // Add data to Firestore
    await setDoc(doc(db, "posts", docId), {
      userId: user.uid, // Store the user's UID
      username: user.displayName, // Store the user's name (fallback to "Anonymous" if not set)
      content: content,
      timestamp: new Date(), // Add a timestamp for sorting/filtering
    });

    console.log("Document added to Firestore with ID: ", docId);
    
    // Optionally, clear form after submission
    form.reset();

  } catch (error) {
    console.error("Error adding document: ", error);
    alert("An error occurred. Please try again.");
  }
})


// Get the toggle button and the sidebar
const toggleButton = document.getElementById('toggleButton');
const sidebar = document.getElementById('sidebar');
const topButton = document.querySelector('.top');

// Toggle the sidebar visibility when the button is clicked
toggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('show');


  // Toggle scroll behavior on the body
  if (sidebar.classList.contains('show')) {
    if (window.innerWidth <= 480) {
      topButton.style.display = 'none'; // Hide the top button on mobile when sidebar is open
      document.body.style.overflow = 'hidden';
    }
  } else {
    if (window.innerWidth <= 480) {
      topButton.style.display = 'block'; // Show the top button again when sidebar is closed
      document.body.style.overflow = 'auto';
    }
  }
});



let Darkmode = document.getElementById('Darkmode-HTML')

// Check if dark mode is saved in localStorage on page load
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add("dark-mode");
  Darkmode.innerText = "Light Mode";
} else {
  document.body.classList.remove("dark-mode");
  Darkmode.innerText = "Dark Mode";
}

function DarkmodeJS() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    element.classList.toggle("Darkmode-HTML");
    if(Darkmode.innerText=="Light Mode"){
         Darkmode.innerText="Dark Mode";
         localStorage.setItem('darkMode', 'disabled');
        }
      else{
        Darkmode.innerText="Light Mode";
        localStorage.setItem('darkMode', 'enabled');
        }
};

Darkmode.onclick = DarkmodeJS;


// Background image changer function
document.addEventListener("DOMContentLoaded", function () {
  const bgInput = document.getElementById("bg-input");
  const removeBgBtn = document.getElementById("remove-bg"); // Get the remove button
  const body = document.body;

  // Load stored background image if available
  const savedBg = localStorage.getItem("backgroundImage");
  if (savedBg) {
      body.style.backgroundImage = `url('${savedBg}')`;
  }

  // Event listener for changing the background image
  bgInput.addEventListener("change", function () {
      const file = bgInput.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              const imageUrl = e.target.result;
              body.style.backgroundImage = `url('${imageUrl}')`;
              localStorage.setItem("backgroundImage", imageUrl);
          };
          reader.readAsDataURL(file);
      }
  });

  // Event listener for removing the background image
  removeBgBtn.addEventListener("click", function () {
      body.style.backgroundImage = "none"; // Remove background image
      localStorage.removeItem("backgroundImage"); // Remove the image from localStorage

      // Clear the file input value and button text when the background is removed
      bgInput.value = ''; // This clears the file name in the input button
  });
});

const textarea = document.getElementById('content');
const charCount = document.getElementById('charCount');
const maxLength = 445;
const submitButton = document.getElementById('submit');

textarea.addEventListener('input', () => {
    const remaining = maxLength - textarea.value.length;
    charCount.textContent = remaining;
});

submitButton.addEventListener('click', (e) => {
  charCount.textContent = maxLength;
});