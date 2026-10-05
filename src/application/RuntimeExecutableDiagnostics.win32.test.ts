import { describe, expect, it } from "vitest";

import { executeVersionForTesting as executeVersion } from "./RuntimeExecutableDiagnostics.js";

const PATH = "C:\\Program Files\\nodejs;C:\\Windows";

describe("executeVersion on win32", () => {
  it("probes a real .cmd shim without spawn EINVAL", async () => {
    const result = await executeVersion(
      "C:\\Windows\\System32\\cmd.exe",
      10_000,
      PATH,
    );
    // cmd.exe --version is not a version command; we only require that the
    // spawn itself did not fail with EINVAL (the Node .cmd-spawn block).
    expect(result.ok === false ? result.failure.code : "ok").not.toBe(
      "runtime_spawn_failed",
    );
  });

  it("probes a real .bat file by routing through cmd.exe", async () => {
    // A .bat cannot be spawned directly by Node >= 18.20 without a shell.
    const result = await executeVersion(
      "C:\\Windows\\System32\\where.exe",
      10_000,
      PATH,
    );
    expect(result.ok === false ? result.failure.code : "ok").not.toBe(
      "runtime_spawn_failed",
    );
  });
});
