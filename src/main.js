import './styles.css'

const repoUrl = 'https://github.com/qxbyte/bitpet'
const latestReleaseUrl = `${repoUrl}/releases/latest`
const apiUrl = 'https://api.github.com/repos/qxbyte/bitpet/releases/latest'

const docsSections = [
  {
    id: 'install',
    label: 'Install',
    title: '安装 BitPet',
    body: '推荐通过 npm 一键安装 CLI 和同版本桌面应用。macOS 会安装 BitPet.app，Windows 会安装桌面应用和 bitpet 命令。',
    code: 'npm install -g bitpet\nbitpet init',
  },
  {
    id: 'daily',
    label: 'Commands',
    title: '日常命令',
    body: '喂食、玩耍、睡眠和状态查看都可以通过 CLI 完成，也可以在 Claude Code 内使用 /pet 命令。',
    code: 'bitpet feed\nbitpet play\nbitpet sleep\nbitpet status\nbitpet stop',
  },
  {
    id: 'hooks',
    label: 'AI Hooks',
    title: 'AI 编程工具集成',
    body: 'BitPet 通过本地 IPC Socket 和 hook 命令响应 AI 编程会话。发送提示词时进入思考状态，工具调用时显示进度，完成后回到闲置。',
    code: 'bitpet hooks\nbitpet setup-hooks --tool codex\nbitpet setup-hooks --tool opencode',
  },
  {
    id: 'build',
    label: 'Build',
    title: '从源码构建',
    body: '开发者可以直接克隆仓库，安装依赖后使用 Tauri 构建 macOS DMG 或 Windows NSIS 安装包。',
    code: 'git clone https://github.com/qxbyte/bitpet.git\ncd bitpet\nnpm install\nnpm run build',
  },
]

const commands = [
  ['init', '启动桌面宠物并自动写入 Claude Code hook'],
  ['feed', '饥饿度 -30，心情 +20，精力 +30'],
  ['play', '播放互动动画，提升心情'],
  ['status', '查看饥饿度、心情和精力'],
]

const state = {
  release: null,
  releaseError: '',
}

async function loadRelease() {
  try {
    const response = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github+json' } })
    if (!response.ok) throw new Error(`GitHub API ${response.status}`)
    state.release = await response.json()
  } catch (error) {
    state.releaseError = error.message
  } finally {
    updateDownloadLabels()
  }
}

function findAsset(platform) {
  const assets = state.release?.assets ?? []
  if (platform === 'mac') {
    return assets.find((asset) => /\.dmg$/i.test(asset.name) && /aarch64|arm64/i.test(asset.name))
      ?? assets.find((asset) => /\.dmg$/i.test(asset.name))
  }
  return assets.find((asset) => /x64.*setup\.exe$/i.test(asset.name))
    ?? assets.find((asset) => /setup\.exe$/i.test(asset.name))
}

function downloadLatest(platform) {
  const asset = findAsset(platform)
  if (asset?.browser_download_url) {
    window.location.href = asset.browser_download_url
    return
  }
  window.location.href = latestReleaseUrl
}

function updateDownloadLabels() {
  document.querySelectorAll('[data-release-version]').forEach((node) => {
    node.textContent = state.release?.tag_name ? `Latest ${state.release.tag_name}` : 'Latest release'
  })
  document.querySelectorAll('[data-asset="mac"]').forEach((node) => {
    node.textContent = findAsset('mac')?.name ?? 'macOS DMG'
  })
  document.querySelectorAll('[data-asset="windows"]').forEach((node) => {
    node.textContent = findAsset('windows')?.name ?? 'Windows installer'
  })
  const warning = document.querySelector('[data-release-warning]')
  if (warning) warning.hidden = !state.releaseError
}

function pixelPet(className = '') {
  return `<span class="pet-sprite ${className}" aria-hidden="true"></span>`
}

function downloadMenu() {
  return `
    <div class="download-menu" data-download-menu>
      <button class="primary-action" data-action="toggle-downloads" aria-expanded="false">
        Download
        <span class="chevron" aria-hidden="true"></span>
      </button>
      <div class="download-panel" role="menu">
        <button data-platform="mac" role="menuitem">
          <span>Apple Silicon</span>
          <small class="download-icon" aria-hidden="true"></small>
        </button>
        <button data-platform="windows" role="menuitem">
          <span>Windows</span>
          <small class="download-icon" aria-hidden="true"></small>
        </button>
      </div>
    </div>
  `
}

function nav(active = 'home') {
  return `
    <header class="topbar">
      <a class="brand" href="/" aria-label="BitPet home">
        ${pixelPet('brand-pet')}
        <span>BitPet</span>
      </a>
      <nav>
        <a class="${active === 'docs' ? 'active' : ''}" href="/docs">Docs</a>
        <a href="${repoUrl}" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a class="downloads-link ${active === 'downloads' ? 'active' : ''}" href="/downloads">Downloads</a>
      </nav>
    </header>
  `
}

