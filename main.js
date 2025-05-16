// 章节与资源配置（包括首页 icon 和简介）
const chaptersData = {
  chapter1: {
    title: '第一章 感知物理世界',
    icon: '🌐',
    description: '传感器原理与数据采集',
    sections: {
      '1.1': {
        title: '1.1 传感器技术原理',
        resources: [
          { name: '第一章1.1教学PPT', type: 'pptx', icon: '📊' },
          { name: '1.1课后习题', type: 'pdf', icon: '📝' }
        ]
      },
      '1.2': {
        title: '1.2 数据采集与处理',
        resources: [
          { name: '第一章1.2教学PPT', type: 'pptx', icon: '📊' },
          { name: '1.2某电商月度平台销售数据', type: 'xlsx', icon: '📈' },
          { name: '1.2课后习题', type: 'pdf', icon: '📝' }
        ]
      },
      '1.3': {
        title: '1.3 电路连接',
        resources: [
          { name: '1.3电路连接示意图', type: 'png', icon: '💡' }
        ]
      }
    }
  },
  chapter2: {
    title: '第二章 物联网系统架构',
    icon: '📡',
    description: '通信协议与云平台',
    sections: {
      '2.1': {
        title: '2.1 通信协议与网络拓扑',
        resources: [
          { name: '第二章2.1教学PPT', type: 'pptx', icon: '📊' },
          { name: '2.1课后习题', type: 'pdf', icon: '📝' }
        ]
      },
      '2.2': {
        title: '2.2 边缘计算与云平台',
        resources: [
          { name: '第二章2.2教学PPT', type: 'pptx', icon: '📊' },
          { name: '2.2课后习题', type: 'pdf', icon: '📝' }
        ]
      },
      '2.3': {
        title: '2.3 代码示例',
        resources: [
          { name: '2.3实验示例程序代码', type: 'code', icon: '💻' }
        ]
      }
    }
  },
  chapter3: {
    title: '第三章 伦理与社会影响',
    icon: '⚖️',
    description: '隐私保护与可持续发展',
    sections: {
      '3.1': {
        title: '3.1 数据隐私与安全',
        resources: [
          { name: '第三章3.1教学PPT', type: 'pptx', icon: '📊' },
          { name: '3.1课后习题', type: 'pdf', icon: '📝' }
        ]
      },
      '3.2': {
        title: '3.2 技术应用的可持续发展',
        resources: [
          { name: '第三章3.2教学PPT', type: 'pptx', icon: '📊' },
          { name: '3.2课后习题', type: 'pdf', icon: '📝' },
          { name: '3.2智慧城市介绍视频', type: 'mp4', icon: '📹' }
        ]
      }
    }
  }
};

// CONFIGURATION: Base URL for your site.
// Set directly to your GitHub Pages URL. Ensure it ends with a slash '/'.
const SITE_BASE_URL = 'https://beloved404.github.io/website/';

console.log("Using fixed SITE_BASE_URL:", SITE_BASE_URL);


// 资源名称到文件路径映射 (路径不以 "/" 开头，文件名已简化为英文，无特殊字符)
// **重要**: 确保 GitHub 仓库中 `assets` 文件夹下的文件名和路径与此处完全一致 (包括大小写)。
// GitHub Pages 服务器区分大小写。
const fileMap = {
  '第一章1.1教学PPT': 'assets/ch11slides.pptx',
  '1.1课后习题': 'assets/ch11exercises.pdf',
  '第一章1.2教学PPT': 'assets/ch12slides.pptx',
  '1.2某电商月度平台销售数据': 'assets/ch12data.xlsx',
  '1.2课后习题': 'assets/ch12exercises.pdf',
  '1.3电路连接示意图': 'assets/ch13diagram.png',
  '第二章2.1教学PPT': 'assets/ch21slides.pptx',
  '2.1课后习题': 'assets/ch21exercises.pdf',
  '第二章2.2教学PPT': 'assets/ch22slides.pptx',
  '2.2课后习题': 'assets/ch22exercises.pdf',
  '2.3实验示例程序代码': 'assets/ch23code.txt',
  '第三章3.1教学PPT': 'assets/ch31slides.pptx',
  '3.1课后习题': 'assets/ch31exercises.pdf',
  '第三章3.2教学PPT': 'assets/ch32slides.pptx',
  '3.2课后习题': 'assets/ch32exercises.pdf',
  '3.2智慧城市介绍视频': 'assets/ch32video.mp4'
};

