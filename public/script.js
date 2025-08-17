const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

function geminiToHumanReadable(text) {
  // Replace code blocks
  text = text.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // Replace bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  // Replace italics
  text = text.replace(/\*(.*?)\*/g, '<i>$1</i>');
  // Replace line breaks
  text = text.replace(/\n/g, '<br>');
  return text;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const thinkingMessage = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.result) {
      thinkingMessage.innerHTML = geminiToHumanReadable(data.result);
    } else {
      thinkingMessage.textContent = 'Failed to reply message';
    }
  } catch (error) {
    console.error('Error getting respond message:', error);
    thinkingMessage.textContent = 'Failed getting respond message';
  }
});
