// 章节与资源配置（包括首页 icon 和简介）
const chaptersData = {
  chapter1: {
    title: '第一章 感知物理世界',
    icon: '🌐',
    description: '传感器原理与数据采集',
    sections: {
      '1.1': { title: '1.1 传感器技术原理', resources: [{ name: '第一章1.1教学PPT', type: 'pptx' }] },
      '1.2': { title: '1.2 数据采集与处理', resources: [{ name: '第一章1.2教学PPT', type: 'pptx' }] },
      'ex': { title: '第一章习题', resources: [{ name: '第一章习题', type: 'pdf' }] }
    }
  },
  chapter2: {
    title: '第二章 物联网系统架构',
    icon: '📡',
    description: '通信协议与云平台',
    sections: {
      '2.1': { title: '2.1 通信协议与网络拓扑', resources: [{ name: '第二章2.1教学PPT', type: 'pptx' }] },
      '2.2': { title: '2.2 边缘计算与云平台', resources: [{ name: '第二章2.2教学PPT', type: 'pptx' }] },
      'ex': { title: '第二章习题', resources: [{ name: '第二章习题', type: 'pdf' }] }
    }
  },
  chapter3: {
    title: '第三章 伦理与社会影响',
    icon: '⚖️',
    description: '隐私保护与可持续发展',
    sections: {
      '3.1': { title: '3.1 数据隐私与安全', resources: [{ name: '第三章3.1教学PPT', type: 'pptx' }] },
      '3.2': { title: '3.2 技术应用的可持续发展', resources: [{ name: '第三章3.2教学PPT', type: 'pptx' }] },
      'ex': { title: '第三章习题', resources: [{ name: '第三章习题', type: 'pdf' }] }
    }
  }
};

// 资源名称到文件路径映射 (路径不以 "/" 开头)
const fileMap = {
  '第一章1.1教学PPT': 'assets/chapter1-1.pptx',
  '第一章1.2教学PPT': 'assets/chapter1-2.pptx',
  '第二章2.1教学PPT': 'assets/chapter2-1.pptx',
  '第二章2.2教学PPT': 'assets/chapter2-2.pptx',
  '第三章3.1教学PPT': 'assets/chapter3-1.pptx',
  '第三章3.2教学PPT': 'assets/chapter3-2.pptx',
  // 新增 pdf 资源
  '第一章习题': 'assets/text1.pdf',
  '第二章习题': 'assets/text2.pdf',
  '第三章习题': 'assets/text3.pdf'
};

let currentSlides = []; // 虽然未使用，但保留以备将来扩展
let currentSlideIndex = 0; // 虽然未使用，但保留

// 初始化页面逻辑
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed.');
  const page = document.body.id;
  if (page === 'page-home') {
    initHome();
  }
  if (page === 'page-nav') {
    initNavPage();
  }
});

// 首页初始化
function initHome() {
  const container = document.getElementById('home-cards');
  if (!container) return; 
  container.innerHTML = '';
  Object.entries(chaptersData).forEach(([chapId, chap]) => {
    const btn = document.createElement('button');
    btn.className = 'card'; 
    btn.innerHTML = `<div class="icon">${chap.icon}</div><h2>${chap.title}</h2><p>${chap.description}</p>`;
    btn.onclick = () => location.href = `nav.html?chapter=${chapId}`;
    container.appendChild(btn);
  });
}