function installCommand() {
  return `
    <div class="install-command" aria-label="npm install command">
      <span class="install-label">Install CLI</span>
      <span class="install-divider"></span>
      <code><span class="cmd-npm">npm</span> <span class="cmd-install">install</span> -g bitpet</code>
      <button class="copy-command" data-action="copy-command" aria-label="Copy npm install command">
        <span class="copy-icon" aria-hidden="true"></span>
      </button>
    </div>
  `
}

function homePage() {
  return `
    <main class="home-shell">
      ${nav('home')}
      <section class="hero" aria-labelledby="hero-title">
        <div class="ascii-cloud" aria-hidden="true">
          <span style="--x:8%;--y:22%;--d:0s">B</span><span style="--x:19%;--y:52%;--d:.7s">i</span>
          <span style="--x:31%;--y:14%;--d:1.2s">t</span><span style="--x:72%;--y:24%;--d:.4s">P</span>
          <span style="--x:83%;--y:58%;--d:1.5s">e</span><span style="--x:59%;--y:68%;--d:.9s">t</span>
          <span style="--x:46%;--y:35%;--d:1.8s">AI</span><span style="--x:14%;--y:75%;--d:.2s">CLI</span>
        </div>
        <div class="ascii-logo" aria-hidden="true">
          <pre>
██████╗ ██╗████████╗██████╗ ███████╗████████╗
██╔══██╗██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
██████╔╝██║   ██║   ██████╔╝█████╗     ██║
██╔══██╗██║   ██║   ██╔═══╝ ██╔══╝     ██║
██████╔╝██║   ██║   ██║     ███████╗   ██║
╚═════╝ ╚═╝   ╚═╝   ╚═╝     ╚══════╝   ╚═╝
          </pre>
        </div>
        <h1 id="hero-title">Desktop pet companion for AI coding tools</h1>
        <p class="hero-copy">一只住在桌面上的像素宠物，陪你写代码。它会实时响应 Claude Code、Codex 和 OpenCode 的提示词、工具调用和任务完成状态。</p>
        <div class="hero-actions">
          ${downloadMenu()}
          ${installCommand()}
        </div>
      </section>

      <section class="terminal-stage" aria-label="BitPet preview">
        <div class="code-window">
          <div class="window-title"><span></span><span></span><span></span><strong>bitpet session</strong></div>
          <div class="code-grid">
            <ol class="code-lines">
              <li><span class="comment">// Objective: keep your AI coding session visible</span></li>
              <li><span class="keyword">const</span> pet = <span class="function">new</span> BitPet({ tool: <span class="string">'claude-code'</span> })</li>
              <li>pet.<span class="function">on</span>(<span class="string">'UserPromptSubmit'</span>, () => pet.<span class="function">think</span>())</li>
              <li>pet.<span class="function">on</span>(<span class="string">'PreToolUse'</span>, tool => pet.<span class="function">say</span>(tool.name))</li>
              <li>pet.<span class="function">on</span>(<span class="string">'PostToolUse'</span>, result => pet.<span class="function">react</span>(result.summary))</li>
              <li>pet.<span class="function">on</span>(<span class="string">'Stop'</span>, () => pet.<span class="function">idle</span>())</li>
            </ol>
            <div class="pet-card">
              ${pixelPet('large-pet')}
              <div class="speech">thinking...</div>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-band">
        <article>
          <h2>Lives above your desktop</h2>
          <p>透明无边框、始终悬浮，窗口尺寸只有 110 × 150，不会挡住你的工作区。</p>
        </article>
        <article>
          <h2>CLI-native controls</h2>
          <p><code>bitpet feed</code>、<code>play</code>、<code>sleep</code>、<code>status</code> 都能直接从终端调用。</p>
        </article>
        <article>
          <h2>Hooks for coding agents</h2>
          <p>通过本地 IPC Socket 监听 AI 编程工具事件，把后台进度变成桌面上的即时反馈。</p>
        </article>
      </section>
    </main>
  `
}

function downloadsPage() {
  return `
    <main class="downloads-shell">
      ${nav('downloads')}
      <section class="downloads-hero" aria-labelledby="downloads-title">
        <h1 id="downloads-title">Download BitPet</h1>
        <p>Install the desktop pet and CLI for macOS or Windows. The download button resolves the latest GitHub release automatically.</p>
      </section>
      <section class="downloads-grid" aria-label="Download options">
        <article class="download-card">
          <h2>App</h2>
          <p>Download the desktop pet for macOS Apple Silicon or Windows.</p>
          ${downloadMenu()}
          <p class="release-note"><span data-release-version>Latest release</span></p>
        </article>
        <article class="download-card">
          <h2>CLI</h2>
          <p>Install the command line tools and auto-download the matching desktop app.</p>
          ${installCommand()}
        </article>
      </section>
    </main>
  `
}

