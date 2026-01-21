let prompt=document.querySelector("#prompt")
let submitbtn=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")
let themeToggle=document.querySelector("#themeToggle")
let clearChatBtn=document.querySelector("#clearChat")
let stopBtn=document.querySelector("#stopBtn")
let exportChatBtn=document.querySelector("#exportChat")
let imagePreviewContainer=document.querySelector("#imagePreviewContainer")
let imagePreviews=document.querySelector("#imagePreviews")
let clearImagesBtn=document.querySelector("#clearImages")

const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"
const API_KEY="AIzaSyC-v3TuQVst4UAgO1Rrm6xI-Fomvynj1k4"

let abortController = null;
let selectedImages = []; // Store multiple images

let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '☀️';
}

// Load chat history from localStorage
function loadChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
        chatContainer.innerHTML = history;
        chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: "smooth"});
    } else {
        // Show welcome message if no history
        let html=`<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
   Hello ! How Can I Help you Today?
    </div>`;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
    }
}

// Save chat history to localStorage
function saveChatHistory() {
    localStorage.setItem('chatHistory', chatContainer.innerHTML);
}

// Get current timestamp
function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Clear chat
clearChatBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
        chatContainer.innerHTML = '';
        localStorage.removeItem('chatHistory');
        // Show welcome message
        let html=`<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
   Hello ! How Can I Help you Today?
    </div>`;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
    }
});

// Stop generation
stopBtn.addEventListener('click', () => {
    if (abortController) {
        abortController.abort();
        stopBtn.classList.add('hidden');
        submitbtn.classList.remove('hidden');
    }
});

// Export chat functionality
exportChatBtn.addEventListener('click', () => {
    const format = prompt('Choose export format:\n1. Text\n2. JSON\n\nEnter 1 or 2:');
    
    if (format === '1') {
        exportAsText();
    } else if (format === '2') {
        exportAsJSON();
    }
});

function exportAsText() {
    const messages = [];
    const chatBoxes = chatContainer.querySelectorAll('.user-chat-box, .ai-chat-box');
    
    chatBoxes.forEach(box => {
        const isUser = box.classList.contains('user-chat-box');
        const textArea = box.querySelector(isUser ? '.user-chat-area' : '.ai-chat-area');
        const timestamp = textArea.querySelector('.timestamp')?.textContent || '';
        const text = textArea.textContent.replace('📋 Copy', '').replace(timestamp, '').trim();
        
        messages.push(`[${isUser ? 'You' : 'AI'}] ${timestamp}\n${text}\n`);
    });
    
    const content = messages.join('\n---\n\n');
    downloadFile('chat-export.txt', content, 'text/plain');
}

function exportAsJSON() {
    const messages = [];
    const chatBoxes = chatContainer.querySelectorAll('.user-chat-box, .ai-chat-box');
    
    chatBoxes.forEach(box => {
        const isUser = box.classList.contains('user-chat-box');
        const textArea = box.querySelector(isUser ? '.user-chat-area' : '.ai-chat-area');
        const timestamp = textArea.querySelector('.timestamp')?.textContent || '';
        const text = textArea.textContent.replace('📋 Copy', '').replace(timestamp, '').trim();
        
        messages.push({
            role: isUser ? 'user' : 'assistant',
            content: text,
            timestamp: timestamp
        });
    });
    
    const exportData = {
        exportDate: new Date().toISOString(),
        messages: messages
    };
    
    downloadFile('chat-export.json', JSON.stringify(exportData, null, 2), 'application/json');
}

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Clear selected images
clearImagesBtn.addEventListener('click', () => {
    selectedImages = [];
    imagePreviews.innerHTML = '';
    imagePreviewContainer.classList.add('hidden');
    image.src = 'img.svg';
    image.classList.remove('choose');
});

// Copy to clipboard function
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        button.textContent = '✓ Copied!';
        setTimeout(() => {
            button.textContent = '📋 Copy';
        }, 2000);
    });
}
 
