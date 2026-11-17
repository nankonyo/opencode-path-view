# opencode-path-view

A small [OpenCode](https://opencode.ai) TUI plugin that shows **where the current session is running**: the working
directory, plus the git branch when the directory is inside a repository.

The path is drawn in the **center of the prompt footer**, so the built-in activity indicator (`esc interrupt`, spinner)
stays on the left and the usage / shortcut hints stay on the right.

```text
╹▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
 ⬝⬝■■■■ esc interrupt        /home/me/project        ↓ 1 shell · 97.2K (49%)  ctrl+p commands
 └──── activity ────┘        └──── path ────┘       └───────── usage ─────────┘
```

## Behavior

- Shows the absolute path of the session directory (`/home/me/project`).
- Appends the git branch when the directory is a git repository and `git` is installed (`/home/me/project:main`).
- Updates when you switch sessions, change directory (`session.cd`), or move a session to another worktree.
- OpenCode itself only renders the location while a session is idle. This plugin keeps the path visible while the
  model is working as well.

## Install

The plugin is TUI-only, so it is configured in `~/.config/opencode/cli.json` (not `opencode.json`).

### From a local checkout

```sh
git clone git@github.com:nankonyo/opencode-path-view.git ~/opencode-path-view
```

```json title="~/.config/opencode/cli.json"
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": ["/home/me/opencode-path-view"]
}
```

Absolute paths and `file://` URLs also work. Alternatively copy the folder into `~/.config/opencode/plugins/`, where
OpenCode discovers plugins automatically.

### From npm (published package)

```json title="~/.config/opencode/cli.json"
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": ["opencode-path-view"]
}
```

Restart the TUI (or run `/reload`) after changing the config.

## Options

Pass options with the object form:

```json title="~/.config/opencode/cli.json"
{
  "plugins": [
    {
      "package": "opencode-path-view",
      "options": { "compact": true }
    }
  ]
}
```

| Option    | Type    | Default | Description                                                        |
| --------- | ------- | ------- | ------------------------------------------------------------------ |
| `compact` | boolean | `false` | Abbreviates the home directory to `~` instead of the absolute path. |

## Disable

Remove the entry from `plugins` in `cli.json`, or prefix it with `-`:

```json
{ "plugins": ["-opencode-path-view"] }
```

## Requirements

- OpenCode with TUI plugin support (`opencode` v2).
- `git` on `PATH` for the branch suffix. Without it (or outside a repository) only the path is shown.

## Development

```sh
git clone git@github.com:nankonyo/opencode-path-view.git
cd opencode-path-view
```

Point `plugins` in `cli.json` at the checkout and restart the TUI to see changes. The TUI part is loaded at runtime,
so there is no build step.

## License

MIT
