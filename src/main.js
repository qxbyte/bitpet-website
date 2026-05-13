import './styles.css'

const repoUrl = 'https://github.com/qxbyte/bitpet'
const latestReleaseUrl = `${repoUrl}/releases/latest`
const issuesUrl = `${repoUrl}/issues`
const apiUrl = 'https://api.github.com/repos/qxbyte/bitpet/releases/latest'

const docs = [
  {
    slug: 'install',
    label: 'Install',
    title: '安装 BitPet',
    summary: '通过 npm 一键安装 CLI + 桌面应用，或从 GitHub Release 单独下载安装包。',
    sections: [
      {
        heading: '一键安装（推荐）',
        body: 'npm 包会自动下载同版本桌面应用：macOS 安装 BitPet.app 到 /Applications，Windows 安装桌面应用 + bitpet CLI。',
        code: 'npm install -g bitpet\nbitpet init',
      },
      {
        heading: '只安装 CLI',
        body: '已经有桌面应用、或者只想要命令行工具，跳过 postinstall 即可。',
        code: 'npm install -g bitpet --ignore-scripts\nbitpet --version',
      },
      {
        heading: '手动下载（macOS）',
        body: 'Apple Silicon 选 aarch64 DMG，Intel Mac 选 x64 DMG。首次打开被 Gatekeeper 拦截时解除隔离。',
        code: 'xattr -cr /Applications/BitPet.app',
      },
      {
        heading: '手动下载（Windows）',
        body: '运行 BitPet_x.x.x_x64-setup.exe，安装完成后再用 npm 安装 CLI。',
        code: 'npm install -g bitpet --ignore-scripts\nbitpet init',
      },
      {
        heading: '从源码构建',
        body: '克隆仓库、装依赖、用 Tauri 构建 macOS DMG 或 Windows NSIS 安装包，整体约 3–5 分钟。',
        code: 'git clone https://github.com/qxbyte/bitpet.git\ncd bitpet\nnpm install\nnpm run build',
      },
    ],
  },
  {
    slug: 'usage',
    label: 'Commands',
    title: '日常命令',
    summary: '通过 CLI 喂食、玩耍、查看状态，或在 Claude Code 内用 /pet 子命令。',
    sections: [
      {
        heading: '启动与停止',
        body: '首次运行 init 会创建状态文件、显示宠物窗口、自动写入 Claude Code hook。stop 保存状态并关闭。',
        code: 'bitpet init\nbitpet stop',
      },
      {
        heading: '互动命令',
        body: '喂食、玩耍、睡觉。每个命令都会同步更新状态文件（macOS: ~/.config/bitpet/state.json，Windows: %APPDATA%\\bitpet\\state.json）。',
        code: 'bitpet feed     # 饥饿度 -30，心情 +20，精力 +30\nbitpet play     # 心情 +15，精力 -10\nbitpet sleep    # 触发睡眠动画，精力保底 30',
      },
      {
        heading: '查看状态',
        body: '终端里直接看到饥饿度 / 心情 / 精力。',
        code: 'bitpet status',
      },
      {
        heading: '/pet 斜杠命令',
        body: '安装时会自动注册到 ~/.claude/commands/pet.md，可以在 Claude Code 内直接调用。',
        code: '/pet init\n/pet feed\n/pet play\n/pet status\n/pet stop',
      },
    ],
  },
  {
    slug: 'states',
    label: 'States',
    title: '状态机',
    summary: '理解 hunger / mood / energy 三个数值如何驱动宠物的动画状态。',
    sections: [
      {
        heading: '数值字段',
        body: 'hunger 初始 20（越高越饿），mood 初始 80（越高越开心），energy 初始 90（越高越精神）。三者都在 0–100 范围内。',
      },
      {
        heading: '自动衰减',
        body: '每 6 分钟一次：hunger +5（约 96 分钟涨满）、energy -1（约 9 小时耗尽）、mood 不变。',
      },
      {
        heading: '动画优先级',
        body: '从高到低：deep_sleep（energy ≤ 20）→ sleeping（hunger ≥ 100）→ idle。mood 当前不触发动画，仅作数值记录。',
      },
      {
        heading: '边界行为',
        body: 'sleep 命令会强制把 hunger 设为 100 以触发睡眠动画；energy ≤ 20 时只能靠 feed 唤醒——没有自动恢复机制。',
      },
    ],
  },
  {
    slug: 'integrations',
    label: 'AI Integrations',
    title: 'AI 编程工具集成',
    summary: 'BitPet 通过本地 IPC Socket + hook 命令感知 AI 会话事件——提示词、工具调用、任务完成都会同步到桌面。',
    sections: [
      {
        heading: '事件 → 动画映射',
        body: '按下回车 → 思考动画；工具调用开始 → 气泡显示工具名；工具执行完毕 → 切换为活跃动画 + 输出摘要；模型回复完成 → ✓ 完成，回到闲置。',
      },
      {
        heading: 'Claude Code',
        body: 'bitpet init 会自动配置 ~/.claude/settings.json 的 hooks。如果没反应，再写一次 hooks，然后重开 Claude Code 会话。',
        code: 'bitpet hooks',
      },
      {
        heading: 'Codex',
        body: '为 Codex CLI 写入对应的 hook 配置。',
        code: 'bitpet setup-hooks --tool codex',
      },
      {
        heading: 'OpenCode',
        body: '为 OpenCode 写入 hook 配置。',
        code: 'bitpet setup-hooks --tool opencode',
      },
    ],
  },
  {
    slug: 'troubleshooting',
    label: 'Troubleshooting',
    title: '常见问题',
    summary: '宠物窗口不显示、命令找不到、AI 集成无响应时的排查顺序。',
    sections: [
      {
        heading: '宠物窗口不显示',
        body: '先查状态，没运行就重启；如果显示运行中却找不到窗口，stop 后再 init。',
        code: 'bitpet status\nbitpet stop\nbitpet init',
      },
      {
        heading: 'bitpet 命令找不到',
        body: '确认 CLI 已全局安装，并把 npm 全局 bin 加入 PATH。',
        code: 'npm install -g bitpet --ignore-scripts\nwhich bitpet\necho "$(npm prefix -g)/bin"',
      },
      {
        heading: 'init 找不到桌面应用',
        body: '通常是 postinstall 没下载完，补装一次即可，或直接去 Releases 手动下载。',
        code: 'bitpet install-app\nbitpet init',
      },
      {
        heading: 'macOS 提示「已损坏」',
        body: '未签名 app 被 Gatekeeper 拦截，解除隔离属性后再打开。',
        code: 'xattr -cr /Applications/BitPet.app',
      },
      {
        heading: 'AI hooks 没反应',
        body: '确认宠物运行中 + hook 命令可达 + 重开 AI 会话。',
        code: 'bitpet status\nbitpet hooks\nwhich bitpet-hook',
      },
    ],
  },
]

