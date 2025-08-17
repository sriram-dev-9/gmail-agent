# Personal Gmail Agent

A modern Gmail AI assistant built with Next.js 15, NextAuth v5, and Google's Gemini AI (2025).

## Features

- 🤖 **AI-Powered Email Management**: Chat with your Gmail using natural language
- 📧 **Read Recent Emails**: Get summaries of your latest inbox messages
- ✉️ **Send Emails**: Compose and send emails through AI assistance
- 🔐 **Secure Authentication**: Google OAuth integration with proper scope management
- 💬 **Conversational Interface**: Chat-based interaction with persistent history
- 🚀 **Modern Tech Stack**: Built with the latest Next.js 15 and React 19

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js v5 (Auth.js)
- **AI**: Google Gemini 1.5 Flash with Function Calling
- **Styling**: Tailwind CSS v4
- **APIs**: Gmail API, Google OAuth2
- **Language**: JavaScript (ES2024)

## Prerequisites

Before you begin, you'll need:

1. **Google Cloud Project** with Gmail API enabled
2. **Google OAuth2 Credentials** (Client ID & Secret)  
3. **Gemini API Key** from Google AI Studio
4. **Node.js 18+** and npm

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/sriram-dev-9/gmail-agent.git
cd mailagent
npm install
```

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Gmail API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 3. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key for your `.env.local` file

### 4. Environment Variables

Your `.env.local` should contain:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration  
AUTH_SECRET=your_random_secret_string

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# NextAuth URL
NEXTAUTH_URL=http://localhost:3000
```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to start using your Gmail agent!

## Usage

1. **Sign In**: Click "Sign in with Google" and authorize Gmail permissions
2. **Chat Interface**: Navigate to the agent page after signing in
3. **Commands**: Try these example prompts:
   - "Show me my recent emails"
   - "Send an email to john@example.com about our meeting"
   - "What emails did I receive today?"

## Gmail Permissions

This app requests the following Gmail scopes:
- `gmail.readonly`: Read your email messages
- `gmail.send`: Send emails on your behalf
- Basic profile information for authentication

## Security Features

- ✅ Secure OAuth2 flow with proper token handling
- ✅ Server-side API key protection
- ✅ Session-based authentication
- ✅ No sensitive data stored in localStorage
- ✅ HTTPS enforcement in production

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your production domain
5. Update Google OAuth redirect URLs

### Other Platforms

Ensure you:
- Set all environment variables
- Update OAuth redirect URLs
- Use HTTPS in production
- Set correct `NEXTAUTH_URL`

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

1. **"Access blocked" during OAuth**
   - Verify redirect URIs in Google Cloud Console
   - Check `NEXTAUTH_URL` matches current domain

2. **"Invalid credentials" errors**
   - Verify all environment variables are set
   - Check Google Cloud API is enabled

3. **Gemini API errors**
   - Verify API key is valid
   - Check quota limits in Google AI Studio

4. **Gmail permission errors**
   - Re-authenticate to refresh tokens
   - Check Gmail API is enabled

### Debug Mode

Set `NODE_ENV=development` for detailed error logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- 📧 Email: your-email@domain.com
- 🐛 Issues: GitHub Issues
- 📖 Docs: This README

---

Built with ❤️ in 2025 using Next.js 15 and Google Gemini AI
