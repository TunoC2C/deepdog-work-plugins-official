# DeepDog Work Plugins Directory

A curated directory of plugins for DeepDog Work and Claude Code-compatible plugin clients.

> **Important:** Make sure you trust a plugin before installing, updating, or using it. DeepDog does not control third-party MCP servers, files, or other software included in external plugins and cannot verify that they will work as intended or that they will not change. See each plugin's homepage for more information.

## Structure

- **`/plugins`** - Plugins maintained in this repository
- **`/external_plugins`** - Third-party plugins from partners and the community

## Installation

Plugins can be installed directly from this marketplace via a compatible plugin system.

To install, run `/plugin install {plugin-name}@deepdog-work-plugins-official`

or browse for the plugin in `/plugin > Discover` when your client supports marketplace discovery.

## Contributing

### Maintained Plugins

Maintained plugins live under `/plugins`. See `/plugins/example-plugin` for a reference implementation.

### External Plugins

Third-party partners can submit plugins for inclusion in the marketplace. External plugins should meet the quality and security standards expected by this directory before they are accepted.

## Plugin Structure

Each plugin follows a standard structure:

```text
plugin-name/
|-- .claude-plugin/
|   `-- plugin.json      # Plugin metadata (required)
|-- .mcp.json            # MCP server configuration (optional)
|-- commands/            # Slash commands (optional)
|-- agents/              # Agent definitions (optional)
|-- skills/              # Skill definitions (optional)
`-- README.md            # Documentation
```

## Plugin names are immutable

The `name` field in a marketplace entry is an **immutable slug**. Once a plugin has been published, its `name` must not change because users may have it installed under that slug, and renaming it can break their install with a `plugin-not-found` error.

- To change how a plugin is labeled in the UI, set or update `displayName` instead.
- If a rename is genuinely unavoidable, add an entry to the top-level `renames` map in `.claude-plugin/marketplace.json` so existing installs can migrate:

```json
"renames": {
  "old-name": "new-name"
}
```

A compatible plugin loader can read this map and rewrite the old slug to the new one on the user's next sync.

## Skill-bundle plugins

When a plugin's source repository ships skills (`SKILL.md` files) without a `.claude-plugin/plugin.json` manifest, the marketplace entry can declare the skills directly using `strict: false` and an explicit `skills` array.

```json
{
  "name": "example-bundle",
  "description": "Brief description of the bundled skills.",
  "author": { "name": "Author Name" },
  "category": "development",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/example-org/sdk.git",
    "path": "packages/agent-skills",
    "ref": "main",
    "sha": "<commit sha>"
  },
  "strict": false,
  "skills": [
    "./skill-a",
    "./skill-b",
    "./skill-c"
  ],
  "homepage": "https://github.com/example-org/sdk"
}
```

Each path in `skills` is relative to `source.path` and points at a directory containing a `SKILL.md`. Paths can reach deeper than a single level; for example, `["./libA/skill-1", "./libB/skill-2"]` exposes a curated subset across multiple library subdirectories. Each skill is registered as `<plugin-name>:<skill-name>` in Claude Code-compatible clients.

For the underlying schema, see [Strict mode](https://code.claude.com/docs/en/plugin-marketplaces) in the marketplace documentation.

## License

Please see each linked plugin for the relevant LICENSE file.

## Documentation

For more information on developing Claude Code-compatible plugins, see the [official documentation](https://code.claude.com/docs/en/plugins).