// 资源目录页初始化
function initNavPage() {
  const params = new URLSearchParams(location.search);
  const chapId = params.get('chapter');

  if (!chapId || !chaptersData[chapId]) {
    alert('未找到指定的课程章节，将返回首页。');
    location.href = 'index.html';
    return;
  }
  const chapter = chaptersData[chapId];

  document.getElementById('nav-title').innerText = chapter.title;
  const list = document.getElementById('sections-list');
  list.innerHTML = ''; 

  Object.entries(chapter.sections).forEach(([secId, sec]) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'nav-btn'; 
    btn.innerText = sec.title;
    btn.onclick = () => toggleSection(li, sec);
    li.appendChild(btn);

    const drop = document.createElement('div');
    drop.className = 'section-resources hidden'; 
    li.appendChild(drop);
    list.appendChild(li);
  });

  document.getElementById('btn-back-home').onclick = () => location.href = 'index.html';

  const initialPreviewArea = document.getElementById('preview-area');
  const initialPlaceholder = document.getElementById('no-preview-placeholder');
  const slideControls = document.getElementById('slide-navigation-controls');

  if (initialPreviewArea && initialPlaceholder && slideControls) {
      initialPreviewArea.classList.add('hidden');
      initialPlaceholder.classList.remove('hidden');
      slideControls.classList.add('hidden'); 
  }

  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.onclick = () => {
      const el = document.getElementById('preview-content');
      const iframe = el.querySelector('iframe'); 
      if (iframe && iframe.requestFullscreen) {
        iframe.requestFullscreen().catch(err => alert(`iframe 全屏失败: ${err.message}`));
      } else if (el && el.requestFullscreen) { 
        el.requestFullscreen().catch(err => alert(`无法进入全屏模式: ${err.message}`));
      } 
      else if (el && el.webkitRequestFullscreen) { /* Safari */
        el.webkitRequestFullscreen();
      } else if (el && el.msRequestFullscreen) { /* IE11 */
        el.msRequestFullscreen();
      }
      else {
        alert('您的浏览器不支持全屏 API 或无法全屏此内容。');
      }
    };
  }
}

// 手风琴切换
function toggleSection(li, section) {
  document.querySelectorAll('#sections-list .section-resources').forEach(div => {
    if (div !== li.querySelector('.section-resources')) { 
        div.classList.add('hidden');
    }
  });
  const drop = li.querySelector('.section-resources');
  const isHidden = drop.classList.contains('hidden');

  if (isHidden) {
    drop.innerHTML = '';
    section.resources.forEach(resource => { 
      const card = document.createElement('div');
      card.className = 'res-card';
      card.innerHTML = `<div class="res-icon">📊</div><div class="res-name">${resource.name}</div>`;
      card.onclick = (event) => {
        event.stopPropagation();
        openPreview(resource.name, resource.type); 
      };
      drop.appendChild(card);
    });
    drop.classList.remove('hidden');
  } else {
    drop.classList.add('hidden');
  }
}

