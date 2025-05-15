// 章节与资源配置
const chaptersData = {
  chapter1: {
    title: '第一章 感知物理世界',
    icon: '🌐',
    description: '传感器原理与数据采集',
    sections: {
      '1.1': { title: '1.1 传感器技术原理', resources: [{ name: '第一章1.1教学PPT', type: 'pptx' }] },
      '1.2': { title: '1.2 数据采集与处理', resources: [{ name: '第一章1.2教学PPT', type: 'pptx' }] }
    }
  },
  chapter2: {
    title: '第二章 物联网系统架构',
    icon: '📡',
    description: '通信协议与云平台',
    sections: {
      '2.1': { title: '2.1 通信协议与网络拓扑', resources: [{ name: '第二章2.1教学PPT', type: 'pptx' }] },
      '2.2': { title: '2.2 边缘计算与云平台', resources: [{ name: '第二章2.2教学PPT', type: 'pptx' }] }
    }
  },
  chapter3: {
    title: '第三章 伦理与社会影响',
    icon: '⚖️',
    description: '隐私保护与可持续发展',
    sections: {
      '3.1': { title: '3.1 数据隐私与安全', resources: [{ name: '第三章3.1教学PPT', type: 'pptx' }] },
      '3.2': { title: '3.2 技术应用的可持续发展', resources: [{ name: '第三章3.2教学PPT', type: 'pptx' }] }
    }
  }
};

// 资源名称到文件路径映射
const fileMap = {
  '第一章1.1教学PPT': '/assets/chapter1-1.pptx',
  '第一章1.2教学PPT': '/assets/chapter1-2.pptx',
  '第二章2.1教学PPT': '/assets/chapter2-1.pptx',
  '第二章2.2教学PPT': '/assets/chapter2-2.pptx',
  '第三章3.1教学PPT': '/assets/chapter3-1.pptx',
  '第三章3.2教学PPT': '/assets/chapter3-2.pptx'
};

// 注意: 以下全局变量和相关函数 (currentSlides, currentSlideIndex, pptxInstance, 
// showSlide, showPrevSlide, showNextSlide, updateSlideInfo, updateNavButtons)
// 在当前配置下 (使用Office Online Viewer预览PPTX) 将不会被PPTX类型文件使用。
// 如果将来您引入其他支持外部控制的多页预览格式 (如PDF.js渲染的PDF，或图片序列)，它们可能仍然有用。
let currentSlides = [];
let currentSlideIndex = 0;
// let pptxInstance = null; // 不再直接与 pptx.js 实例交互

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
      slideControls.classList.add('hidden'); // 初始隐藏翻页控件
  }

  // 全屏功能按钮
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.onclick = () => {
      const el = document.getElementById('preview-content');
      const iframe = el.querySelector('iframe'); // 尝试获取iframe
      if (iframe && iframe.requestFullscreen) {
        iframe.requestFullscreen().catch(err => alert(`iframe 全屏失败: ${err.message}`));
      } else if (el && el.requestFullscreen) { // 如果没有iframe或iframe不支持，尝试全屏容器
        el.requestFullscreen().catch(err => alert(`无法进入全屏模式: ${err.message}`));
      } // ... (其他浏览器前缀的全屏代码可以保留)
      else {
        alert('您的浏览器不支持全屏 API 或无法全屏此内容。');
      }
    };
  }

  // 翻页按钮事件监听 (这些按钮对于Office Online Viewer是无效的)
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  // if (prevBtn) prevBtn.onclick = showPrevSlide; // 不再绑定到自定义翻页
  // if (nextBtn) nextBtn.onclick = showNextSlide; // 不再绑定到自定义翻页
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

// 打开预览
async function openPreview(resourceName, resourceType) {
  const filePath = fileMap[resourceName];
  const previewArea = document.getElementById('preview-area');
  const contentDiv = document.getElementById('preview-content');
  const downloadBtn = document.getElementById('download-btn');
  const placeholder = document.getElementById('no-preview-placeholder');
  const slideControls = document.getElementById('slide-navigation-controls'); // 获取翻页控件容器

  if (!filePath) {
    if (previewArea) previewArea.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');
    if (slideControls) slideControls.classList.add('hidden'); // 确保隐藏
    alert('资源文件未找到！请在 fileMap 中正确配置。');
    return;
  }

  if (!contentDiv || !downloadBtn || !previewArea || !placeholder || !slideControls) {
    console.error("一个或多个预览相关的 DOM 元素未在 nav.html 中定义。");
    return;
  }

  previewArea.classList.remove('hidden');
  placeholder.classList.add('hidden');
  downloadBtn.href = filePath;
  
  // 总是隐藏自定义翻页控件，因为Office Online Viewer有自己的控件
  slideControls.classList.add('hidden');
  contentDiv.innerHTML = '<div class="loader"></div><p style="text-align:center; color:#6b7280;">正在加载预览...</p>';


  if (resourceType === 'pptx') {
    // 使用 Microsoft Office Online Viewer
    const officeFileUrl = `${location.origin}${filePath}`;
    const encodedUrl = encodeURIComponent(officeFileUrl);
    
    contentDiv.innerHTML = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}" frameborder="0" style="width:100%;height:100%;"></iframe>`;
    
    const iframe = contentDiv.querySelector('iframe');
    if (iframe) {
      iframe.onload = () => {
        console.log('Office Online Viewer iframe loaded.');
      };
      iframe.onerror = () => {
        console.error('Office Online Viewer iframe failed to load.');
        contentDiv.innerHTML = `<div style="padding:20px; text-align:center; color:red;"><h3 style="font-weight:bold;">在线预览失败</h3><p>无法加载 Office Online Viewer。这可能是因为您正在本地运行服务 (例如 localhost)，在线服务无法访问您的文件。</p><p>请尝试将文件部署到公共服务器，或使用“下载”按钮在本地查看。</p></div>`;
      };
    }
  } else {
    // 处理其他文件类型 (如果将来添加，例如 PDF, audio, video)
    contentDiv.innerHTML = `<p style="padding:20px; text-align:center;">不支持预览此文件类型 (${resourceType})。</p>`;
    // slideControls.classList.add('hidden'); // 已在函数开头隐藏
  }
}

// 以下自定义幻灯片导航函数在此版本中不用于PPTX预览
// function showSlide(index) { /* ... */ }
// function showPrevSlide() { /* ... */ }
// function showNextSlide() { /* ... */ }
// function updateSlideInfo() { /* ... */ }
// function updateNavButtons() { /* ... */ }

