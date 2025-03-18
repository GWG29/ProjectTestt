// Chat functionality with Gemini API integration
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const messageForm = document.querySelector('.input form');
    const messageInput = document.querySelector('.input input');
    const messagesContainer = document.querySelector('.messages');
    const usersList = document.querySelectorAll('.user');

    // Load configuration from gemini-config.json
    let config;
    
    // Function to load the configuration
    async function loadConfig() {
        try {
            const response = await fetch('gemini-config.json');
            config = await response.json();
            return config;
        } catch (error) {
            console.error('Error loading configuration:', error);
            // Fallback configuration
            return {
                api: {
                    key: 'AIzaSyChgYVYwsss6cSu57Z1jSCCzoS0lp6ak2Q',
                    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                    model: 'gemini-2.0-flash'
                },
                responses: {
                    welcome: "Hello! I'm your AI assistant. How can I help you today?",
                    error: "Sorry, I encountered an error. Please try again."
                },
                settings: {
                    typing_indicator_delay: 1000
                }
            };
        }
    }

    // Current active user
    let currentUser = 'User 1';

    // Initialize chat
    async function initChat() {
        // Load configuration first
        config = await loadConfig();
        
        // Add event listeners
        messageForm.addEventListener('submit', sendMessage);
        
        // Add click event to users in sidebar
        usersList.forEach(user => {
            user.addEventListener('click', function() {
                // Remove active class from all users
                usersList.forEach(u => u.classList.remove('active'));
                // Add active class to clicked user
                this.classList.add('active');
                // Update current user
                currentUser = this.textContent.trim();
                // Update chat header
                document.querySelector('.chat-user span').textContent = currentUser;
                // Clear messages
                messagesContainer.innerHTML = '';
                // Add a welcome message
                addBotMessage(config.responses.welcome || `Hello! I'm your AI assistant. How can I help you today?`);
            });
        });

        // Add initial bot message
        addBotMessage(config.responses.welcome || `Hello! I'm your AI assistant. How can I help you today?`);
    }

    // Send message function
    async function sendMessage(e) {
        e.preventDefault();
        
        const messageText = messageInput.value.trim();
        if (!messageText) return;
        
        // Add user message to chat
        addUserMessage(messageText);
        
        // Clear input
        messageInput.value = '';
        
        try {
            // Show typing indicator
            const typingIndicator = addTypingIndicator();
            
            // Get response from Gemini API
            const response = await getGeminiResponse(messageText);
            
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot response to chat
            addBotMessage(response);
            
        } catch (error) {
            console.error('Error getting response:', error);
            addBotMessage('Sorry, I encountered an error. Please try again.');
        }
    }

    // Add user message to chat
    function addUserMessage(text) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <p>${text}</p>
            <span class="message-time">${time}</span>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(text) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message received';
        messageDiv.innerHTML = `
            <p>${text}</p>
            <span class="message-time">${time}</span>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add typing indicator
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message received typing-indicator';
        typingDiv.innerHTML = '<p><span>.</span><span>.</span><span>.</span></p>';
        
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
        
        return typingDiv;
    }

    // Get response from Gemini API
    async function getGeminiResponse(message) {
        try {
            // Make sure config is loaded
            if (!config) {
                config = await loadConfig();
            }
            
            // Check if we should use predefined responses first
            if (config.settings.use_predefined_responses) {
                const predefinedResponse = checkPredefinedResponses(message);
                if (predefinedResponse) {
                    return predefinedResponse;
                }
            }
            
            // If use_api is false, return fallback response
            if (!config.settings.use_api) {
                return config.responses.fallback || "I'm not sure how to respond to that.";
            }
            
            // Make actual API call to Gemini
            const response = await fetch(`${config.api.url}?key=${config.api.key}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return config?.responses?.error || 'Sorry, I encountered an error. Please try again.';
        }
    }
    
    // Check for predefined responses based on keywords
    function checkPredefinedResponses(message) {
        if (!config || !config.predefined_responses) return null;
        
        const lowerMessage = message.toLowerCase();
        
        for (const item of config.predefined_responses) {
            if (item.keywords && item.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return item.response;
            }
        }
        
        return null;
    }

    // Scroll to bottom of messages container
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Initialize the chat
    (async function() {
        await initChat();
    })();
});

// Add CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
.typing-indicator p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
}

.typing-indicator span {
    height: 8px;
    width: 8px;
    background: #888;
    border-radius: 50%;
    display: inline-block;
    margin: 0 2px;
    animation: bounce 1.3s linear infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes bounce {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-4px);
    }
}
`;
document.head.appendChild(style);