# hello-deepdog

DeepDog 最小插件 demo，包含一个 slash command、一个 skill 和一个 MCP stdio server 示例。

## 命令

```text
/hello-deepdog:hello [name]
```

## Skill

```text
hello-helper
```

## MCP

`.mcp.json` 会启动：

```text
node ${CLAUDE_PLUGIN_ROOT}/mcp/hello-server.mjs
```

这个 server 提供一个 MCP tool：

```text
hello
```

## 市场条目

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
