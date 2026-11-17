import assert from "node:assert/strict"
import { test } from "node:test"
import { identityLabel } from "../src/identity.js"

test("joins user and host", () => {
  assert.equal(identityLabel("dev", "modulixs.com"), "dev@modulixs.com")
})

test("keeps whichever half is available", () => {
  assert.equal(identityLabel("dev", ""), "dev")
  assert.equal(identityLabel(undefined, "modulixs.com"), "modulixs.com")
})

test("returns empty when neither half is available", () => {
  assert.equal(identityLabel("", ""), "")
  assert.equal(identityLabel(), "")
})
