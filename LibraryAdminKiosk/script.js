// Initialize variables to store maximum capacity, current library count, and library log
let MaxCapNum = 100;
let CurLibNum = 0;
let libraryLog = [];

// Test database containing a list/array of objects with full names and 5-digit IDs
const database = [
  { fullName: "John Doe", id: "12345" },
  { fullName: "Jane Smith", id: "67890" },
  // Add more test data if needed
];

// Function to save changes made to the maximum capacity
function saveChanges() {
  // Get input elements and success/error message placeholders
  const maxCapacityInput = document.getElementById('maxCapacity');
  const successMessage1 = document.getElementById('successMessage1');
  const errorMessage1 = document.getElementById('errorMessage1');

  // Parse the new maximum capacity input value
  const newMaxCap = parseInt(maxCapacityInput.value);

  // Check if the input is a valid number within the allowed range
  if (isNaN(newMaxCap) || newMaxCap < 0 || newMaxCap > 10000) {
    errorMessage1.textContent = 'Must be a number between 0-10,000';
    successMessage1.textContent = '';
  } else {
    // Update the maximum capacity and display success message
    MaxCapNum = newMaxCap;
    successMessage1.textContent = 'Changes made successfully';
    errorMessage1.textContent = '';
  }

  // Update the current library count panel
  updatePanel2();
}

// Function to update the current library count panel
function updatePanel2() {
  const libraryCount = document.getElementById('libraryCount');
  libraryCount.textContent = `${CurLibNum}/${MaxCapNum}`;
}

// Function to add a person to the library
function addPerson() {
  const personNameInput = document.getElementById('personName');
  const personIDInput = document.getElementById('personID');
  const addError = document.getElementById('addError');

  const name = personNameInput.value.trim();
  const id = personIDInput.value.trim();

  // Check if the ID is a valid 5-digit number
  if (!/^\d{5}$/.test(id)) {
    addError.textContent = 'Not a 5 Digit ID';
    return;
  }

  // Find the person in the database based on the provided ID
  const person = database.find(person => person.id === id);

  // Check if the person exists in the database
  if (!person) {
    addError.textContent = 'ID not in school database';
    return;
  }

  // Check if the name or ID is already signed in
  if (isNameInLibrary(person.fullName) && isIDInLibrary(id)) {
    addError.textContent = 'Name and ID already signed in';
    return;
  }

  if (isNameInLibrary(person.fullName)) {
    addError.textContent = 'Name already signed in';
    return;
  }

  if (isIDInLibrary(id)) {
    addError.textContent = 'ID already signed in';
    return;
  }

  // Increment current library count, add person to the library log, and update panels
  CurLibNum++;
  const timestamp = new Date();
  libraryLog.push({ id, name: person.fullName, action: 'signed in', timestamp });
  updatePanel2();
  updatePanel4();
  addError.textContent = '';
  logUserInput({ action: 'addPerson', name: person.fullName, id, timestamp });

  // Send data to the server
  sendDataToServer({ action: 'addPerson', name: person.fullName, id, timestamp });
}

// Function to check if a name is already in the library
function isNameInLibrary(name) {
  return libraryLog.some(entry => entry.name === name && entry.action === 'signed in');
}

// Function to check if an ID is already in the library
function isIDInLibrary(id) {
  return libraryLog.some(entry => entry.id === id && entry.action === 'signed in');
}

// Function to remove a person from the library
function removePerson() {
  const personNameInput = document.getElementById('personName');
  const personIDInput = document.getElementById('personID');
  const addError = document.getElementById('addError');

  const name = personNameInput.value.trim();
  const id = personIDInput.value.trim();

  if (!/^\d{5}$/.test(id)) {
    addError.textContent = 'Not a 5 Digit ID';
    return;
  }

  // Check if the name or ID is in the database
  const isNameInDatabase = database.some(person => person.fullName === name);
  const isIDInDatabase = database.some(person => person.id === id);

  if (!isNameInDatabase && !isIDInDatabase) {
    addError.textContent = 'Name/ID not in school database';
    return;
  }

  // Find the person in the library log
  const index = libraryLog.findIndex(entry => entry.id === id && entry.name === name && entry.action === 'signed in');

  if (index === -1) {
    addError.textContent = 'Person not found in the library.';
    return;
  }

  // Decrement current library count, update action to 'signed out', and update panels
  CurLibNum--;
  libraryLog[index].action = 'signed out';
  libraryLog[index].timestamp = new Date();
  updatePanel2();
  updatePanel4();
  addError.textContent = '';
  logUserInput({ action: 'removePerson', name, id, timestamp: libraryLog[index].timestamp });

  // Send data to the server
  sendDataToServer({ action: 'removePerson', name, id, timestamp: libraryLog[index].timestamp });
}


// Function to update the library log panel
function updatePanel4() {
  const logBody = document.getElementById('logBody');
  logBody.innerHTML = '';

  for (const entry of libraryLog) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.id}</td><td>${entry.timestamp.toLocaleString()}</td><td>${entry.name}</td><td>${entry.action}</td>`;
    logBody.appendChild(row);
  }
}

// Function to log user input data
function logUserInput(data) {
  // Here, you can log user input data to your desired storage or API.
  console.log(data);
}

// Function to send data to the server
function sendDataToServer(data) {
  fetch('/sendData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => console.log('Data sent to server:', data))
  .catch(error => console.error('Error sending data to server:', error));
}
