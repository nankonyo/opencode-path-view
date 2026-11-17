import { Plugin, usePlugin } from "@opencode/plugin/tui"
import { Show, createMemo } from "solid-js"
import { hostname, userInfo } from "node:os"
import { identityLabel } from "./identity.js"

const identity = (() => {
  try {
    return identityLabel(userInfo().username, hostname())
  } catch {
    return ""
  }
})()

/**
 * Renders the active session directory, preceded by the current `user@host`
 * and followed by the current git branch when the directory is inside a
 * repository, centered in the prompt footer.
 *
 * The built-in activity indicator (`esc interrupt`, spinner) keeps the left
 * side and usage/shortcut hints keep the right side, so this only draws the
 * location itself.
 */
function SessionPath(props: { sessionID?: string; compact: boolean }) {
  const context = usePlugin()

  const location = createMemo(() => {
    const session = props.sessionID ? context.data.session.get(props.sessionID) : undefined
    return session?.location ?? context.location ?? context.data.location.default()
  })

  const label = createMemo(() => {
    if (!props.sessionID) return
    const loc = location()
    if (!loc) return
    const path = props.compact ? context.ui.format.path(loc.directory) : loc.directory
    const branch = context.data.location.vcs.info(loc)?.branch.current
    const target = branch ? `${path}:${branch}` : path
    return identity ? `${identity}:${target}` : target
  })

  return (
    <Show when={label()}>
      {(value) => (
        <box
          position="absolute"
          left={0}
          right={0}
          height={1}
          flexDirection="row"
          justifyContent="center"
        >
          <text fg={context.theme.text.muted} wrapMode="none" truncate>
            {value()}
          </text>
        </box>
      )}
    </Show>
  )
}

export default Plugin.define({
  id: "opencode-path-view",
  setup(context) {
    const compact = context.options.compact === true

    const syncLocation = (location?: { directory: string; workspaceID?: string }) => {
      const target = location ?? context.location ?? context.data.location.default()
      if (target) void context.data.location.vcs.sync(target)
    }

    syncLocation()

    const stopMoved = context.data.on("session.moved", (event) => syncLocation(event.data.location))
    const stopWorktree = context.data.on("worktree.updated", () => syncLocation())

    context.ui.slot({
      append: "prompt.footer",
      render: (input: { sessionID?: string }) => (
        <SessionPath sessionID={input?.sessionID} compact={compact} />
      ),
    })

    return () => {
      stopMoved()
      stopWorktree()
    }
  },
})
