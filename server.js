const chatForm = document.getElementById('chatForm');
const chatPanel = document.getElementById('chatPanel');
const messageInput = document.getElementById('messageInput');
const clearBtn = document.getElementById('clearBtn');
const modeSelect = document.getElementById('modeSelect');

const sessionKey = 'ai-terminal-session-id';
const sessionId = localStorage.getItem(sessionKey) || crypto.randomUUID();
localStorage.setItem(sessionKey, sessionId);

function addMessage(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role}`;

  const label = document.createElement('strong');
  label.textContent = role === 'user' ? 'You' : 'Assistant';

  const textNode = document.createElement('p');
  textNode.textContent = text;

  wrapper.appendChild(label);
  wrapper.appendChild(textNode);
  chatPanel.appendChild(wrapper);
  chatPanel.scrollTop = chatPanel.scrollHeight;
}

async function sendMessage(event) {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  const selectedMode = modeSelect.value;
  addMessage('user', text);
  messageInput.value = '';

  const placeholder = document.createElement('div');
  placeholder.className = 'message bot';
  placeholder.innerHTML = '<strong>Assistant</strong><p>Thinking...</p>';
  chatPanel.appendChild(placeholder);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId, mode: selectedMode }),
    });

    const data = await response.json();
    placeholder.remove();

    if (!response.ok) {
      addMessage('bot', data.error || 'Something went wrong.');
      return;
    }

    const responseText = data.toolUsed ? data.reply : data.reply || 'No response returned.';
    addMessage('bot', responseText);
  } catch (error) {
    placeholder.remove();
    addMessage('bot', 'Unable to reach the AI service right now.');
  }
}

clearBtn.addEventListener('click', () => {
  chatPanel.innerHTML = `
    <div class="message bot">
      <strong>Assistant</strong>
      <p>Conversation cleared. Ask me anything.</p>
    </div>
  `;
  localStorage.setItem(sessionKey, crypto.randomUUID());
});

chatForm.addEventListener('submit', sendMessage);

if (chatPanel) {
  chatPanel.scrollTop = chatPanel.scrollHeight;
}
"}],