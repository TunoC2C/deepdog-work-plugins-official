# DeepDog 插件市场接入手册

本文档面向 DeepDog 插件市场维护和本地接入测试，说明市场清单怎么写、如何用命令手动接入 DeepDog，以及一个最小但完整的 `hello-deepdog` 插件 demo。

## 1. 市场文件

DeepDog 插件市场使用仓库根目录下的清单文件：

```text
.claude-plugin/marketplace.json
```

市场展示哪些插件，由这个文件里的 `plugins` 数组决定。插件目录存在于 `plugins/` 或 `external_plugins/` 不代表会自动展示，必须写进 `plugins` 数组。

最小市场示例：

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "deepdog-work-plugins-official",
  "description": "Directory of DeepDog Work plugins.",
  "owner": {
    "name": "deepdog"
  },
  "plugins": [
    {
      "name": "hello-deepdog",
      "description": "Minimal DeepDog plugin demo with command, skill, and MCP examples.",
      "author": {
        "name": "deepdog"
      },
      "source": "./plugins/hello-deepdog",
      "category": "development",
      "homepage": "https://github.com/PrimaryCY/deepdog-work-plugins-official/tree/main/plugins/hello-deepdog"
    }
  ]
}
```

常用字段：

| 字段 | 说明 |
| --- | --- |
| `name` | 市场名或插件名。插件里的 `name` 会参与安装、启用、命令命名空间和缓存记录。 |
| `description` | 市场或插件说明，用于列表和详情页展示。 |
| `owner` | 市场维护方。 |
| `plugins` | 插件列表，决定市场展示内容。 |
| `source` | 插件安装来源。安装时读它，不读 `homepage`。 |
| `homepage` | 插件主页链接，只用于展示和跳转。 |
| `category` | 插件分类，用于 UI 分组或筛选。 |

## 2. source 写法

当前市场仓库内的插件：

```json
"source": "./plugins/hello-deepdog"
```

外部 Git 仓库插件：

```json
"source": {
  "source": "url",
  "url": "https://github.com/example/hello-plugin.git",
  "sha": "0123456789abcdef0123456789abcdef01234567"
}
```

外部 Git 仓库子目录插件：

```json
"source": {
  "source": "git-subdir",
  "url": "https://github.com/example/plugin-market.git",
  "path": "plugins/hello-deepdog",
  "ref": "main",
  "sha": "0123456789abcdef0123456789abcdef01234567"
}
```

## 3. 手动接入 DeepDog

下面命令只是本地接入和验证示例，具体目录可以按 DeepDog 实际实现调整。

创建本地目录：

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.deepdog\marketplaces" | Out-Null
New-Item -ItemType Directory -Force "$env:USERPROFILE\.deepdog\plugins\cache" | Out-Null
```

拉取市场仓库：

```powershell
git clone git@github.com:PrimaryCY/deepdog-work-plugins-official.git "$env:USERPROFILE\.deepdog\marketplaces\deepdog-work-plugins-official"
```

检查市场 JSON 是否有效：

```powershell
node -e "const fs=require('fs'); const p=process.env.USERPROFILE+'\\.deepdog\\marketplaces\\deepdog-work-plugins-official\\.claude-plugin\\marketplace.json'; const m=JSON.parse(fs.readFileSync(p,'utf8')); console.log(m.name, m.plugins.length)"
```

列出市场插件：

```powershell
node -e "const fs=require('fs'); const p=process.env.USERPROFILE+'\\.deepdog\\marketplaces\\deepdog-work-plugins-official\\.claude-plugin\\marketplace.json'; const m=JSON.parse(fs.readFileSync(p,'utf8')); for (const item of m.plugins) console.log(item.name, '=>', typeof item.source === 'string' ? item.source : item.source.url)"
```

把 `hello-deepdog` 从市场仓库复制到 DeepDog 插件缓存：

```powershell
$market = "$env:USERPROFILE\.deepdog\marketplaces\deepdog-work-plugins-official"
$target = "$env:USERPROFILE\.deepdog\plugins\cache\deepdog-work-plugins-official\hello-deepdog\local"
New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
Copy-Item -Recurse -Force "$market\plugins\hello-deepdog" $target
```

检查插件 manifest：

```powershell
node -e "const fs=require('fs'); const p=process.env.USERPROFILE+'\\.deepdog\\plugins\\cache\\deepdog-work-plugins-official\\hello-deepdog\\local\\.claude-plugin\\plugin.json'; console.log(JSON.parse(fs.readFileSync(p,'utf8')))"
```

## 4. hello-deepdog Demo

仓库里提供了一个真实 demo：

```text
plugins/hello-deepdog/
|-- .claude-plugin/
|   `-- plugin.json
|-- commands/
|   `-- hello.md
|-- skills/
|   `-- hello-helper/
|       `-- SKILL.md
|-- mcp/
|   `-- hello-server.mjs
|-- .mcp.json
`-- README.md
```

