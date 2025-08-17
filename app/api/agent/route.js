import { google } from "googleapis"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function getRecentEmails(auth) {
  try {
    const gmail = google.gmail({ version: "v1", auth })
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5,
      q: "is:inbox",
    })
    
    const messages = res.data.messages || []
    if (messages.length === 0) {
      return "You have no recent emails in your inbox."
    }
    
    let emailSummaries = "Here are your 5 most recent emails:\n\n"

    for (const message of messages) {
      const msg = await gmail.users.messages.get({ 
        userId: "me", 
        id: message.id,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"]
      })
      
      const headers = msg.data.payload?.headers || []
      const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)"
      const from = headers.find(h => h.name === "From")?.value || "Unknown Sender"
      const date = headers.find(h => h.name === "Date")?.value || "Unknown Date"
      
      emailSummaries += `📧 **${subject}**\n`
      emailSummaries += `   From: ${from}\n`
      emailSummaries += `   Date: ${new Date(date).toLocaleDateString()}\n\n`
    }
    
    return emailSummaries
  } catch (error) {
    console.error("Error fetching emails:", error)
    return "Sorry, I couldn't fetch your emails. Please make sure you've granted the necessary permissions."
  }
}

async function sendEmail(auth, to, subject, body) {
  try {
    const gmail = google.gmail({ version: "v1", auth })
    
    // Create the email message
    const rawMessage = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      body,
    ].join("\n")

    // Encode the message
    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
    
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    })
    
    return `✅ Email sent successfully to ${to}!`
  } catch (error) {
    console.error("Error sending email:", error)
    return `❌ Failed to send email to ${to}. Please check the email address and try again.`
  }
}

export async function POST(req) {
  try {
    const { prompt, accessToken } = await req.json()

    if (!prompt || !accessToken) {
      return NextResponse.json(
        { error: "Missing prompt or access token." },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      )
    }

    // Set up Google OAuth2 client
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    // Set up Gemini with function calling
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      tools: [
        {
          functionDeclarations: [
            {
              name: "get_recent_emails",
              description: "Get the subject lines, senders, and dates of the 5 most recent emails from the user's Gmail inbox.",
              parameters: {
                type: "object",
                properties: {},
              },
            },
            {
              name: "send_email",
              description: "Send an email from the user's Gmail account to a specified recipient.",
              parameters: {
                type: "object",
                properties: {
                  to: { 
                    type: "string", 
                    description: "The recipient's email address." 
                  },
                  subject: { 
                    type: "string", 
                    description: "The subject line of the email." 
                  },
                  body: { 
                    type: "string", 
                    description: "The body content of the email." 
                  },
                },
                required: ["to", "subject", "body"],
              },
            },
          ],
        },
      ],
    })

    // Enhanced system prompt for better context
    const enhancedPrompt = `You are a helpful Gmail assistant. The user says: "${prompt}"

You can help with:
1. Reading recent emails (use get_recent_emails function)
2. Sending emails (use send_email function)

Always be conversational and helpful. If the user asks to send an email, make sure to extract or ask for the recipient, subject, and message content clearly.`

    // Start a chat session for better function calling handling
    const chat = model.startChat()
    const result = await chat.sendMessage(enhancedPrompt)
    const response = result.response
    
    // Check if the model wants to call a function
    const functionCall = response.functionCalls()?.[0]
    
    if (functionCall) {
      let apiResponse
      
      if (functionCall.name === "get_recent_emails") {
        apiResponse = await getRecentEmails(auth)
      } else if (functionCall.name === "send_email") {
        const { to, subject, body } = functionCall.args
        apiResponse = await sendEmail(auth, to, subject, body)
      } else {
        apiResponse = "Unknown function call."
      }

      // Send the function result back to the chat session
      const followUpResult = await chat.sendMessage([
        {
          functionResponse: {
            name: functionCall.name,
            response: {
              result: apiResponse,
            },
          },
        },
      ])
      
      const finalResponse = followUpResult.response.text()
      return NextResponse.json({ response: finalResponse })
    } else {
      // Direct text response from the model
      const textResponse = response.text()
      return NextResponse.json({ response: textResponse })
    }
  } catch (error) {
    console.error("Error in agent API:", error)
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error.message 
      },
      { status: 500 }
    )
  }
}
