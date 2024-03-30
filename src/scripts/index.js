const firebaseConfig = {
    apiKey: "AIzaSyATX1PtZS5e_1zxbYXNahop_YeYWEYcLPw",
    authDomain: "matomesqueue.firebaseapp.com",
    databaseURL: "https://matomesqueue-default-rtdb.firebaseio.com",
    projectId: "matomesqueue",
    storageBucket: "matomesqueue.appspot.com",
    messagingSenderId: "223650040990",
    appId: "1:223650040990:web:0b8bbb70704d2fc017ff8f",
    measurementId: "G-QPX28V2J3P"
   };
   
   firebase.initializeApp(firebaseConfig);
   const database = firebase.database();
   
   const queueForm = document.getElementById('queueForm');
    const nicknameInput = document.getElementById('nickname');
    const selectedBarberInput = document.getElementById('selectedBarber');
    const whatsappInput = document.getElementById('whatsapp'); // Select WhatsApp input field
   
   const barberButtons = document.querySelectorAll('.barber-button');
   const viewQueueButton = document.getElementById('viewQueueButton');
   
   viewQueueButton.addEventListener('click', () => {
    // Redirect the user to the queue display page
    window.location.href = 'queue.html';
   });
   
   // Add event listeners to the barber buttons
   barberButtons.forEach(button => {
    button.addEventListener('click', () => {
     const selectedBarber = button.value;
     selectedBarberInput.value = selectedBarber;
   
    
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
      
     // Validate input
     if (!nickname || !selectedBarber || !whatsapp) {
       alert('Please enter a nickname, select a barber, and provide a 10-digit WhatsApp number.');
       return;
     }
   
     if (!/^\d{10}$/.test(whatsapp)) {
       alert('Please enter a valid 10-digit WhatsApp number.');
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
         whatsapp, // Add WhatsApp number to the data
         joinedAt: firebase.database.ServerValue.TIMESTAMP,
       };
       queueRef.push(newData);
   
       // Clear form and provide confirmation
       nicknameInput.value = '';
       selectedBarberInput.checked = false;
       whatsappInput.value = ''; // Clear WhatsApp input
       alert(`You have joined the queue for ${selectedBarber}`);
     });
   });
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
   function updateButtonAvailability() {
     const barbersRef = database.ref('barbers');
   
     barbersRef.on('value', (snapshot) => {
       const barbers = snapshot.val();
   
       // Loop through the barber buttons
       barberButtons.forEach((button) => {
         const barberName = button.value;
   
         // Check if the barber's availability status exists in Firebase
         if (barbers && barbers[barberName] && barbers[barberName].available !== undefined) {
           const isAvailable = barbers[barberName].available;
   
           // Disable or enable the button based on availability
           button.disabled = !isAvailable;
         }
       });
     });
   }
   
   // Call the function to update button availability initially
   updateButtonAvailability();