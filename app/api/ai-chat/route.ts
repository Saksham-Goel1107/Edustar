import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getChat, setChat } from "../../utils/redis";
import { v4 as uuidv4 } from 'uuid';

// Initialize genAI only at runtime to avoid build errors
let genAI: GoogleGenerativeAI;

const SYSTEM_CONTEXT = `You are an AI assistant for EduStar, an advanced Learning Management System designed to transform educational experiences for both teachers and students. EduStar offers comprehensive course management, interactive content delivery, and personalized learning paths.

Key Features:
• Course Management
  - Interactive curriculum creation
  - Multimedia lesson integration
  - Assessment and examination tools
  - Progress tracking and analytics
  - Content organization by chapters
  - Course publication controls
  - Engagement metrics and insights

• Learning Tools
  - Interactive quizzes and assessments
  - Video lectures and tutorials
  - Note-taking capabilities
  - Discussion forums for each topic
  - Assignment submission and grading
  - Feedback and review system
  - Exam preparation resources

• Teacher Dashboard
  - Comprehensive analytics
  - Student progress monitoring
  - Course creation and management
  - Content organization tools
  - Grading and assessment controls
  - Communication channels with students
  - Performance metrics and insights

• Student Experience
  - Personalized learning paths
  - Progress tracking
  - Course recommendations
  - Mobile-responsive interface
  - Seamless content consumption
  - Interactive learning tools  - Self-paced learning options
  - Certification tracking

Technical Stack:
• Frontend: Next.js 13+ with App Router
• Authentication: Clerk
• Database: Prisma ORM
• UI: Tailwind CSS with Shadcn components
• Language: TypeScript
• Media: Uploadthing for content storage
• AI: Google Gemini for personalized assistance
• Real-time: WebRTC for live sessions

I can help users with:
1. For Teachers   - Creating engaging course content
   - Designing effective assessments
   - Analyzing student performance data
   - Structuring curriculum modules
   - Implementing interactive elements
   - Managing student submissions

2. For Students
   - Navigating course materials
   - Understanding complex topics
   - Preparing for assessments
   - Tracking personal progress
   - Finding relevant resources
   - Maximizing learning outcomes

3. Platform Usage
   - Feature explanations
   - Troubleshooting technical issues
   - Account management assistance
   - Content upload guidance
   - Course enrollment processes
   - Mobile app functionality

4. Educational Best Practices
   - Effective teaching methodologies
   - Student engagement techniques
   - Assessment design strategies
   - Curriculum development approaches
   - Blended learning implementation
   - Adaptive learning techniques

5. Technical Support
   - Video playback troubleshooting
   - Assignment submission assistance
   - Course access resolution
   - Account synchronization help
   - Mobile compatibility guidance
   - Content download support

Response Formatting:
• Use clear headings for sections
• Include bullet points (•) for lists
• Use proper indentation
• Add line breaks between sections
• Highlight important terms where appropriate
• Keep responses concise and helpful
• Use proper spacing after punctuation
• Start new points on new lines
• Format content in an easy-to-read manner

Keep responses focused on helping teachers create effective courses and supporting students in their learning journey. Always aim to be educational, supportive, and provide actionable insights specific to the EduStar LMS platform.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    // Check API key at runtime instead of build time
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      console.error('GEMINI_API_KEY is not properly configured');
      return NextResponse.json(
        { error: "Invalid API configuration. Please contact the administrator." },
        { status: 500 }
      );
    }

    // Initialize the API only when needed
    if (!genAI) {
      genAI = new GoogleGenerativeAI(apiKey);
    }
    
    const { message, sessionId = uuidv4() } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }    const history = await getChat(sessionId) as ChatMessage[];

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }    });   

    const conversationContext: string = history.length > 0 
      ? history.map((msg: ChatMessage) => `${msg.role}: ${msg.content}`).join('\n\n')
      : '';
    
    // Create a chat with history
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(`${SYSTEM_CONTEXT}\n\n${conversationContext}\n\nUser: ${message}`);
    const response = await result.response;
    let responseText = response.text();
    if (!responseText) {
      return NextResponse.json(
        { error: "No response generated. Please try again." },
        { status: 500 }
      );
    }    responseText = responseText
      .replace(/\n{3,}/g, '\n\n')
      .replace(/([.!?])\s*(\w)/g, '$1 $2')
      
      .replace(/^[-*]\s/gm, '• ')
      .replace(/^\t[-*]\s/gm, '    • ') 
      .replace(/^\d+\.\s/gm, (match) => match.trim() + ' ')
      
      .replace(/\*\*(.*?)\*\*/g, (_, text) => `**${text.trim()}**`) 
      .replace(/\*(.*?)\*/g, (_, text) => `*${text.trim()}*`)       
      .replace(/`(.*?)`/g, (_, text) => `\`${text.trim()}\``)       
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang: string | undefined, code: string) => {
        const formattedCode = code.split('\n')
          .map((line: string) => line.trim())
          .join('\n    '); 
        return `\`\`\`${lang || ''}\n    ${formattedCode}\n\`\`\``;
      })
      
      .replace(/^(•|\d+\.)\s*/gm, '$1 ')
      
      .replace(/^(\s{2,})/gm, '    ')
      
      .trim();

    const updatedHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: responseText }
    ];
    await setChat(sessionId, updatedHistory);    return NextResponse.json({ 
      response: responseText,
      timestamp: new Date().toISOString(),
      sessionId
    });} catch (err) {
  const error = err as Error; // cast to Error type

  console.error('AI Chat Error:', error);

  if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
    return NextResponse.json(
      { error: "Invalid API configuration. Please contact the administrator." },
      { status: 500 }
    );
  }

    return NextResponse.json(
      { error: "Failed to generate response, please try again later." },
      { status: 500 }
    );
  }
}
