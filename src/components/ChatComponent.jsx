import React, { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([...messages, { text: input, fromUser: true }]);
    setInput('');

    try {
      const response = await axios.post('https://gemini.google.com/v1/chat/completions', {
        model: 'gemini-1',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: input }
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_GEMINI_API_KEY`,
        },
      });

      const reply = response.data.choices[0].message.content;
      setMessages([...messages, { text: input, fromUser: true }, { text: reply, fromUser: false }]);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={msg.fromUser ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
