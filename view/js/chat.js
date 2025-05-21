// Dummy userId – in real app, get from login
const userId = 1;

document.getElementById('sendBtn').addEventListener('click', async () => {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (!message) return;

  try {
    // Send message to backend
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId })
    });

    const result = await response.json();
    if (response.ok) {
      addMessageToUI(message, 'sent');
      input.value = '';
    } else {
      alert(result.message || 'Failed to send message');
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
});

// Function to add a message to the chat window
function addMessageToUI(message, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;
  msgDiv.textContent = message;

  const chatBody = document.getElementById('chatBody');
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll
}
