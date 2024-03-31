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
  
  function displayQueue() {
    const queueDisplay = document.getElementById('queueDisplay');
    queueDisplay.innerHTML = ''; // Clear previous content
  
    const queueRef = database.ref('queue');
    const barbers = ['Ndumiso', 'CeeJay', 'Goat Kay', 'Ta Mjakes'];
  
    barbers.forEach(barber => {
      const barberQueueDiv = document.createElement('div');
      barberQueueDiv.classList.add('barber-queue');
  
      const barberHeader = document.createElement('h2');
      barberHeader.textContent = `${barber}'s Queue`;
  
      const barberQueueList = document.createElement('ul');
  
      let queueCount = 0; // Initialize the queue count for each barber
  
      queueRef.orderByChild('barber').equalTo(barber).on('value', snapshot => {
        queueCount = snapshot.numChildren(); // Count the number of children (customers) for the current barber
        let queueNumber = 1; // Initialize the queue number
  
        snapshot.forEach(childSnapshot => {
          const customerData = childSnapshot.val();
          const { nickname, joinedAt } = customerData;
  
          const card = document.createElement('div');
          card.classList.add('customer-card');
  
          const queueNumberSpan = document.createElement('span');
          queueNumberSpan.classList.add('queue-number');
          queueNumberSpan.textContent = `#${queueNumber++}`; // Increment and display the queue number
  
          const nicknameSpan = document.createElement('span');
          nicknameSpan.classList.add('customer-nickname');
          nicknameSpan.textContent = nickname;
  
          const joinedAtSpan = document.createElement('span');
          joinedAtSpan.classList.add('joined-time');
          joinedAtSpan.textContent = `Joined ${formatDate(joinedAt)}`; // Format the joinedAt date
  
          card.appendChild(queueNumberSpan);
          card.appendChild(nicknameSpan);
          card.appendChild(joinedAtSpan);
  
          barberQueueList.appendChild(card);
        });
  
        // Modify the queue count display in your JavaScript
        const countInfo = document.createElement('p');
        countInfo.innerHTML = `<i class="fas fa-users"></i>Total in Queue: ${queueCount}`;
        barberQueueDiv.appendChild(countInfo);
  
      });
  
      barberQueueDiv.appendChild(barberHeader);
      barberQueueDiv.appendChild(barberQueueList);
      queueDisplay.appendChild(barberQueueDiv);
    });
  }
  
// Function to format date and time
function formatDate(timestamp) {
    const dateObj = new Date(timestamp);
    const currentDate = new Date();
    const currentDayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const prevDayStart = new Date(currentDayStart);
    prevDayStart.setDate(currentDayStart.getDate() - 1);
  
    if (dateObj >= currentDayStart) {
      // Display as today with time
      const options = { hour: 'numeric', minute: '2-digit', hour12: true };
      return `today, ${dateObj.toLocaleTimeString('en-US', options)}`;
    } else if (dateObj >= prevDayStart) {
      // Display as yesterday with time
      const options = { hour: 'numeric', minute: '2-digit', hour12: true };
      return `yesterday, ${dateObj.toLocaleTimeString('en-US', options)}`;
    } else {
      // Display as X days ago
      const diffTime = currentDate - dateObj;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    }
  }
  
  
  
  
  const queueRef = database.ref('queue');
  queueRef.on('value', snapshot => {
    displayQueue(); // Call displayQueue to handle data and re-render
  });
  
  window.onload = displayQueue;