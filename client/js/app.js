
const chat = document.getElementById('chat')
const messages = document.querySelector('.messages')
const roomName = document.getElementById('room-name')
const roomMod = document.getElementById('room-moderator')
const users = document.getElementById('users')

let str = location.search;
let indices = [];
for(var i=0; i<str.length;i++) {
    if (str[i] === "=") indices.push(i+1);
}

const username = str.substring(indices[0], str.search('&'))
let room = str.substring(indices[1]);
let setMod = false;
if(room == "")
{
    room = Math.floor((Math.random()*100000)).toString();
    setMod = true;
}






const socket = io()

socket.emit('joinRoom', { username, room, setMod });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
  
// Message from server
socket.on('message', message => {
    //console.log(message);
    outputMessage(message);

    // Scroll down
    chat.scrollTop = chat.scrollHeight;
});

chat.addEventListener('submit', e => {
    e.preventDefault();
  
    // Get message text
    const msg = e.target.elements.msg.value;
  
    // Emit message to server
    socket.emit('chatMessage', msg);
  
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });


socket.on('roomMod', mod => {
    
    outputMod(mod);
});


function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span class="meta"> <strong> ${message.username}: <strong> </span>
    <span class="text">
      ${message.text}
    </span>`;
    messages.appendChild(div);
  }

function outputRoomName(room){
    roomName.innerHTML = room
}

function outputMod(mod){
    roomMod.innerHTML = mod.username
}

let userset = new Set()

function outputUsers(users) {
    /*users.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;*/
    for(let i = 0; i < users.length; ++i){
        if(userset.has(users[i])) continue;
        userset.add(users[i]);
        const div = document.createElement('div');
        div.classList.add('users.username');
        div.innerHTML = `<ul style='display:inline-flex;' class="meta"> ${users[i].username} </ul>`;
        messages.appendChild(div);
    }
  }


