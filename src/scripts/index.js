const firebaseConfig = {
  apiKey: "AIzaSyDSIsxreeatQd6dcuPg9RrWMvXTi1tx6ko",
  authDomain: "maliqueue.firebaseapp.com",
  databaseURL: "https://maliqueue-default-rtdb.firebaseio.com",
  projectId: "maliqueue",
  storageBucket: "maliqueue.appspot.com",
  messagingSenderId: "583905268727",
  appId: "1:583905268727:web:3a25e7f69bda40f0c354f2",
  measurementId: "G-WJW4WV0RG4"
};
   firebase.initializeApp(firebaseConfig);
   const database = firebase.database();
   
   const queueForm = document.getElementById('queueForm');
    const nicknameInput = document.getElementById('nickname');
    const selectedBarberInput = document.getElementById('selectedBarber');
    const whatsappInput = document.getElementById('whatsapp'); // Select WhatsApp input field
   
   const barberButtons = document.querySelectorAll('.barber-button');
   const viewQueueButton = document.getElementById('viewQueueButton');
   const selectedBarberDropdown = document.getElementById('selectedBarberDropdown');
   
  const emailInput = document.getElementById('email');
   
   viewQueueButton.addEventListener('click', () => {
    // Redirect the user to the queue display page
    window.location.href = 'queue.html';
   });
   selectedBarberDropdown.addEventListener('change', () => {
    const selectedBarber = selectedBarberDropdown.value;
    selectedBarberInput.value = selectedBarber;
});

   // Add event listeners to the barber buttons
barberButtons.forEach(button => {
  button.addEventListener('click', () => {
      const selectedBarber = button.value;
      selectedBarberInput.value = selectedBarber;

      // Remove "selected" class from all buttons
      barberButtons.forEach(b => b.classList.remove('selected'));

      // Add "selected" class to the clicked button
      button.classList.add('selected');
  });
});
queueForm.addEventListener('submit', (event) => {
  event.preventDefault();



  // Get nickname, selected barber, and WhatsApp number values
  const nickname = nicknameInput.value;
  const selectedBarber = selectedBarberInput.value;
  const whatsapp = whatsappInput.value;
  const email = emailInput.value;

// Validate input
if (!nickname || !selectedBarber || !whatsapp || !email) {
  alert('Please fill in all fields.');
  return;
}

  if (!/^\d{10}$/.test(whatsapp)) {
      alert('Please enter a valid 10-digit WhatsApp number.');
      return;
  }


// Validate email format
if (!validateEmail(email)) {
  alert('Please enter a valid email address.');
  return;
}
 // Check if the selected barber is available
const barberRef = database.ref(`barbers/${selectedBarber}/available`);
barberRef.once('value', (snapshot) => {
    const isAvailable = snapshot.val();

    if (!isAvailable) {
        alert('Sorry, this barber is currently offline. Please select another barber.');
        return;
    }

    // Write data to Firebase Realtime Database
    const queueRef = database.ref('queue');
    const newData = {
        nickname,
        barber: selectedBarber,
        whatsapp,
        email, // Include email in the data
        joinedAt: firebase.database.ServerValue.TIMESTAMP,
    };
    queueRef.push(newData);

    // Clear form and provide confirmation
    nicknameInput.value = '';
    selectedBarberInput.checked = false;
    whatsappInput.value = '';
    emailInput.value = ''; // Clear email input
    alert(`You have joined the queue for ${selectedBarber}`);

    // Redirect to view queue page after a short delay
    setTimeout(() => {
        window.location.href = 'queue.html';
    }, 2000);
});

});
// Function to validate email format
function validateEmail(email) {
  // Regular expression for email validation
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
   function flipImage(image) {
     image.style.transform = "rotateY(360deg)";
     setTimeout(() => {
       image.style.transform = "rotateY(0deg)";
     }, 2500);
   }
   const backgroundTiles = document.querySelectorAll('.background-tiles img');
   let currentImageIndex = 0;
   
   setInterval(() => {
     flipImage(backgroundTiles[currentImageIndex]);
     currentImageIndex = (currentImageIndex + 1) % backgroundTiles.length; // Cycle through images
   }, 2000); 
   // Function to update barber button availability based on Firebase data
// Function to update barber button availability based on Firebase data
function updateButtonAvailability() {
  const barbersRef = database.ref('barbers');

  barbersRef.on('value', (snapshot) => {
      const barbers = snapshot.val();

      // Loop through the barber buttons and dropdown options
      barberButtons.forEach((button) => {
          const barberName = button.value;
          const dropdownOption = document.getElementById('selectedBarberDropdown').querySelector(`[value="${barberName}"]`);

          // Check if the barber's availability status exists in Firebase
          if (barbers && barbers[barberName] && barbers[barberName].available !== undefined) {
              const isAvailable = barbers[barberName].available;

              // Disable or enable the button based on availability
              button.disabled = !isAvailable;

              // Update the dropdown option based on availability
              if (dropdownOption) {
                  if (!isAvailable) {
                      dropdownOption.textContent = `${barberName} (Offline)`;
                  } else {
                      dropdownOption.textContent = barberName;
                  }
              }
          }
      });
  });
}

   // Call the function to update button availability initially
   updateButtonAvailability();