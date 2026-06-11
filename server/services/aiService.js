/**
 * AI Service — Uses official Google Gemini API to generate content
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    // Initialize the Gemini API client
    this.apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      // Use gemini-1.5-flash for fast text generation
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async generatePropertyDescription({ title, propertyType, features, location, amenities }) {
    if (!this.model) throw new Error('Gemini API key is not configured');

    const prompt = `You are a professional real estate copywriter. Generate a compelling, professional property listing description for a rental property with these details:
    - Title: ${title}
    - Type: ${propertyType}
    - Bedrooms: ${features?.bedrooms || 'N/A'}, Bathrooms: ${features?.bathrooms || 'N/A'}
    - Area: ${features?.area || 'N/A'} sq ft
    - Furnished: ${features?.furnished || 'N/A'}
    - Location: ${location?.city || ''}, ${location?.state || ''}
    - Amenities: ${amenities?.join(', ') || 'None specified'}
    
    Write 2-3 engaging paragraphs. Be descriptive but concise. Do not use markdown headers, just plain paragraphs.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate description with Gemini');
    }
  }

  async getPropertyRecommendations(preferences) {
    if (!this.model) throw new Error('Gemini API key is not configured');

    const prompt = `You are an AI real estate advisor helping tenants find their perfect rental home.
    Based on these preferences, suggest what type of rental property would be ideal:
    ${JSON.stringify(preferences, null, 2)}
    
    Provide 3-5 specific recommendations with reasoning.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate recommendations with Gemini');
    }
  }

  async chatWithAssistant(message, conversationHistory = []) {
    // Build the system instructions + history + current message into a single prompt for flash
    let prompt = `You are a helpful AI assistant for RentNest, a rental property platform. 
    You can help tenants find properties, answer questions about the rental process, 
    provide tips for landlords, and assist with general queries about the platform.
    Be concise, friendly, and professional.\n\n`;

    // Append history
    if (conversationHistory.length > 0) {
      prompt += 'Conversation History:\n';
      conversationHistory.slice(-5).forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    prompt += `User: ${message}\nAssistant:`;

    if (this.model) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error('Gemini API Error:', error);
        // Fall through to fallback handler
      }
    }

    // Fallback: Simple keyword-based responses
    return this.generateFallbackResponse(message);
  }

  generateFallbackResponse(message) {
    const lowerMsg = message.toLowerCase();

    // Rent & pricing questions
    if (lowerMsg.includes('rent') || lowerMsg.includes('price') || lowerMsg.includes('cost')) {
      return 'Rent prices vary based on location, property type, and amenities. Use our smart search on the Properties page to filter by price range. You can also contact the landlord directly through the property details page for negotiation.';
    }

    // Availability questions
    if (lowerMsg.includes('available') || lowerMsg.includes('when') || lowerMsg.includes('date')) {
      return 'To check availability, visit the property detail page and use our booking system. You can select your desired check-in and check-out dates. The landlord will confirm your booking request within 24-48 hours.';
    }

    // Area & location questions
    if (lowerMsg.includes('area') || lowerMsg.includes('location') || lowerMsg.includes('neighborhood') || lowerMsg.includes('nearby')) {
      return 'Each property listing includes detailed location information, nearby amenities, schools, hospitals, and transportation options. Visit the property detail page to explore the area features.';
    }

    // Security questions
    if (lowerMsg.includes('security') || lowerMsg.includes('safe')) {
      return 'Security features vary by property. Check the amenities section on each property page to see what security features are available - such as CCTV, security guard, gated community, etc.';
    }

    // Parking questions
    if (lowerMsg.includes('parking') || lowerMsg.includes('car')) {
      return 'Parking availability depends on the individual property. Check the amenities section or contact the landlord directly to confirm parking options and any additional charges.';
    }

    // Booking questions
    if (lowerMsg.includes('book') || lowerMsg.includes('reserve') || lowerMsg.includes('booking')) {
      return 'To book a property, click the "Book This Property" button on the property detail page. Fill in your dates, select a payment method, and submit your booking request. The landlord will review and confirm within 24-48 hours.';
    }

    // Payment questions
    if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) {
      return 'We support multiple payment methods including credit/debit cards, UPI, Google Pay, and bank transfers. Choose your preferred method during the booking process.';
    }

    // Generic helpful response
    return 'I can help you with questions about:\n- Rent prices and property costs\n- Availability and booking process\n- Area details and neighborhoods\n- Nearby facilities and schools\n- Parking and security features\n- Payment methods\n\nWhat would you like to know?';
  }
  async parseSmartSearch(query) {
    const rawQuery = query || '';

    const normalizeType = (type) => {
      if (!type) return type;
      const map = {
        appartment: 'apartment',
        apt: 'apartment',
        flat: 'apartment',
        apartment: 'apartment',
        house: 'house',
        villa: 'villa',
        studio: 'studio',
        condo: 'condo',
        penthouse: 'penthouse',
      };
      return map[type.toLowerCase()] || type.toLowerCase();
    };

    const parsePriceValue = (value) => {
      const rawValue = value.toLowerCase().replace(/,/g, '').trim();
      if (/^[0-9]+k$/.test(rawValue)) {
        return parseInt(rawValue.slice(0, -1), 10) * 1000;
      }
      if (/^[0-9]+(?:\.[0-9]+)?m$/.test(rawValue)) {
        return parseFloat(rawValue.slice(0, -1)) * 1000000;
      }
      return parseFloat(rawValue);
    };

    const parsePlainText = (textToParse) => {
      const raw = textToParse.toLowerCase();
      const filters = {};

      const typeMatch = raw.match(/\b(appartment|apartment|apt|flat|house|villa|studio|condo|penthouse)\b/);
      if (typeMatch) filters.type = normalizeType(typeMatch[1]);

      const bedroomsMatch = raw.match(/(\d+)\s*(?:bedrooms?|beds?)/);
      if (bedroomsMatch) filters.bedrooms = parseInt(bedroomsMatch[1], 10);

      const furnishedMatch = raw.match(/\b(fully[- ]furnished|semi[- ]furnished|unfurnished)\b/);
      if (furnishedMatch) {
        filters.furnished = furnishedMatch[1].replace(' ', '-');
      }

      const betweenMatch = raw.match(/\b(?:between|from)\s*([0-9,.]+(?:k|m)?)\s*(?:and|to)\s*([0-9,.]+(?:k|m)?)\b/);
      if (betweenMatch) {
        filters.minPrice = parsePriceValue(betweenMatch[1]);
        filters.maxPrice = parsePriceValue(betweenMatch[2]);
      } else {
        const maxMatch = raw.match(/\b(?:under|below)\s*([0-9,.]+(?:k|m)?)\b/);
        if (maxMatch) filters.maxPrice = parsePriceValue(maxMatch[1]);

        const minMatch = raw.match(/\b(?:over|above)\s*([0-9,.]+(?:k|m)?)\b/);
        if (minMatch) filters.minPrice = parsePriceValue(minMatch[1]);
      }

      const cityMatch = textToParse.match(/\b(?:in|at|near|around)\s+([a-zA-Z][a-zA-Z\s]+?)(?=\s+(?:under|below|between|from|with|for|rent|per month|apartment|appartment|flat|house|villa|studio|condo|penthouse|bedrooms?|beds?)|$)/i);
      if (cityMatch) {
        filters.city = cityMatch[1].trim();
      }

      if (!filters.type && !filters.city && !filters.bedrooms && !filters.minPrice && !filters.maxPrice && !filters.furnished) {
        filters.search = textToParse.trim();
      }

      return filters;
    };

    if (!this.model) {
      return parsePlainText(rawQuery);
    }

    const prompt = `You are an AI assistant for a property rental platform. 
    A user typed the following search query: "${query}"
    
    Extract their preferences and return ONLY a valid JSON object with the following optional keys:
    - "city" (string)
    - "type" (string, must be one of: "apartment", "house", "villa", "studio", or empty)
    - "minPrice" (number)
    - "maxPrice" (number)
    - "bedrooms" (number)
    - "furnished" (string, must be one of: "unfurnished", "semi-furnished", "fully-furnished", or empty)
    
    If a preference is not mentioned, omit the key. Return nothing but the JSON object. Do not include markdown formatting like \`\`\`json.`;

    let text = '';
    try {
      const result = await this.model.generateContent(prompt);
      text = await result.response.text();
      text = text.replace(/```(?:json)?/g, '').trim();

      const jsonMatch = text.match(/\{[\s\S]*\}$/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Gemini API Parsing Error:', error, 'rawText:', text);

      // Fallback: try to extract JSON object from the model output
      try {
        const fallbackText = text.match(/\{[\s\S]*\}/)?.[0] || null;
        if (fallbackText) {
          return JSON.parse(fallbackText);
        }
      } catch (fallbackError) {
        console.error('Fallback JSON parse failed:', fallbackError);
      }

      return parsePlainText(text || rawQuery);
    }
  }

  async verifyPropertyDocument(imagePath, documentName) {
    // Fallback verification using document name and heuristics
    const verification = {
      isValid: true,
      confidence: 85,
      issues: [],
      summary: 'Document verified: Valid property document',
      reason: null,
    };

    const lowerName = documentName.toLowerCase();
    const validDocTypes = ['deed', 'lease', 'agreement', 'registration', 'certificate', 'tax', 'utility', 'bill', 'ownership', 'property', 'document', 'papers'];
    const hasValidType = validDocTypes.some(type => lowerName.includes(type));

    if (!hasValidType) {
      verification.isValid = false;
      verification.confidence = 30;
      verification.issues.push('Document type not recognized. Expected: property deed, lease, registration, tax document, etc.');
      verification.reason = 'Unclear document type. Please rename with property document type (e.g., "Property Deed", "Lease Agreement")';
    }

    // If AI model is available, use it for deeper verification
    if (this.model) {
      try {
        const prompt = `You are a property document verification AI. Analyze this document name and provide verification:
        
Document Name: "${documentName}"

Respond with JSON only (no markdown):
{
  "isValid": true/false,
  "confidence": 0-100,
  "issues": [],
  "summary": "brief summary"
}`;

        const result = await this.model.generateContent(prompt);
        const text = await result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiResult = JSON.parse(jsonMatch[0]);
          return {
            isValid: aiResult.isValid,
            confidence: aiResult.confidence,
            issues: aiResult.issues || [],
            summary: aiResult.summary,
            reason: aiResult.isValid ? null : aiResult.summary,
          };
        }
      } catch (error) {
        console.error('AI verification error:', error);
        // Fall back to heuristic verification
      }
    }

    return verification;
  }
}

module.exports = new AIService();
