// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCIPtHcmFwV1NQ95_w4uz-SqA62yqbWEq",
    authDomain: "jashoreshop-1bd50.firebaseapp.com",
    databaseURL: "https://jashoreshop-1bd50-default-rtdb.firebaseio.com",
    projectId: "jashoreshop-1bd50",
    storageBucket: "jashoreshop-1bd50.appspot.com",
    messagingSenderId: "538389037858",
    appId: "1:538389037858:web:7477721bd6a484174f1b7b",
    measurementId: "G-M2KVL1M6SN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// DOM Elements
const loginForm = document.getElementById('login-form');
const loginKeyInput = document.getElementById('login-key');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');
const chatMessages = document.getElementById('chat-messages');
const logoutBtn = document.getElementById('logout-btn');

let currentUser = null;

// Hardcoded user credentials
const users = {
    tanvir: { loginKey: 'TanvirTheBoss', password: 'Tanvir222' },
    abuzar: { loginKey: 'AbuzarTheMaster', password: 'Abuzar234' },
    srizon: { loginKey: 'SrizonTheLegend', password: 'Srizon999' }
};

// Login Form Submission
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const loginKey = loginKeyInput.value.trim();
    const password = passwordInput.value.trim();

    for (const user in users) {
        if (users[user].loginKey === loginKey && users[user].password === password) {
            currentUser = user;
            showChat();
            return;
        }
    }

    loginError.textContent = "Invalid login key or password!";
    loginError.style.display = 'block';
});

// Show Chat and Hide Login
function showChat() {
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    loadMessages();
}

// Load Messages from Firebase
function loadMessages() {
    firebase.database().ref('messages').on('child_added', (snapshot) => {
        const messageData = snapshot.val();
        displayMessage(messageData);
    });
}

// Send Message to Firebase
function sendMessage(text) {
    const timestamp = new Date().toLocaleString();
    const messageData = {
        user: currentUser,
        text: text,
        timestamp: timestamp
    };
    firebase.database().ref('messages').push(messageData);
}

// Display Message in Chat
function displayMessage(data) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `user-${data.user}`);
    messageDiv.innerHTML = `
        <strong>${data.user}:</strong> ${data.text}
        <span class="message-timestamp">${data.timestamp}</span>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send File to Firebase
function sendFile(file) {
    const storageRef = firebase.storage().ref(`files/${file.name}`);
    storageRef.put(file).then(() => {
        storageRef.getDownloadURL().then((url) => {
            sendMessage(`<a href="${url}" target="_blank">${file.name}</a>`);
        });
    });
}

// Chat Form Submission
document.getElementById('chat-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (text) {
        sendMessage(text);
        messageInput.value = '';
    }

    if (fileInput.files[0]) {
        sendFile(fileInput.files[0]);
        fileInput.value = '';
    }
});

// Logout functionality
logoutBtn.addEventListener('click', function () {
    currentUser = null;
    chatContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
    loginForm.reset();
});
