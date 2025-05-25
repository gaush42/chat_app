const token = localStorage.getItem('token');
let selectedGroupId = null;
let socket = null;

window.onload = async () => {
  if (!token) {
    alert("Not logged in. Redirecting...");
    window.location.href = 'html/login.html';
  } else {
    setupSocket();
    loadGroups();
  }
};

function setupSocket() {
  socket = io({
    auth: {
      token
    }
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket');
  });

  socket.on('newMessage', (message) => {
    if (message.group_id === selectedGroupId) {
      displayMessage(message);
    }
  });

  socket.on('error', (msg) => {
    alert(`Socket error: ${msg}`);
  });
}

async function loadGroups() {
  try {
    const res = await axios.get('/api/my-groups', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const groups = res.data.groups;
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = '';
    groups.forEach(group => {
      const li = document.createElement('li');
      li.textContent = group.name;
      li.style.cursor = 'pointer';
      li.onclick = () => loadMessages(group.id);
      groupList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}
async function joinGroup() {
  const groupId = document.getElementById('groupIdInput').value;
  if (!groupId) return alert("Please enter a group ID.");

  try {
    await axios.post('/api/join', { groupId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Successfully joined group');
    loadGroups(); // reload the group list
    loadMessages(groupId);
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Failed to join group');
  }
}

async function loadMessages(groupId) {
  selectedGroupId = groupId;

  // Join group socket room
  socket.emit('joinGroup', { groupId });

  try {
    const res = await axios.get(`/api/${groupId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const messages = res.data.messages;
    const messageBox = document.getElementById('messages');
    messageBox.innerHTML = '';
    messages.forEach(displayMessage);
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Failed to load messages');
  }
}

function displayMessage(msg) {
  const p = document.createElement('p');
  p.textContent = `${msg.user?.fullname || msg.User?.fullname}: ${msg.content}`;
  document.getElementById('messages').appendChild(p);
}

function sendMessage() {
  const content = document.getElementById('messageInput').value.trim();
  if (!selectedGroupId || !content) return;

  socket.emit('sendMessage', { groupId: selectedGroupId, content });
  document.getElementById('messageInput').value = '';
}