async function generateResponse(aiChatBox) {

let text=aiChatBox.querySelector(".ai-chat-area")

    // Build parts array correctly - avoid nested arrays
    let parts = [{text: user.message}];
    
    // Add all selected images
    if(selectedImages.length > 0) {
        selectedImages.forEach(img => {
            parts.push({inline_data: img});
        });
    }

    // Create abort controller for stopping generation
    abortController = new AbortController();
    stopBtn.classList.remove('hidden');
    submitbtn.classList.add('hidden');

    let RequestOption={
        method:"POST",
        headers:{
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY
        },
        body:JSON.stringify({
            "contents":[
                {"parts": parts}
            ]
        }),
        signal: abortController.signal
    }
    
    try{
        console.log("Sending request to API...");
        let response= await fetch(Api_Url,RequestOption)
        let data=await response.json()
        console.log("API Response:", data);
        
        // Check if response has error
        if(!response.ok || data.error) {
            throw new Error(data.error?.message || `API Error: ${response.status}`);
        }
        
        // Check if candidates exist
        if(!data.candidates || !data.candidates[0]) {
            throw new Error("No response from AI");
        }
        
       let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
       
       // Add copy button and timestamp
       text.innerHTML = `
       <button class="copy-btn" onclick="copyToClipboard(\`${apiResponse.replace(/`/g, '\\`')}\`, this)">📋 Copy</button>
       ${apiResponse}
       <div class="timestamp">${getTimestamp()}</div>
       `;
    }
    catch(error){
        if (error.name === 'AbortError') {
            text.innerHTML = `<p style="color: #ff9800;">Generation stopped by user</p>`;
        } else {
            console.error("Error:", error);
            text.innerHTML = `<p style="color: #ff6b6b;">Error: ${error.message}</p>`;
        }
    }
    finally{
        // Remove typing indicator
        let typingIndicator = text.querySelector(".typing-indicator");
        if(typingIndicator) typingIndicator.remove();
        
        // Reset buttons
        stopBtn.classList.add('hidden');
        submitbtn.classList.remove('hidden');
        abortController = null;
        
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        
        // Clear images after sending
        selectedImages = [];
        imagePreviews.innerHTML = '';
        imagePreviewContainer.classList.add('hidden');
        image.src=`img.svg`
        image.classList.remove("choose")
        user.file={}
        
        // Save chat history
        saveChatHistory();
    }
}



function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handlechatResponse(userMessage){
    if (!userMessage.trim()) return; // Don't send empty messages
    
    user.message=userMessage
    
    // Build images HTML for multiple images
    let imagesHTML = '';
    if(selectedImages.length > 0) {
        selectedImages.forEach(img => {
            imagesHTML += `<img src="data:${img.mime_type};base64,${img.data}" class="chooseimg" />`;
        });
    }
    
    let html=`<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${imagesHTML}
<div class="timestamp">${getTimestamp()}</div>
</div>`
prompt.value=""
let userChatBox=createChatBox(html,"user-chat-box")
chatContainer.appendChild(userChatBox)

chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

// Save after user message
saveChatHistory();

setTimeout(()=>{
let html=`<img src="ai.png" alt="" id="aiImage" width="10%">
    <div class="ai-chat-area">
    <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
    </div>
    </div>`
    let aiChatBox=createChatBox(html,"ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)

},600)

}


prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
       handlechatResponse(prompt.value)

    }
})

submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value)
})
imageinput.addEventListener("change",()=>{
    const files = imageinput.files;
    if(!files.length) return;
    
    // Clear previous selections
    selectedImages = [];
    imagePreviews.innerHTML = '';
    
    // Process all selected files
    Array.from(files).forEach((file, index) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            let base64string = e.target.result.split(",")[1];
            const imageData = {
                mime_type: file.type,
                data: base64string
            };
            
            selectedImages.push(imageData);
            
            // Create preview
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="data:${file.type};base64,${base64string}" />
                <button class="remove-preview" onclick="removeImage(${selectedImages.length - 1})">×</button>
            `;
            imagePreviews.appendChild(previewItem);
            
            // Show preview container and update button icon
            imagePreviewContainer.classList.remove('hidden');
            image.src = `data:${file.type};base64,${base64string}`;
            image.classList.add("choose");
        };
        reader.readAsDataURL(file);
    });
});

// Function to remove individual image
function removeImage(index) {
    selectedImages.splice(index, 1);
    updateImagePreviews();
}

// Update image previews after removal
function updateImagePreviews() {
    imagePreviews.innerHTML = '';
    
    if (selectedImages.length === 0) {
        imagePreviewContainer.classList.add('hidden');
        image.src = 'img.svg';
        image.classList.remove('choose');
        return;
    }
    
    selectedImages.forEach((img, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="data:${img.mime_type};base64,${img.data}" />
            <button class="remove-preview" onclick="removeImage(${index})">×</button>
        `;
        imagePreviews.appendChild(previewItem);
    });
}


imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})

// Load chat history on page load
loadChatHistory();