// 打开预览 (使用Office Online Viewer)
function openPreview(resourceName, resourceType) {
  const filePath = fileMap[resourceName]; // 例如: assets/chapter1-1.pptx (无前导斜杠)
  const previewArea = document.getElementById('preview-area');
  const contentDiv = document.getElementById('preview-content');
  const downloadBtn = document.getElementById('download-btn');
  const placeholder = document.getElementById('no-preview-placeholder');
  const slideControls = document.getElementById('slide-navigation-controls'); 

  if (!filePath) {
    if (previewArea) previewArea.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');
    if (slideControls) slideControls.classList.add('hidden'); 
    alert('资源文件未找到！请在 fileMap 中正确配置。');
    return;
  }

  if (!contentDiv || !downloadBtn || !previewArea || !placeholder || !slideControls) {
    console.error("一个或多个预览相关的 DOM 元素未在 nav.html 中定义。");
    return;
  }

  previewArea.classList.remove('hidden');
  placeholder.classList.add('hidden');
  
  slideControls.classList.add('hidden');
  contentDiv.innerHTML = '<div class="loader"></div><p style="text-align:center; color:#6b7280;">正在加载预览...</p>';

  if (resourceType === 'pptx') {
    // 调试日志：打印 location 对象的相关属性
    console.log("Current location.origin:", location.origin);     // 例如: "https://beloved404.github.io"
    console.log("Current location.pathname:", location.pathname); // 例如: "/website/nav.html"
    console.log("Current location.href:", location.href);       // 例如: "https://beloved404.github.io/website/nav.html?chapter=..."
    console.log("filePath from fileMap:", filePath);             // 例如: "assets/chapter2-2.pptx"

    // **方案A: 使用 new URL() (理论上应该能正确工作)**
    // const resolvedFileUrl = new URL(filePath, location.href).href;

    // **方案B: 尝试更直接地构造 URL (硬编码仓库名)**
    // 确保这个前缀与您的 GitHub Pages 站点完全匹配
    const sitePrefix = "https://beloved404.github.io/website/"; 
    const resolvedFileUrl = sitePrefix + filePath; // filePath 是 'assets/filename.pptx'

    console.log("Office Viewer attempting to load (Using method B):", resolvedFileUrl);
    
    // 设置下载按钮的链接 (也使用方案B确保一致性)
    const downloadUrl = sitePrefix + filePath;
    downloadBtn.href = downloadUrl;

    const encodedUrl = encodeURIComponent(resolvedFileUrl);
    
    contentDiv.innerHTML = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}" frameborder="0" style="width:100%;height:100%;"></iframe>`;
    
    const iframe = contentDiv.querySelector('iframe');
    if (iframe) {
      iframe.onload = () => {
        console.log('Office Online Viewer iframe loaded successfully for:', resolvedFileUrl);
      };
      iframe.onerror = () => {
        console.error('Office Online Viewer iframe failed to load for:', resolvedFileUrl);
        contentDiv.innerHTML = `<div style="padding:20px; text-align:center; color:red;"><h3 style="font-weight:bold;">在线预览失败</h3><p>无法加载 Office Online Viewer。请检查以下几点：</p><ul style="text-align:left; display:inline-block; margin-top:10px;"><li>确保您的网站已成功部署到 GitHub Pages。</li><li>确认PPTX文件 (路径: ${filePath}) 已正确上传到 GitHub 仓库的 '${sitePrefix + filePath.substring(0, filePath.lastIndexOf('/')+1)}' 位置。</li><li>检查浏览器控制台是否有其他网络错误或CSP（内容安全策略）相关的错误。</li><li>直接在浏览器新标签页中尝试访问以下链接，看是否能下载或显示文件：<br><a href="${resolvedFileUrl}" target="_blank" style="word-break:break-all;">${resolvedFileUrl}</a></li><li>有时，网络问题或 Office Online Viewer 服务本身也可能导致加载失败。</li></ul><p style="margin-top:10px;">您也可以尝试使用“下载”按钮在本地查看文件。</p></div>`;
      };
    }
  } else if (resourceType === 'pdf') {
    // 直接用 iframe 嵌入 pdf
    const resolvedFileUrl = new URL(filePath, location.href).href;
    contentDiv.innerHTML = `<iframe src="${resolvedFileUrl}" frameborder="0" style="width:100%;height:100%;"></iframe>`;
  } else {
    contentDiv.innerHTML = `<p style="padding:20px; text-align:center;">不支持预览此文件类型 (${resourceType})。</p>`;
  }
}

