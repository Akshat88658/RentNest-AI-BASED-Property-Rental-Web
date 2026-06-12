import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';
import aiService from '../services/aiService';
import propertyService from '../services/propertyService';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

function AIChat() {
  const { id: propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(!!propertyId);
  const messagesEndRef = useRef(null);
  const prevMessageCountRef = useRef(0);

  // Scroll to bottom only when new messages are added
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
      prevMessageCountRef.current = messages.length;
    }
  }, [messages]);

  // Load property if ID is provided
  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) {
        setIsLoadingProperty(false);
        return;
      }

      try {
        const res = await propertyService.getById(propertyId);
        setProperty(res.data.data);

        // Add initial system message with property context
        const propertyContext = `
Welcome to RentNest AI Assistant! I'm here to help you learn more about ${res.data.data.title}.

📍 Location: ${res.data.data.location?.city}, ${res.data.data.location?.state}
💰 Rent: ₹${res.data.data.price?.amount}/month
🛏️ ${res.data.data.features?.bedrooms} BHK | 🚿 ${res.data.data.features?.bathrooms} Baths | 📐 ${res.data.data.features?.area} sqft

Feel free to ask me questions about:
- Rent, security deposits, and booking terms
- Nearby metro, schools, and local facilities
- Furnishing details, utilities, and parking
        `;

        setMessages([{
          type: 'assistant',
          text: propertyContext.trim(),
          timestamp: new Date(),
        }]);
      } catch (error) {
        console.error('Failed to load property:', error);
        toast.error('Failed to load property context');
      } finally {
        setIsLoadingProperty(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const handleSendMessage = async (e, textOverride = '') => {
    if (e) e.preventDefault();
    const messageToSend = (textOverride || inputMessage).trim();
    if (!messageToSend) return;

    setInputMessage('');

    // Add user message
    setMessages((prev) => [...prev, {
      type: 'user',
      text: messageToSend,
      timestamp: new Date(),
    }]);

    setIsLoading(true);

    try {
      // Build context about the property
      let contextMessage = messageToSend;
      if (property) {
        contextMessage = `
About the property: ${property.title}
Location: ${property.location?.city}, ${property.location?.state}
Rent: ₹${property.price?.amount}/month
Bedrooms: ${property.features?.bedrooms}
Bathrooms: ${property.features?.bathrooms}
Area: ${property.features?.area} sqft
Type: ${property.propertyType}
Furnished: ${property.features?.furnished}
Amenities: ${property.amenities?.join(', ') || 'Not specified'}
Description: ${property.description}

Tenant Question: ${messageToSend}
        `;
      }

      const response = await aiService.chat(contextMessage, messages.map(m => ({
        role: m.type === 'assistant' ? 'model' : 'user',
        content: m.text,
      })));

      setMessages((prev) => [...prev, {
        type: 'assistant',
        text: response.data.data.reply,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = property ? [
    "What is the security deposit?",
    "Is parking facility available?",
    "Are pets allowed in this house?",
  ] : [
    "How to verify my listing?",
    "How does escrow payments work?",
    "Find luxury 2BHKs in Mumbai",
  ];

  if (isLoadingProperty) return <Loader />;

  return (
    <div className="page animate-fade-in" style={{ padding: '1rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="ai-chat-container">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-status">
              <div className="pulse-dot"></div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, padding: 0 }}>RentNest Copilot</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
                  {property ? `Listing assistant: ${property.title}` : 'AI Rental Assistant'}
                </span>
              </div>
            </div>
            <MdAutoAwesome style={{ color: 'var(--color-accent)' }} className="animate-float" size={18} />
          </div>

          {/* Messages area */}
          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                color: 'var(--color-text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }} className="animate-scale-in">
                <div style={{ fontSize: '2.5rem' }}>🤖</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '850', color: 'var(--color-text)', margin: 0 }}>Smart AI Consultation</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', maxWidth: '380px', lineHeight: '1.4' }}>
                  Ask me anything about deposits, lease rules, metro distances, or contract verification policies!
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type === 'user' ? 'user' : ''}`}>
                <div className="chat-avatar">
                  {msg.type === 'user' ? '👤' : '🤖'}
                </div>
                <div className="chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message">
                <div className="chat-avatar">🤖</div>
                <div className="chat-bubble" style={{ padding: '12px 16px' }}>
                  <div className="chat-typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Suggestions */}
          <div className="ai-chat-input-area">
            {/* Suggestion Chips */}
            <div className="chat-suggestions">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleSendMessage(null, sug)}
                  className="suggestion-chip"
                  disabled={isLoading}
                  style={{ border: 'none' }}
                >
                  {sug}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-wrapper">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={property ? "Ask about rules, parking, security..." : "Ask about properties, escrow policies..."}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AIChat;
