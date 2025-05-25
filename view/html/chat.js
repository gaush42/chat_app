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
async function createGroup() {
  const name = document.getElementById('groupNameInput').value.trim();
  if (!name) return alert('Please enter a group name.');

  try {
    await axios.post('/api/create', { name }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Group created');
    loadGroups();
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Failed to create group');
  }
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
      li.onclick = () => loadMessages(group.id, group.name);
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

async function loadMessages(groupId, groupName) {
  selectedGroupId = groupId;

  // Join group socket room
  socket.emit('joinGroup', { groupId });
  document.getElementById('selectedGroupName').textContent = groupName;

  try {
    const res = await axios.get(`/api/${groupId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const messages = res.data.messages;
    const messageBox = document.getElementById('messages');
    messageBox.innerHTML = '';
    messages.forEach(displayMessage);
    showGroupInfo();
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Failed to load messages');
  }
}

function displayMessage(msg) {
  /*const p = document.createElement('p');
  p.textContent = `${msg.user?.fullname || msg.User?.fullname}: ${msg.content}`;
  document.getElementById('messages').appendChild(p);*/
  const div = document.createElement('div');
  div.classList.add('message');

  const currentUserId = parseJwt(token).userId;
  const senderId = msg.user?.id || msg.User?.id;

  if (senderId === currentUserId) {
    div.classList.add('right');
  } else {
    div.classList.add('left');
  }

  const senderName = msg.user?.fullname || msg.User?.fullname || 'Unknown';
  div.textContent = `${senderName}: ${msg.content}`;

  document.getElementById('messages').appendChild(div);
}

function sendMessage() {
  const content = document.getElementById('messageInput').value.trim();
  if (!selectedGroupId || !content) return;

  socket.emit('sendMessage', { groupId: selectedGroupId, content });
  document.getElementById('messageInput').value = '';
}

async function showGroupInfo() {
  if (!selectedGroupId) return;

  try {
    const res = await axios.get(`/api/${selectedGroupId}/info`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const group = res.data.group;
    //document.getElementById('selectedGroupName').textContent = group.name;

    const membersList = document.getElementById('groupMembersList');
    membersList.innerHTML = '';

    const currentUser = parseJwt(token).userId;
    console.log(currentUser)
    const isAdmin = group.GroupMembers.some(gm => gm.is_admin && gm.user_id === currentUser);
    console.log(isAdmin)

    group.GroupMembers.forEach(gm => {
      const li = document.createElement('li');
      li.textContent = gm.User.fullname;

      if (isAdmin && gm.user_id !== currentUser) {
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('member-action', 'remove-btn');
        removeBtn.onclick = () => removeMember(gm.user_id);

        const makeAdminBtn = document.createElement('button');
        makeAdminBtn.textContent = 'Make Admin';
        makeAdminBtn.classList.add('member-action', 'admin-btn');
        makeAdminBtn.onclick = () => makeAdmin(gm.user_id);

        li.appendChild(removeBtn);
        li.appendChild(makeAdminBtn);
      }

      membersList.appendChild(li);
    });

    //document.getElementById('groupInfoBox').style.display = 'block';
    document.getElementById('adminControls').style.display = isAdmin ? 'block' : 'none';

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Failed to load group info');
  }
}

async function addMember() {
  const email = document.getElementById('newMemberEmail').value.trim();
  if (!email) return alert('Enter email');

  try {
    await axios.post('/api/add-member', {
      groupId: selectedGroupId,
      email
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Member added');
    showGroupInfo();
    document.getElementById('newMemberEmail').value = '';
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Failed to add member');
  }
}

async function removeMember(userId) {
  try {
    await axios.post('/api/remove-member', {
      groupId: selectedGroupId,
      userId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Member removed');
    showGroupInfo();
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Failed to remove member');
  }
}

async function makeAdmin(userId) {
  try {
    await axios.post('/api/make-admin', {
      groupId: selectedGroupId,
      userId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Made admin');
    showGroupInfo();
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Failed to make admin');
  }
}

async function logout() {
  localStorage.removeItem('token');
  window.location.href = 'html/login.html';
}

// Utility to decode JWT (to get userId)
function parseJwt(token) {
  const base64 = token.split('.')[1];
  const decoded = atob(base64);
  return JSON.parse(decoded);
}
