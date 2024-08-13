// reference: https://github.com/groq/groq-typescript

import Groq from 'groq-sdk'; // Import the Groq client library

const systemPrompt = `You are a personal AI assistant. Your mission is to assist a user with his doubts on different subjects such as math, history, geography, science, politics, fashion, art, literature, languages, culture, and many more.`// Use your own system prompt here

// Initialize Groq API client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try{ 
    const data = await req.json()
    //console.log(data)
    // Create the chat completion using Groq API
    const chatCompletion = await groq.chat.completions.create({

    messages: [{role: 'system', content: systemPrompt}, ...data],
    model: 'llama3-8b-8192',
    });

    //console.log(chatCompletion.choices[0].message.content)
    return new Response(JSON.stringify({response:chatCompletion.choices[0].message.content}))
  }
  catch(err) {
    if (err instanceof Groq.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
      // ERROR HANDLING MUST BE TESTED: HOW TO SEND AN ERROR RESPONSE SUCH THAT IT IS CATCHED?
     return NextResponse.status(400).json({ error: 'An error occurred while processing your request' }, { status: 500 })
    } else {
      //throw err;
      // ERROR HANDLING MUST BE TESTED
      return NextResponse.status(500).json(
        { error: 'An error occurred while processing your request.' },
        { status: 500 }
      );
      
    }
  }
}