这个 demo 包含：

- 一个插件 manifest：`.claude-plugin/plugin.json`
- 一个 slash command：`commands/hello.md`
- 一个 skill：`skills/hello-helper/SKILL.md`
- 一个 MCP 配置：`.mcp.json`
- 一个最小 MCP stdio server：`mcp/hello-server.mjs`

### 4.1 加入市场

如果要让 DeepDog 市场展示这个 demo，把下面条目加入 `.claude-plugin/marketplace.json` 的 `plugins` 数组：

```json
{
  "name": "hello-deepdog",
  "description": "Minimal DeepDog plugin demo with command, skill, and MCP examples.",
  "author": {
    "name": "deepdog"
  },
  "source": "./plugins/hello-deepdog",
  "category": "development",
  "homepage": "https://github.com/PrimaryCY/deepdog-work-plugins-official/tree/main/plugins/hello-deepdog"
}
```

### 4.2 slash command

文件路径：

```text
plugins/hello-deepdog/commands/hello.md
```

推荐注册出的命令名：

```text
/hello-deepdog:hello
```

### 4.3 skill

文件路径：

```text
plugins/hello-deepdog/skills/hello-helper/SKILL.md
```

这个 skill 用于解释 demo 插件结构，以及验证 command、skill、MCP 是否被 DeepDog 正确发现。

### 4.4 MCP

文件路径：

```text
plugins/hello-deepdog/.mcp.json
plugins/hello-deepdog/mcp/hello-server.mjs
```

`.mcp.json` 使用 stdio server 示例。DeepDog 安装插件后，可以根据自己的 MCP 加载策略启动这个 server。

手动测试 MCP server 是否能启动：

```powershell
node .\plugins\hello-deepdog\mcp\hello-server.mjs
```

启动后它会等待 JSON-RPC 输入。它实现了最小的 `initialize`、`tools/list` 和 `tools/call` 响应，用于客户端联调。

## 5. demo 文件内容

下面是 demo 里的关键文件内容，仓库中也已经放置了实际文件。

### `.claude-plugin/plugin.json`

```json
{
  "name": "hello-deepdog",
  "description": "Minimal DeepDog plugin demo with command, skill, and MCP examples.",
  "author": {
    "name": "deepdog"
  }
}
```

### `commands/hello.md`

```markdown
---
description: 输出 DeepDog 插件问候，并回显用户传入的参数。
argument-hint: [name]
---

# Hello DeepDog

用户传入参数：$ARGUMENTS

请用中文简短回复：

1. 问候用户。
2. 如果用户提供了参数，把参数作为称呼。
3. 说明这个回复来自 `hello-deepdog` 插件。
4. 提醒用户这个 demo 同时包含 command、skill 和 MCP 示例。
```

### `skills/hello-helper/SKILL.md`

```markdown
---
name: hello-helper
description: 当用户询问 hello-deepdog、DeepDog 插件 demo、插件市场测试、slash command 注册或 MCP 插件示例时使用。
version: 1.0.0
---

# Hello Helper

这个 skill 用于说明 `hello-deepdog` demo 的结构。

## 说明重点

- 市场展示来自 `.claude-plugin/marketplace.json` 的 `plugins` 数组。
- 插件代码来源来自插件条目的 `source` 字段。
- slash command 来自 `commands/hello.md`。
- MCP 示例来自 `.mcp.json` 和 `mcp/hello-server.mjs`。

## 输出要求

回答要简短，并优先给出可验证路径。
```

### `.mcp.json`

```json
{
  "hello-deepdog": {
    "type": "stdio",
    "command": "node",
    "args": [
      "${CLAUDE_PLUGIN_ROOT}/mcp/hello-server.mjs"
    ]
  }
}
```

## 6. 验收命令

检查 demo 文件是否完整：

```powershell
Get-ChildItem -Recurse .\plugins\hello-deepdog
```

检查 demo 插件 manifest：

```powershell
node -e "console.log(JSON.parse(require('fs').readFileSync('plugins/hello-deepdog/.claude-plugin/plugin.json','utf8')))"
```

检查 command 文件：

```powershell
Get-Content -Encoding UTF8 .\plugins\hello-deepdog\commands\hello.md
```

检查 skill 文件：

```powershell
Get-Content -Encoding UTF8 .\plugins\hello-deepdog\skills\hello-helper\SKILL.md
```

检查 MCP 配置：

```powershell
node -e "console.log(JSON.parse(require('fs').readFileSync('plugins/hello-deepdog/.mcp.json','utf8')))"
```

启动 MCP server：

```powershell
node .\plugins\hello-deepdog\mcp\hello-server.mjs
```