// ===== Gemini AI 聊天助手集成 =====
document.addEventListener('DOMContentLoaded', () => {
    // --- 安全警告 ---
    // 再次强调：直接在前端使用 API 密钥非常不安全。请尽快替换为后端代理方案。
    const GEMINI_API_KEY = 'AIzaSyALwVl1iwLavjaZW-Wx3FP2zJWoYzQfamU'; // 您的 API 密钥
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    let conversationHistory = [];
    let isLoading = false;

    // 1. 动态创建 HTML 结构
    function createChatInterface() {
        const chatButtonHTML = `<button id="ai-chat-button">💬 AI</button>`;
        const chatWidgetHTML = `
            <div id="ai-chat-widget" style="display: none;">
                <div id="ai-chat-header">
                    <span>学习小助手</span>
                    <button id="ai-chat-close-button" aria-label="关闭聊天框">&times;</button>
                </div>
                <div id="ai-chat-messages">
                    <div class="chat-message bot-message">你好！我是你的学习小助手，今天想学点什么呢？</div>
                </div>
                <div id="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="请输入你遇到的学习问题..." autocomplete="off">
                    <button id="ai-chat-send-button" aria-label="发送消息">发送</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatButtonHTML);
        document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);
    }

    createChatInterface();

    // 2. 获取 DOM 元素
    const chatButton = document.getElementById('ai-chat-button');
    const chatWidget = document.getElementById('ai-chat-widget');
    const closeButton = document.getElementById('ai-chat-close-button');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const inputField = document.getElementById('ai-chat-input');
    const sendButton = document.getElementById('ai-chat-send-button');

    // 3. 检查并加载 marked.js (Markdown 解析库)
    if (typeof marked === 'undefined') {
        console.warn("marked.js 库未找到。请确保已在 HTML 中通过 CDN 引入，例如：<script src='https://cdn.jsdelivr.net/npm/marked/marked.min.js'></script>。尝试动态加载...");
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => {
            console.log("marked.js 已动态加载。");
            initializeMarked();
        };
        script.onerror = () => {
            console.error("动态加载 marked.js 失败。Markdown 将无法正确渲染。");
            appendErrorMessage("Markdown渲染库加载失败，部分内容可能无法正常显示。");
        };
        document.head.appendChild(script);
    } else {
        initializeMarked();
    }

    function initializeMarked() {
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                renderer: new marked.Renderer(),
                highlight: function(code, lang) {
                    const language = (typeof hljs !== 'undefined' && hljs.getLanguage(lang)) ? lang : 'plaintext';
                    return (typeof hljs !== 'undefined') ? hljs.highlight(code, { language }).value : code;
                },
                pedantic: false,
                gfm: true,
                breaks: false,
                sanitize: false,
                smartypants: false,
                xhtml: false
            });
            console.log("marked.js 已配置。");
        }
    }

    // 4. 事件监听
    chatButton.addEventListener('click', toggleChatWidget);
    closeButton.addEventListener('click', () => toggleChatWidget(false));
    sendButton.addEventListener('click', handleSendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    function toggleChatWidget(forceShow) {
        const currentlyOpen = chatWidget.style.display === 'flex';
        const show = typeof forceShow === 'boolean' ? forceShow : !currentlyOpen;

        if (show) {
            chatWidget.style.display = 'flex';
            chatButton.style.display = 'none';
            inputField.focus();
        } else {
            chatWidget.style.display = 'none';
            chatButton.style.display = 'block';
        }
    }

    // 5. 发送消息逻辑
    async function handleSendMessage() {
        const messageText = inputField.value.trim();
        if (!messageText || isLoading) return;

        // 优化：首次对话时插入学习助手角色设定
        if (conversationHistory.length === 0) {
            conversationHistory.push({
                role: "user",
                parts: [{
                    text: `请你扮演我的“学习小助手”。你的目标是帮助我理解知识、解答疑问，并引导我思考。请保持耐心，使用清晰易懂的语言，并鼓励我提问。我们开始学习吧！`
                }]
            });
        }
        // 包装用户输入为学习场景
        const userLearningQuery = `你好，学习助手！我现在正在学习，请你以一个耐心、友善且循循善诱的老师的身份来帮助我。\n对于我的问题，请：\n1. 深入浅出地解释核心概念。\n2. 如果合适，给出相关的例子或类比。\n3. 如果我问的是解题方法，请给出详细步骤和思路。\n4. 可以适当向我提问，以检验我的理解程度或引导我进一步思考。\n5. 请专注于与学习内容相关的讨论。\n\n我的问题是：${messageText}`;

        appendMessage(messageText, 'user');
        inputField.value = '';
        inputField.focus();
        setLoading(true);

        conversationHistory.push({ role: "user", parts: [{ text: userLearningQuery }] });

        try {
            const requestBody = {
                contents: conversationHistory,
                generationConfig: {},
            };

            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            setLoading(false);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                let apiErrorMessage = `API 请求失败 (状态 ${response.status})`;
                if (errorData.error && errorData.error.message) {
                    apiErrorMessage += `: ${errorData.error.message}`;
                }
                appendErrorMessage(apiErrorMessage);
                return;
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                const botResponseText = data.candidates[0].content.parts[0].text;
                conversationHistory.push({ role: "model", parts: [{ text: botResponseText }] });
                appendMessage(botResponseText, 'bot', true);
            } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                let blockedMessage = `抱歉，您的请求因 "${data.promptFeedback.blockReason}" 被阻止。`;
                if (data.promptFeedback.safetyRatings) {
                     data.promptFeedback.safetyRatings.forEach(rating => {
                        if (rating.blocked) blockedMessage += ` (类别: ${rating.category})`;
                     });
                }
                appendErrorMessage(blockedMessage);
                conversationHistory.push({ role: "model", parts: [{ text: blockedMessage }] });
            } else if (data.candidates && data.candidates.length > 0 && data.candidates[0].finishReason && data.candidates[0].finishReason !== "STOP") {
                let finishReasonMessage = `回复已生成，但可能不完整或因其他原因停止: ${data.candidates[0].finishReason}`;
                if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                    const partialBotResponse = data.candidates[0].content.parts[0].text;
                    conversationHistory.push({ role: "model", parts: [{ text: partialBotResponse }] });
                    appendMessage(partialBotResponse, 'bot', true);
                    appendErrorMessage(finishReasonMessage, true);
                } else {
                    appendErrorMessage(finishReasonMessage);
                }

            } else {
                console.error("Unexpected API response structure:", data);
                appendErrorMessage('未能从 API 获取有效回复。');
            }

        } catch (error) {
            setLoading(false);
            console.error('Error sending message to Gemini:', error);
            appendErrorMessage(`与 AI 通信时发生错误: ${error.message}`);
        }
    }

    // 6. 将消息添加到聊天框
    function appendMessage(text, type, isMarkdown = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${type}-message`);

        if (isMarkdown && typeof marked !== 'undefined') {
            try {
                messageDiv.innerHTML = marked.parse(text);
                messageDiv.querySelectorAll('pre code').forEach((block) => {
                    if (typeof hljs !== 'undefined') {
                        hljs.highlightElement(block);
                    }
                });
            } catch (e) {
                console.error("Markdown parsing error:", e);
                messageDiv.textContent = text;
            }
        } else {
            messageDiv.textContent = text;
        }

        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function appendErrorMessage(message, isAdditionalInfo = false) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('chat-message');
        if (isAdditionalInfo) {
            errorDiv.classList.add('bot-message');
            errorDiv.style.opacity = "0.8";
            errorDiv.style.fontSize = "0.9em";
        } else {
            errorDiv.classList.add('bot-error-message');
        }
        const p = document.createElement('p');
        p.textContent = message;
        errorDiv.appendChild(p);
        messagesContainer.appendChild(errorDiv);
        scrollToBottom();
    }

    // 7. 加载状态处理
    let loadingIndicatorElement = null;
    function setLoading(loading) {
        isLoading = loading;
        sendButton.disabled = loading;
        inputField.disabled = loading;

        if (loading) {
            if (!loadingIndicatorElement) {
                loadingIndicatorElement = document.createElement('div');
                loadingIndicatorElement.className = 'loading-spinner';
                messagesContainer.appendChild(loadingIndicatorElement);
                scrollToBottom();
            }
        } else {
            if (loadingIndicatorElement) {
                loadingIndicatorElement.remove();
                loadingIndicatorElement = null;
            }
        }
    }

    // 8. 滚动到底部
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // 确保初始聊天框是关闭的，按钮是显示的
    toggleChatWidget(false);
});
