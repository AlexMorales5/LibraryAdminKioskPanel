// Initialize variables to store maximum capacity, current library count, and library log
let MaxCapNum = 100;
let CurLibNum = 0;
let libraryLog = [];

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

  // Check if the maximum capacity has been reached
  if (CurLibNum >= MaxCapNum) {
    addError.textContent = 'Maximum number of people in library reached.';
    return;
  }

  // Check if the name or ID is already signed in
  if (isNameInLibrary(name) && isIDInLibrary(id)) {
    addError.textContent = 'Name and ID already signed in';
    return;
  }

  if (isNameInLibrary(name)) {
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
  libraryLog.push({ id, name, action: 'signed in', timestamp });
  updatePanel2();
  updatePanel4();
  addError.textContent = '';
  logUserInput({ action: 'addPerson', name, id, timestamp });
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

  const index = libraryLog.findIndex(entry => entry.id === id && entry.name === name && entry.action === 'signed in');

  if (index === -1) {
    addError.textContent = 'Person not found in the library.';
    return;
  }

  CurLibNum--;
  libraryLog[index].action = 'signed out';
  libraryLog[index].timestamp = new Date();
  updatePanel2();
  updatePanel4();
  addError.textContent = '';
  logUserInput({ action: 'removePerson', name, id, timestamp: libraryLog[index].timestamp });
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