function docsPage() {
  return `
    <main class="docs-shell">
      ${nav('docs')}
      <div class="docs-layout">
        <aside class="docs-sidebar">
          <a class="sidebar-title" href="/docs">BitPet Docs</a>
          <a href="/docs#about">About BitPet</a>
          ${docsSections.map((section) => `<a href="/docs#${section.id}">${section.label}</a>`).join('')}
          <a href="/docs#help">Help</a>
        </aside>
        <article class="docs-content">
          <a class="breadcrumb" href="/docs">BitPet Docs</a>
          <section id="about" class="doc-hero">
            <h1>BitPet Docs</h1>
            <p>BitPet 是一个跨平台 Tauri 桌面宠物：像素动画、CLI 控制、AI coding hooks 和 GitHub Release 分发集中在一个轻量工具里。</p>
          </section>
          <section class="get-started">
            <h2>Get Started</h2>
            <p>安装 BitPet 并运行。默认命令会安装 CLI，拉取最新桌面应用，并配置 Claude Code 的 /pet 命令。</p>
            <div class="doc-actions">
              <button class="outline-action" data-platform="mac">Download macOS</button>
              <button class="outline-action" data-platform="windows">Download Windows</button>
            </div>
            <p class="release-note"><span data-release-version>Latest release</span> · <span data-asset="mac">macOS DMG</span> · <span data-asset="windows">Windows installer</span></p>
            <p class="release-warning" data-release-warning hidden>无法读取 GitHub API，将跳转到 latest release 页面。</p>
          </section>
          ${docsSections.map((section) => `
            <section id="${section.id}" class="doc-section">
              <h2>${section.title}</h2>
              <p>${section.body}</p>
              <pre><code>${section.code}</code></pre>
            </section>
          `).join('')}
          <section class="doc-section">
            <h2>Command Reference</h2>
            <div class="command-list">
              ${commands.map(([name, text]) => `<div><code>bitpet ${name}</code><span>${text}</span></div>`).join('')}
            </div>
          </section>
          <section id="help" class="doc-section">
            <h2>Help</h2>
            <p>安装失败、桌面宠物无法启动或 AI hooks 没有响应时，优先查看状态和重新写入 hooks；确认仍是产品问题后，再到 GitHub Issues 反馈。</p>
            <pre><code>bitpet status
bitpet hooks
bitpet install-app</code></pre>
            <a class="support-link" href="${repoUrl}/issues" target="_blank" rel="noreferrer">Open GitHub Issues ↗</a>
          </section>
          <a class="edit-link" href="${repoUrl}" target="_blank" rel="noreferrer">View source on GitHub ↗</a>
        </article>
      </div>
    </main>
  `
}

function bindActions() {
  document.querySelectorAll('[data-action="toggle-downloads"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const menu = event.currentTarget.closest('[data-download-menu]')
      const isOpen = menu.classList.toggle('open')
      event.currentTarget.setAttribute('aria-expanded', String(isOpen))
    })
  })
  document.querySelectorAll('[data-platform]').forEach((button) => {
    button.addEventListener('click', () => downloadLatest(button.dataset.platform))
  })
  document.querySelectorAll('[data-action="copy-command"]').forEach((button) => {
    button.addEventListener('click', async () => {
      await navigator.clipboard?.writeText('npm install -g bitpet')
      button.classList.add('copied')
      window.setTimeout(() => {
        button.classList.remove('copied')
      }, 1200)
    })
  })
  document.addEventListener('click', (event) => {
    document.querySelectorAll('[data-download-menu].open').forEach((menu) => {
      if (!menu.contains(event.target)) {
        menu.classList.remove('open')
        menu.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false')
      }
    })
  })
}

function render() {
  const path = window.location.pathname
  const page = path.startsWith('/docs') ? docsPage() : path.startsWith('/downloads') ? downloadsPage() : homePage()
  document.querySelector('#app').innerHTML = page
  bindActions()
  updateDownloadLabels()
  scrollToHash()
}

window.addEventListener('popstate', render)
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="/"]')
  if (!link) return
  event.preventDefault()
  window.history.pushState({}, '', link.getAttribute('href'))
  render()
})

function scrollToHash() {
  if (!window.location.hash) {
    window.scrollTo({ top: 0 })
    return
  }
  requestAnimationFrame(() => {
    document.querySelector(window.location.hash)?.scrollIntoView({ block: 'start' })
  })
}

render()
loadRelease()