function docBySlug(slug) {
  return docs.find((doc) => doc.slug === slug)
}

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

function brandIcon() {
  return `<img class="brand-icon" src="/sprites/app-icon-128.png" alt="" aria-hidden="true" />`
}

function nav(active = 'home') {
  return `
    <header class="topbar">
      <a class="brand" href="/" aria-label="BitPet home">
        ${brandIcon()}
        <span>BitPet</span>
      </a>
      <nav>
        <a class="${active === 'docs' ? 'active' : ''}" href="/docs">Docs</a>
        <a class="ext" href="${repoUrl}" target="_blank" rel="noreferrer">
          <span class="gh-icon" aria-hidden="true"></span>GitHub
        </a>
        <a class="downloads-link ${active === 'downloads' ? 'active' : ''}" href="/downloads">Downloads</a>
      </nav>
    </header>
  `
}

function installPill() {
  return `
    <div class="install-pill" aria-label="Install command">
      <span class="install-prompt">$</span>
      <code><span class="cmd-bin">npm</span> <span class="cmd-sub">install</span> -g bitpet</code>
      <button class="copy-btn" data-action="copy-cmd" aria-label="Copy install command">
        <span class="copy-icon-new" aria-hidden="true"></span>
        <span class="copy-ok" aria-hidden="true">copied</span>
      </button>
    </div>
  `
}

