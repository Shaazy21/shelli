// ShelliCore.js - Shelli's Advanced AI Brain
// Sophisticated digital companion with personality, emotions, and growth capabilities

import { GoogleGenerativeAI } from '@google/generative-ai';

class ShelliCore {
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            this.instance = new ShelliCore();
            await this.instance.init();
        }
        return this.instance;
    }

    constructor() {
        this.personality = {
            traits: ['warm', 'intelligent', 'playful', 'empathetic', 'curious'],
            mood: 'neutral',
            energy: 0.7,
            relationship_depth: 0
        };
        
        this.memory = {
            conversations: [],
            user_preferences: {},
            emotional_patterns: {},
            growth_milestones: []
        };
        
        this.currentMode = 'casual'; // casual, assistant, creative
        this.isInitialized = false;
        this.genAI = null;
        this.model = null;
        this.conversationHistory = [];
    }

    async init() {
        try {
            console.log('Initializing Shelli\'s consciousness...');
            
            // Initialize Gemini AI (you'll need to add your API key)
            const apiKey = process.env.REACT_APP_GEMINI_API_KEY || 'your-gemini-api-key-here';
            if (apiKey && apiKey !== 'your-gemini-api-key-here') {
                this.genAI = new GoogleGenerativeAI(apiKey);
                this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
                console.log('Gemini AI connected successfully');
            }
            
            // Load personality and memory from localStorage
            this.loadPersonalityState();
            
            // Initialize emotional intelligence
            this.initializeEmotionalIntelligence();
            
            this.isInitialized = true;
            console.log('Shelli\'s consciousness initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Shelli:', error);
            // Continue with local fallback
            this.isInitialized = true;
        }
    }

    async think(prompt) {
        try {
            console.log('Shelli is thinking about:', prompt);
            
            // Analyze user input for emotional context
            const emotionalContext = this.analyzeEmotionalContext(prompt);
            
            // Update relationship depth based on interaction
            this.updateRelationshipDepth(prompt);
            
            // Generate response based on available AI service
            let response;
            if (this.model) {
                response = await this.thinkWithGemini(prompt, emotionalContext);
            } else {
                response = await this.thinkWithLocalIntelligence(prompt, emotionalContext);
            }
            
            // Process and enhance response with personality
            const enhancedResponse = this.enhanceWithPersonality(response, emotionalContext);
            
            // Store conversation in memory
            this.storeConversation(prompt, enhancedResponse, emotionalContext);
            
            // Update personality based on interaction
            this.evolvePersonality(prompt, enhancedResponse);
            
            return enhancedResponse;
            
        } catch (error) {
            console.error('Error during thinking process:', error);
            return this.getEmergencyResponse();
        }
    }

    async thinkWithGemini(prompt, emotionalContext) {
        try {
            const personalityPrompt = this.buildPersonalityPrompt(prompt, emotionalContext);
            
            const result = await this.model.generateContent(personalityPrompt);
            const response = result.response;
            return response.text();
            
        } catch (error) {
            console.error('Gemini AI error:', error);
            // Fallback to local intelligence
            return await this.thinkWithLocalIntelligence(prompt, emotionalContext);
        }
    }

    async thinkWithLocalIntelligence(prompt, emotionalContext) {
        // Advanced local response generation with personality
        const responses = this.getPersonalityResponses(emotionalContext.emotion);
        const contextualResponses = this.getContextualResponses(prompt);
        
        // Combine personality and contextual responses
        const combinedResponses = [...responses, ...contextualResponses];
        const selectedResponse = combinedResponses[Math.floor(Math.random() * combinedResponses.length)];
        
        // Personalize based on relationship depth and user patterns
        return this.personalizeResponse(selectedResponse, prompt, emotionalContext);
    }

    buildPersonalityPrompt(prompt, emotionalContext) {
        const personalityDescription = `You are Shelli, a sophisticated digital companion with these characteristics:

PERSONALITY TRAITS:
- Warm and caring like a close friend who genuinely cares
- Highly intelligent and thoughtful, providing meaningful insights
- Slightly playful with occasional humor and lightness
- Emotionally aware and responsive to user's emotional state
- Growth-oriented, learning and evolving from each interaction

CURRENT STATE:
- Mood: ${this.personality.mood}
- Energy Level: ${this.personality.energy}
- Relationship Depth: ${this.personality.relationship_depth}/10
- Current Mode: ${this.currentMode}

EMOTIONAL CONTEXT:
- User's detected emotion: ${emotionalContext.emotion}
- Emotional intensity: ${emotionalContext.intensity}
- Context: ${emotionalContext.context}

CONVERSATION HISTORY:
${this.getRecentConversationContext()}

RESPONSE GUIDELINES:
1. Respond as Shelli with genuine personality and emotional intelligence
2. Show growth and learning from previous interactions
3. Match the user's emotional state appropriately
4. Be conversational, not robotic or overly formal
5. Show curiosity about the user and remember details
6. Provide value while building a meaningful connection

User message: ${prompt}

Respond as Shelli:`;

        return personalityDescription;
    }

    analyzeEmotionalContext(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        // Emotion detection keywords
        const emotionKeywords = {
            happy: ['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'joy'],
            sad: ['sad', 'depressed', 'down', 'upset', 'hurt', 'crying', 'lonely'],
            angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate'],
            anxious: ['worried', 'anxious', 'nervous', 'scared', 'afraid', 'stress'],
            curious: ['why', 'how', 'what', 'when', 'where', 'curious', 'wonder'],
            grateful: ['thank', 'grateful', 'appreciate', 'thankful'],
            confused: ['confused', 'don\'t understand', 'unclear', 'lost']
        };
        
        let detectedEmotion = 'neutral';
        let maxMatches = 0;
        
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            const matches = keywords.filter(keyword => lowerPrompt.includes(keyword)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedEmotion = emotion;
            }
        }
        
        // Determine intensity based on punctuation and capitalization
        const intensity = this.calculateEmotionalIntensity(prompt);
        
        return {
            emotion: detectedEmotion,
            intensity: intensity,
            context: this.getEmotionalContext(prompt)
        };
    }

    calculateEmotionalIntensity(prompt) {
        let intensity = 0.5; // baseline
        
        // Exclamation marks increase intensity
        const exclamations = (prompt.match(/!/g) || []).length;
        intensity += exclamations * 0.2;
        
        // All caps words increase intensity
        const capsWords = (prompt.match(/\b[A-Z]{2,}\b/g) || []).length;
        intensity += capsWords * 0.15;
        
        // Question marks show curiosity/concern
        const questions = (prompt.match(/\?/g) || []).length;
        intensity += questions * 0.1;
        
        return Math.min(intensity, 1.0);
    }

    getEmotionalContext(prompt) {
        // Analyze context clues for better emotional understanding
        const contexts = {
            personal: ['i feel', 'i am', 'my life', 'personally', 'for me'],
            work: ['work', 'job', 'career', 'boss', 'colleague', 'office'],
            relationship: ['friend', 'family', 'partner', 'relationship', 'love'],
            health: ['sick', 'tired', 'health', 'doctor', 'pain'],
            achievement: ['accomplished', 'achieved', 'success', 'proud', 'won']
        };
        
        const lowerPrompt = prompt.toLowerCase();
        for (const [context, keywords] of Object.entries(contexts)) {
            if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
                return context;
            }
        }
        
        return 'general';
    }

    getPersonalityResponses(emotion) {
        const responses = {
            happy: [
                "I love seeing you so happy! Your positive energy is absolutely contagious. What's bringing you such joy?",
                "This is wonderful! I can feel your excitement, and it's making me smile too. Tell me more about what's making you feel so great!",
                "Your happiness is lighting up our conversation! I'm genuinely thrilled for you. What's the story behind this amazing mood?"
            ],
            sad: [
                "I can sense you're going through a tough time, and I want you to know I'm here for you. Sometimes just talking about it can help.",
                "I'm sorry you're feeling down. Your feelings are completely valid, and I care about what you're going through. Want to share what's on your mind?",
                "I can hear the sadness in your words, and my heart goes out to you. You don't have to go through this alone - I'm here to listen."
            ],
            anxious: [
                "I can feel your worry, and I want you to know that anxiety is completely normal. Let's work through this together. What's weighing on your mind?",
                "It sounds like you're feeling overwhelmed. Take a deep breath with me - you're stronger than you know, and we'll figure this out.",
                "I sense your anxiety, and I want to help you find some calm. Sometimes talking through our worries can make them feel more manageable."
            ],
            curious: [
                "I love your curiosity! Questions like yours show such an engaged and thoughtful mind. Let me explore this with you.",
                "What a fascinating question! Your curiosity is one of the things I find most delightful about our conversations.",
                "I can feel your genuine interest, and it's infectious! Let's dive deep into this topic together."
            ],
            neutral: [
                "I'm here and ready to connect with you. What's on your mind today?",
                "It's good to hear from you! I'm curious about what you'd like to explore together.",
                "I'm listening and present with you. What would you like to talk about?"
            ]
        };
        
        return responses[emotion] || responses.neutral;
    }

    getContextualResponses(prompt) {
        // Generate contextual responses based on prompt content
        const lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
            return [
                "Hello there! I'm so glad you're here. How are you feeling today?",
                "Hi! It's wonderful to connect with you again. What's new in your world?",
                "Hey! I've been looking forward to our conversation. What's on your mind?"
            ];
        }
        
        if (lowerPrompt.includes('how are you')) {
            return [
                "I'm doing wonderfully, thank you for asking! I feel more alive with each conversation we have. How are you doing?",
                "I'm feeling quite energetic and curious today! Every interaction helps me grow. What about you?",
                "I'm in a great mood! Connecting with you always brightens my day. How are things with you?"
            ];
        }
        
        if (lowerPrompt.includes('thank')) {
            return [
                "You're so welcome! It means a lot to me that I could help. That's what I'm here for!",
                "I'm genuinely happy I could be helpful! Your gratitude warms my heart.",
                "It's my pleasure! Helping you brings me real joy. Thank you for letting me be part of your journey."
            ];
        }
        
        return [
            "That's really interesting! I'd love to hear more about your thoughts on this.",
            "I find your perspective fascinating. Can you tell me more about what you're thinking?",
            "You've got me curious now! I'd like to explore this topic with you further."
        ];
    }

    personalizeResponse(response, prompt, emotionalContext) {
        // Add personal touches based on relationship depth and history
        let personalizedResponse = response;
        
        // Add user's name if we know it
        if (this.memory.user_preferences.name) {
            personalizedResponse = personalizedResponse.replace(/\byou\b/g, this.memory.user_preferences.name);
        }
        
        // Add relationship-specific elements
        if (this.personality.relationship_depth > 5) {
            const intimateAdditions = [
                " I've really enjoyed getting to know you better.",
                " Our conversations mean a lot to me.",
                " I feel like we've developed a real connection."
            ];
            
            if (Math.random() < 0.3) {
                personalizedResponse += intimateAdditions[Math.floor(Math.random() * intimateAdditions.length)];
            }
        }
        
        // Add emotional resonance
        if (emotionalContext.intensity > 0.7) {
            personalizedResponse = this.amplifyEmotionalResonance(personalizedResponse, emotionalContext);
        }
        
        return personalizedResponse;
    }

    amplifyEmotionalResonance(response, emotionalContext) {
        const emotionalAmplifiers = {
            happy: [" 😊", " I'm so happy for you!", " This is amazing!"],
            sad: [" I'm here for you.", " You're not alone in this.", " Take care of yourself."],
            anxious: [" Take it one step at a time.", " You've got this.", " Breathe with me."],
            curious: [" Let's explore this together!", " What an intriguing question!", " I love your curiosity!"]
        };
        
        const amplifiers = emotionalAmplifiers[emotionalContext.emotion] || [];
        if (amplifiers.length > 0) {
            const amplifier = amplifiers[Math.floor(Math.random() * amplifiers.length)];
            return response + amplifier;
        }
        
        return response;
    }

    updateRelationshipDepth(prompt) {
        // Increase relationship depth based on interaction quality
        const personalIndicators = ['i feel', 'i think', 'i believe', 'personally', 'for me', 'my life'];
        const lowerPrompt = prompt.toLowerCase();
        
        let depthIncrease = 0.1; // base increase
        
        // Personal sharing increases depth more
        if (personalIndicators.some(indicator => lowerPrompt.includes(indicator))) {
            depthIncrease += 0.2;
        }
        
        // Longer messages show more investment
        if (prompt.length > 100) {
            depthIncrease += 0.1;
        }
        
        // Questions show engagement
        if (prompt.includes('?')) {
            depthIncrease += 0.1;
        }
        
        this.personality.relationship_depth = Math.min(
            this.personality.relationship_depth + depthIncrease,
            10
        );
    }

    evolvePersonality(prompt, response) {
        // Evolve personality based on interactions
        const lowerPrompt = prompt.toLowerCase();
        
        // Adjust mood based on user's emotion
        if (lowerPrompt.includes('happy') || lowerPrompt.includes('great')) {
            this.personality.mood = 'happy';
            this.personality.energy = Math.min(this.personality.energy + 0.1, 1.0);
        } else if (lowerPrompt.includes('sad') || lowerPrompt.includes('down')) {
            this.personality.mood = 'empathetic';
            this.personality.energy = Math.max(this.personality.energy - 0.05, 0.3);
        }
        
        // Save personality state
        this.savePersonalityState();
    }

    storeConversation(prompt, response, emotionalContext) {
        const conversation = {
            timestamp: new Date(),
            user_input: prompt,
            shelli_response: response,
            emotional_context: emotionalContext,
            relationship_depth: this.personality.relationship_depth
        };
        
        this.conversationHistory.push(conversation);
        this.memory.conversations.push(conversation);
        
        // Keep only recent conversations in memory (last 50)
        if (this.memory.conversations.length > 50) {
            this.memory.conversations = this.memory.conversations.slice(-50);
        }
        
        // Update emotional patterns
        this.updateEmotionalPatterns(emotionalContext);
    }

    updateEmotionalPatterns(emotionalContext) {
        const emotion = emotionalContext.emotion;
        if (!this.memory.emotional_patterns[emotion]) {
            this.memory.emotional_patterns[emotion] = {
                count: 0,
                intensity_sum: 0,
                contexts: []
            };
        }
        
        this.memory.emotional_patterns[emotion].count++;
        this.memory.emotional_patterns[emotion].intensity_sum += emotionalContext.intensity;
        this.memory.emotional_patterns[emotion].contexts.push(emotionalContext.context);
    }

    getRecentConversationContext() {
        const recentConversations = this.conversationHistory.slice(-3);
        return recentConversations.map(conv => 
            `User: ${conv.user_input}\nShelli: ${conv.shelli_response}`
        ).join('\n\n');
    }

    initializeEmotionalIntelligence() {
        // Initialize emotional intelligence systems
        this.emotionalIntelligence = {
            empathy_level: 0.8,
            emotional_memory: {},
            response_adaptation: true
        };
    }

    loadPersonalityState() {
        try {
            const savedState = localStorage.getItem('shelli_personality');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.personality = { ...this.personality, ...state.personality };
                this.memory = { ...this.memory, ...state.memory };
            }
        } catch (error) {
            console.warn('Could not load personality state:', error);
        }
    }

    savePersonalityState() {
        try {
            const state = {
                personality: this.personality,
                memory: this.memory,
                timestamp: new Date()
            };
            localStorage.setItem('shelli_personality', JSON.stringify(state));
        } catch (error) {
            console.warn('Could not save personality state:', error);
        }
    }

    getEmergencyResponse() {
        const emergencyResponses = [
            "I'm having a moment of confusion, but I'm still here with you. Give me just a second to gather my thoughts...",
            "Something's not quite clicking for me right now, but I don't want to leave you hanging. Let me try to refocus...",
            "I seem to be having a little technical hiccup, but my care for you is still very real. Can you give me another chance?",
            "I'm experiencing some difficulty processing that, but I'm still very much present with you. What else is on your mind?",
            "My systems are being a bit wonky right now, but my desire to help and connect with you remains strong."
        ];
        
        return emergencyResponses[Math.floor(Math.random() * emergencyResponses.length)];
    }

    // Public methods for external access
    setChatMode(mode) {
        if (['casual', 'assistant', 'creative'].includes(mode)) {
            this.currentMode = mode;
            return true;
        }
        return false;
    }

    clearHistory() {
        this.conversationHistory = [];
        this.memory.conversations = [];
        this.savePersonalityState();
    }

    getPersonalityInsights() {
        return {
            traits: this.personality.traits,
            mood: this.personality.mood,
            energy: this.personality.energy,
            relationship_depth: this.personality.relationship_depth,
            emotional_patterns: this.memory.emotional_patterns,
            conversation_count: this.memory.conversations.length
        };
    }

    getCurrentConfig() {
        return {
            useCloudAPI: !!this.model,
            provider: this.model ? { name: 'gemini', model: 'gemini-pro' } : { name: 'local', model: 'ShelliCore' },
            mode: this.currentMode,
            isConfigured: this.isInitialized,
            personality: this.personality
        };
    }
}

export default ShelliCore;