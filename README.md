# AI Chat Bot

A sleek and modern web-based chatbot application powered by Google's Gemini API. Chat with an intelligent AI assistant with support for text and image inputs.
Vercel-ai-powered-chatbot-o7813mmvh-manavs-projects-f7069ffe.vercel.app

## Features

✨ **Core Features**
- 💬 Real-time AI conversations using Google Gemini API
- 🖼️ Image support - analyze multiple images in your messages
- 📁 Chat history persistence with localStorage
- 💾 Export chat conversations (Text and JSON formats)
- 🧹 Clear chat history with one click
- ⏹️ Stop generation mid-response
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **API**: Google Generative AI (Gemini 3 Flash)
- **Storage**: LocalStorage for chat history
- **Design**: Modern glassmorphism UI with smooth animations

## Project Structure

```
12.Ai ChatBot/
├── index.html      # Main HTML file
├── style.css       # Styling with theme variables
├── script.js       # JavaScript logic and API integration
├── ai.png          # AI avatar image
├── img.svg         # Image upload icon
├── submit.svg      # Submit button icon
└── README.md       # This file
```

## Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Google Generative AI API key

### Installation

1. **Clone or download the project** files to your local machine

2. **Get your API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

3. **Add your API Key** (Optional - already included in the project):
   - Open `script.js`
   - Find the line: `const API_KEY="YOUR_API_KEY_HERE"`
   - Replace with your actual API key (or use the existing one)

4. **Open the application**:
   - Simply open `index.html` in your web browser
   - No server setup required!

## Usage

### Sending Messages
1. Type your message in the input field
2. Press Enter or click the send button (➤)
3. Wait for the AI response

### Using Images
1. Click the image button (📷) in the message area
2. Select one or multiple images from your computer
3. The images will appear as previews
4. Type your message and send
5. The AI will analyze the images and respond

### Managing Chat
- **Export Chat**: Click the save button (💾) to export conversation
  - Choose between Text (.txt) or JSON format
- **Clear Chat**: Click the trash button (🗑️) to clear all messages
- **Stop Generation**: Click the stop button (⏹️) while AI is responding
- **Toggle Theme**: Click the moon/sun button (🌙/☀️) to switch themes

## Features in Detail

### Chat History
- All conversations are automatically saved to browser storage
- Chat history persists even after closing the browser
- Clear history manually or use the trash button

### Image Analysis
- Support for multiple image formats (PNG, JPG, GIF, WebP)
- Upload multiple images at once
- Intuitive preview system before sending
- Images are converted to base64 for API transmission

### Export Options
- **Text Format**: Clean, readable format perfect for documentation
- **JSON Format**: Structured data for data analysis or integration

### Responsive Design
- Works seamlessly on desktop, tablet, and mobile devices
- Adaptive layout for different screen sizes
- Touch-friendly interface on mobile

## API Configuration

The app uses Google's Gemini 3 Flash API endpoint:
```javascript
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"
```

### Rate Limits
- Free tier includes generous usage limits
- Check Google AI Studio for current quota information

## File Descriptions

### index.html
Main HTML structure including:
- Header with controls
- Chat container
- Message input area
- Image preview section

### style.css
Comprehensive styling with:
- CSS variables for theming
- Glassmorphism effects
- Smooth animations and transitions
- Dark/Light mode support
- Responsive breakpoints

### script.js
Core functionality including:
- API communication
- Chat message handling
- Image processing
- localStorage management
- Theme switching
- Export functionality


## License

This project is open source and available for personal and commercial use.


## Contributing

Feel free to fork, modify, and improve this project. Contributions are welcome!

---

**Happy chatting! 🚀**

*Last Updated: January 2026*