let currentSlides = [];
let currentSlideIndex = 0;

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

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

function initNavPage() {
  const params = new URLSearchParams(location.search);
  const chapId = params.get('chapter');

  if (!chapId || !chaptersData[chapId]) {
    showCustomAlert('未找到指定的课程章节，将返回首页。', () => {
        location.href = 'index.html';
    });
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
      const contentToFullscreen = iframe || el;

      if (contentToFullscreen && contentToFullscreen.requestFullscreen) {
        contentToFullscreen.requestFullscreen().catch(err => showCustomAlert(`全屏失败: ${err.message}`));
      } else if (contentToFullscreen && contentToFullscreen.webkitRequestFullscreen) { /* Safari */
        contentToFullscreen.webkitRequestFullscreen();
      } else if (contentToFullscreen && contentToFullscreen.msRequestFullscreen) { /* IE11 */
        contentToFullscreen.msRequestFullscreen();
      } else {
        showCustomAlert('您的浏览器不支持全屏 API 或无法全屏此内容。');
      }
    };
  }
}

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
      card.innerHTML = `<div class="res-icon">${resource.icon || '📄'}</div><div class="res-name">${resource.name}</div>`;
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

function openPreview(resourceName, resourceType) {
  const relativeFilePath = fileMap[resourceName]; 
  const previewArea = document.getElementById('preview-area');
  const contentDiv = document.getElementById('preview-content');
  const downloadBtn = document.getElementById('download-btn');
  const placeholder = document.getElementById('no-preview-placeholder');
  const slideControls = document.getElementById('slide-navigation-controls');

  if (!relativeFilePath) {
    if (previewArea) previewArea.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');
    if (slideControls) slideControls.classList.add('hidden');
    showCustomAlert('资源文件未在 fileMap 中找到配置。');
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
  
  // Construct absolute file path using the fixed SITE_BASE_URL
  const absoluteFilePath = SITE_BASE_URL + relativeFilePath;
  console.log("Attempting to load file from absolute path:", absoluteFilePath);

  downloadBtn.href = absoluteFilePath;
  downloadBtn.download = resourceName; // Suggests the Chinese name for download

  if (resourceType === 'pptx' || resourceType === 'xlsx') {
    const encodedUrl = encodeURIComponent(absoluteFilePath);
    contentDiv.innerHTML = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}&amp;wdAr=1.7777777777777777" frameborder="0" style="width:100%;height:100%;"></iframe>`;
    const iframe = contentDiv.querySelector('iframe');
    if (iframe) {
      iframe.onload = () => {
        console.log('Office Online Viewer iframe loaded successfully for:', absoluteFilePath);
      };
      iframe.onerror = () => {
        console.error('Office Online Viewer iframe failed to load for:', absoluteFilePath);
        const expectedFolderPath = SITE_BASE_URL + (relativeFilePath.includes('/') ? relativeFilePath.substring(0, relativeFilePath.lastIndexOf('/') + 1) : '');
        contentDiv.innerHTML = `<div style="padding:20px; text-align:center; color:red;"><h3 style="font-weight:bold;">在线预览失败 (${resourceType})</h3><p>无法加载 Office Online Viewer。请检查以下几点：</p><ul style="text-align:left; display:inline-block; margin-top:10px;"><li>确保您的网站已成功部署，并且 <code>SITE_BASE_URL</code> (当前固定为: <code>${SITE_BASE_URL}</code>) 是正确的。</li><li>确认文件 (相对路径: ${relativeFilePath}) 已正确上传到服务器的 '${expectedFolderPath}' 位置。</li><li>检查浏览器控制台是否有其他网络错误或CSP（内容安全策略）相关的错误。</li><li>直接在浏览器新标签页中尝试访问以下链接，看是否能下载或显示文件：<br><a href="${absoluteFilePath}" target="_blank" style="word-break:break-all;">${absoluteFilePath}</a></li><li>有时，网络问题或 Office Online Viewer 服务本身也可能导致加载失败。</li></ul><p style="margin-top:10px;">您也可以尝试使用“下载”按钮在本地查看文件。</p></div>`;
      };
    }
  } else if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp'].includes(resourceType)) {
    contentDiv.innerHTML = `<img src="${absoluteFilePath}" alt="${resourceName}" style="max-width:100%; max-height:100%; object-fit:contain; display:block; margin:auto;">`;
  } else if (resourceType === 'pdf') {
    contentDiv.innerHTML = `<iframe src="${absoluteFilePath}" frameborder="0" style="width:100%;height:100%;"></iframe>`;
  } else if (resourceType === 'mp4' || resourceType === 'webm' || resourceType === 'ogv') {
    contentDiv.innerHTML = `<video controls autoplay style="width:100%;height:100%; background-color: #000;"><source src="${absoluteFilePath}" type="video/${resourceType}">您的浏览器不支持视频标签。</video>`;
  } else if (resourceType === 'code' || relativeFilePath.endsWith('.txt')) {
    fetch(absoluteFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${response.url}`);
            }
            return response.text();
        })
        .then(text => {
            contentDiv.innerHTML = `
                <div style="padding:15px; background-color:#f8f9fa; border:1px solid #dee2e6; border-radius:5px; height:calc(100% - 30px); overflow:auto; box-sizing: border-box;">
                    <h3 style="font-weight:bold; margin-top:0; margin-bottom:15px; color:#212529; font-size: 1.1em;">${resourceName} (文本预览)</h3>
                    <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 0.9em; color: #212529; margin:0;">${escapeHtml(text)}</pre>
                </div>`;
        })
        .catch(e => {
            console.error('Error fetching text/code file for preview:', absoluteFilePath, e);
            contentDiv.innerHTML = `<div style="padding:20px; text-align:center; color:red;">
                <h3 style="font-weight:bold;">预览失败</h3>
                <p>无法加载文件内容。请确保文件路径 (<code>${absoluteFilePath}</code>) 正确、文件已上传且可公共访问。</p>
                <p>错误: ${escapeHtml(e.message)}</p>
                <p style="margin-top:10px;">您也可以尝试使用“下载”按钮在本地查看文件。</p>
            </div>`;
        });
  }
  else {
    contentDiv.innerHTML = `<div style="padding:20px; text-align:center;">
        <h3 style="font-weight:bold;">预览提示</h3>
        <p>此文件类型 (${resourceType}) 当前不支持直接在线预览。</p>
        <p style="margin-top:10px;">您可以尝试使用“下载”按钮将文件保存到本地后查看。</p>
        <p style="margin-top:20px; font-size:0.9em;">文件: <a href="${absoluteFilePath}" target="_blank" download="${resourceName}" style="word-break:break-all;">${resourceName}</a></p>
    </div>`;
  }
}

function showCustomAlert(message, callback) {
  let alertContainer = document.getElementById('custom-alert-container');
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'custom-alert-container';
    alertContainer.style.position = 'fixed';
    alertContainer.style.left = '0';
    alertContainer.style.top = '0';
    alertContainer.style.width = '100%';
    alertContainer.style.height = '100%';
    alertContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    alertContainer.style.display = 'flex';
    alertContainer.style.justifyContent = 'center';
    alertContainer.style.alignItems = 'center';
    alertContainer.style.zIndex = '10000';
    document.body.appendChild(alertContainer);
  }

  alertContainer.innerHTML = `
    <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-align: center; max-width: 90%; width: 350px;">
      <p style="margin-bottom: 20px; font-size: 16px; color: #333; line-height:1.5;">${message}</p>
      <button id="custom-alert-ok-btn" style="background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 15px; min-width: 80px;">确定</button>
    </div>
  `;
  alertContainer.style.display = 'flex';

  document.getElementById('custom-alert-ok-btn').onclick = () => {
    alertContainer.style.display = 'none';
    if (callback) {
      callback();
    }
  };
}