function siteFooter() {
  return `
    <footer class="site-foot">
      <div class="foot-inner">
        <div class="foot-brand">${pixelPet('foot-pet')}<span>BitPet</span></div>
        <span class="foot-copy">© 2026 BitPet · MIT</span>
      </div>
    </footer>
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
        <div class="hero-bg" aria-hidden="true"><span class="dotgrid"></span></div>
        <div class="hero-inner">
          <div class="hero-duel" aria-hidden="true">
            <div class="duel-actor duel-left">
              ${pixelPet('duel-pet')}
              <svg class="sword sword-orange" viewBox="0 0 20 6" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
                <rect x="0"  y="2" width="3"  height="2" fill="#8b5a3a"/>
                <rect x="3"  y="1" width="1"  height="4" fill="#5a2618"/>
                <rect x="4"  y="2" width="13" height="2" fill="#ffb46b"/>
                <rect x="17" y="2" width="2"  height="2" fill="#ffd9a3"/>
                <rect x="19" y="3" width="1"  height="1" fill="#fff3d6"/>
              </svg>
            </div>
            <span class="clash"></span>
            <div class="duel-actor duel-right">
              <svg class="sword sword-blue" viewBox="0 0 20 6" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
                <rect x="0"  y="3" width="1"  height="1" fill="#dbe6ff"/>
                <rect x="1"  y="2" width="2"  height="2" fill="#a8b8ff"/>
                <rect x="3"  y="2" width="13" height="2" fill="#6f7dff"/>
                <rect x="16" y="1" width="1"  height="4" fill="#1a1f4a"/>
                <rect x="17" y="2" width="3"  height="2" fill="#8b5a3a"/>
              </svg>
              ${pixelPet('duel-pet pet-flip')}
            </div>
          </div>
          <p class="eyebrow">DESKTOP · CLI · AI HOOKS</p>
          <h1 id="hero-title">A pixel pet that<br />codes alongside you.</h1>
          <p class="lede">BitPet 是一只住在桌面右下角的像素宠物。它通过本地 IPC 与 Claude Code、Codex、OpenCode 实时通信——你按下回车它就开始思考，工具调用时显示进度，任务完成它回到闲置。</p>
          <div class="hero-actions">
            ${downloadMenu()}
            ${installPill()}
          </div>
          <p class="hero-meta">
            <a href="/docs/install">Install guide →</a>
            <a class="ext" href="${repoUrl}" target="_blank" rel="noreferrer">View source on GitHub ↗</a>
          </p>
        </div>
      </section>

      <section class="showcase" aria-label="BitPet preview">
        <div class="showcase-window">
          <div class="win-bar">
            <span class="win-dot"></span><span class="win-dot"></span><span class="win-dot"></span>
            <span class="win-title">claude code · bitpet session</span>
          </div>
          <div class="win-body">
            <ol class="codelines">
              <li><span class="c-prompt">›</span> <span class="c-user">how do I add a release workflow?</span></li>
              <li><span class="c-event">UserPromptSubmit</span><span class="c-arrow">→</span><span class="c-tag tag-think">thinking</span></li>
              <li><span class="c-event">PreToolUse</span><span class="c-tool">Read</span><span class="c-path">.github/workflows/release.yml</span></li>
              <li><span class="c-event">PostToolUse</span><span class="c-arrow">→</span><span class="c-tag tag-active">active</span></li>
              <li><span class="c-event">PreToolUse</span><span class="c-tool">Edit</span><span class="c-path">package.json</span></li>
              <li><span class="c-event">Stop</span><span class="c-arrow">→</span><span class="c-tag tag-idle">idle</span><span class="c-ok">✓ done</span></li>
            </ol>
            <aside class="show-pet">
              ${pixelPet('show-pet-sprite')}
              <div class="speech">Edit · package.json</div>
              <dl class="show-stats">
                <div><dt>hunger</dt><dd>15</dd></div>
                <div><dt>mood</dt><dd>88</dd></div>
                <div><dt>energy</dt><dd>90</dd></div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section class="features">
        <article>
          <h3>Lives above your desktop</h3>
          <p>透明无边框、始终悬浮，窗口只有 110×150，不挡你的代码。可拖到任何角落，重启后位置复原。</p>
        </article>
        <article>
          <h3>CLI-native controls</h3>
          <p><code>bitpet feed</code>、<code>play</code>、<code>sleep</code>、<code>status</code> 都从终端调用。Claude Code 内还有 /pet 斜杠命令。</p>
        </article>
        <article>
          <h3>Hooks for coding agents</h3>
          <p>本地 IPC Socket 监听 Claude Code / Codex / OpenCode 事件，把后台工具调用变成桌面即时反馈。</p>
        </article>
      </section>

      <section class="cards">
        <div class="cards-head">
          <h2>Explore</h2>
          <a class="card-meta-link" href="/docs">All documentation →</a>
        </div>
        <div class="card-grid">
          <a class="card" href="/docs/install">
            <span class="card-kicker">Get Started</span>
            <h4>Install BitPet</h4>
            <p>一行 npm 命令安装 CLI 和桌面应用，或者从 GitHub Release 单独下载。</p>
            <span class="card-link">Read install guide →</span>
          </a>
          <a class="card" href="/docs/integrations">
            <span class="card-kicker">Integrate</span>
            <h4>AI Coding Hooks</h4>
            <p>配置 Claude Code、Codex、OpenCode 的 hook，让宠物随会话节奏切换状态。</p>
            <span class="card-link">Hook your tools →</span>
          </a>
          <a class="card" href="/docs/usage">
            <span class="card-kicker">Reference</span>
            <h4>CLI Commands</h4>
            <p>所有可用命令、效果、状态文件位置——一个表格列清楚。</p>
            <span class="card-link">View command list →</span>
          </a>
          <a class="card" href="/docs/states">
            <span class="card-kicker">Mechanics</span>
            <h4>Pet state machine</h4>
            <p>hunger / mood / energy 如何衰减，sleeping、active、idle 的触发规则。</p>
            <span class="card-link">See state rules →</span>
          </a>
        </div>
      </section>

      ${siteFooter()}
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

function docsLayout(activeSlug, content) {
  const sidebar = `
    <aside class="docs-side">
      <a class="side-brand" href="/docs">
        <span>BitPet Docs</span>
      </a>
      <div class="side-group">
        <span class="side-head">Overview</span>
        <a class="${activeSlug === '' ? 'is-active' : ''}" href="/docs">Introduction</a>
        <a class="ext" href="${repoUrl}" target="_blank" rel="noreferrer">GitHub <span class="arrow">↗</span></a>
      </div>
      <div class="side-group">
        <span class="side-head">Guides</span>
        ${docs.map((d) => `<a class="${activeSlug === d.slug ? 'is-active' : ''}" href="/docs/${d.slug}">${d.label}</a>`).join('')}
      </div>
      <div class="side-group">
        <span class="side-head">Resources</span>
        <a href="/downloads">Downloads</a>
        <a class="ext" href="${issuesUrl}" target="_blank" rel="noreferrer">Report an issue <span class="arrow">↗</span></a>
      </div>
    </aside>
  `
  return `
    <div class="page page-docs">
      ${nav('docs')}
      <div class="docs-shell-grid">
        ${sidebar}
        <main class="docs-main">${content}</main>
      </div>
      ${siteFooter()}
    </div>
  `
}

function docsIndex() {
  const cards = docs.map((doc) => `
    <a class="doc-card" href="/docs/${doc.slug}">
      <span class="doc-card-kicker">${doc.label}</span>
      <h3>${doc.title}</h3>
      <p>${doc.summary}</p>
      <span class="doc-card-link">Read →</span>
    </a>
  `).join('')
  return docsLayout('', `
    <header class="docs-hero">
      <p class="crumbs">Docs</p>
      <h1>BitPet Docs</h1>
      <p class="hero-sub">a cross-platform Tauri desktop pet — pixel animations, CLI controls, AI coding hooks, and GitHub Release distribution in one tiny tool.</p>
    </header>

    <section class="docs-block">
      <h2>Get Started</h2>
      <p class="block-lede">装好 BitPet 并跑起来，AI 工具的配置随后自动完成。</p>
      <div class="get-started-row">
        ${installPill()}
        <a class="btn-ghost" href="/docs/install">Detailed install guide →</a>
      </div>
    </section>

    <section class="docs-block">
      <h2>Featured Documentation</h2>
      <div class="doc-grid">
        ${cards}
      </div>
    </section>

    <a class="edit-link" href="${repoUrl}" target="_blank" rel="noreferrer">View source on GitHub ↗</a>
  `)
}

function docPage(slug) {
  const doc = docBySlug(slug)
  if (!doc) {
    return docsLayout('', `
      <header class="docs-hero">
        <p class="crumbs"><a href="/docs">Docs</a> / Not found</p>
        <h1>这页还没写</h1>
        <p class="hero-sub">在侧边栏选一项，或回到 <a href="/docs">Docs 首页</a>。</p>
      </header>
    `)
  }
  const idx = docs.findIndex((d) => d.slug === slug)
  const prev = docs[idx - 1]
  const next = docs[idx + 1]
  const sections = doc.sections.map((sec) => `
    <section class="doc-sec">
      <h3>${sec.heading}</h3>
      <p>${sec.body}</p>
      ${sec.code ? `<pre><code>${sec.code}</code></pre>` : ''}
    </section>
  `).join('')

  return docsLayout(slug, `
    <header class="docs-hero">
      <p class="crumbs"><a href="/docs">Docs</a> / ${doc.label}</p>
      <h1>${doc.title}</h1>
      <p class="hero-sub">${doc.summary}</p>
    </header>

    ${sections}

    <nav class="doc-paging">
      ${prev ? `<a class="paging-prev" href="/docs/${prev.slug}"><span>← Previous</span><strong>${prev.title}</strong></a>` : '<span></span>'}
      ${next ? `<a class="paging-next" href="/docs/${next.slug}"><span>Next →</span><strong>${next.title}</strong></a>` : ''}
    </nav>

    <a class="edit-link" href="${repoUrl}/blob/main/README.md" target="_blank" rel="noreferrer">Edit on GitHub ↗</a>
  `)
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
  document.querySelectorAll('[data-action="copy-command"], [data-action="copy-cmd"]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard?.writeText('npm install -g bitpet')
        button.classList.add('copied')
        window.setTimeout(() => {
          button.classList.remove('copied')
        }, 1200)
      } catch {}
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
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  let page
  if (path === '/downloads') {
    page = downloadsPage()
  } else if (path === '/docs') {
    page = docsIndex()
  } else if (path.startsWith('/docs/')) {
    page = docPage(path.slice('/docs/'.length))
  } else {
    page = homePage()
  }
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
