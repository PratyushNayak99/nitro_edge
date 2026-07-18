# EdgeSentinel

**EdgeSentinel** is a capability-aware Linux troubleshooting MCP server for remote edge devices: IoT gateways, digital kiosks, Raspberry Pis, developer laptops, and CI hosts. It turns low-level host signals into normalized, actionable diagnostic results so an MCP-compatible AI client can investigate an incident without guessing from raw shell errors.

Built with the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) and [NitroStack](https://nitrostack.ai/).

## The problem

An offline edge node is often a black box. Engineers must SSH into a device, inspect inconsistent kernel and service output, and infer what failed. That workflow does not scale, and passing raw OS errors to an AI agent can lead to unreliable conclusions.

## The solution

EdgeSentinel is a local, bare-metal Linux SRE copilot. It discovers what a host can actually do, then uses portable fallbacks when common utilities are absent—for example, inspecting `ip link` or `/sys/class/net` when `nmcli` is unavailable. Its tools return Zod-validated, deterministic states such as `healthy`, `degraded`, and `unavailable`, with observations and safe remediation guidance rather than unfiltered command errors.

Diagnostics are read-only by default. The only mutating capability is an explicitly requested, allowlisted service restart; it always performs a read-only preflight first. Local deployment can keep telemetry on the device when used with a local MCP client and local model runtime.

## Features

- MCP-native tools, resources, prompts, and an interactive Hardware HUD widget
- Portable system, network, Bluetooth, service, and kernel-log diagnostics
- Capability-aware fallbacks for minimal Linux hosts
- Structured status, evidence, remediation, and safe error codes
- Human-in-the-loop, allowlisted service management
- Deterministic simulation scenarios for demos and tests

## MCP capabilities

| Type | Name | Purpose |
| --- | --- | --- |
| Tool | `get_system_health` | Collect portable host health telemetry. |
| Tool | `check_hardware_state` | Inspect Bluetooth or network state. |
| Tool | `audit_edge_system` | Run an aggregate, read-only edge audit. |
| Tool | `manage_system_service` | Inspect or explicitly restart an allowlisted service after preflight. |
| Resource | `syslog://dmesg` | Read a fixed-size, sanitized kernel-log sample. |
| Prompt | `incident_triage` | Guide an agent through a safe diagnostic workflow. |

## Getting started

### Prerequisites

- Node.js 18 or later
- An MCP-compatible client, such as Claude Desktop, Cursor, or NitroStudio

### Install and verify

```bash
git clone https://github.com/PratyushNayak99/nitro_edge.git
cd nitro_edge
cp .env.example .env
npm ci
npm test
npm run build
```

`.env` is local-only. Do not commit credentials, tokens, device identifiers, or production telemetry. See [`.env.example`](.env.example) for documented, non-secret settings.

### Run locally

```bash
npm run dev
```

For a safe, deterministic demo that never reads host commands or restarts a real service:

```bash
EDGE_SENTINEL_MODE=simulation EDGE_SENTINEL_SCENARIO=network-down npm run dev
```

Available scenarios are `nominal`, `network-down`, `bluetooth-blocked`, `service-failed`, and `minimal-host`.

For a production-style local start:

```bash
npm run start
```

## Connect an MCP client

### Hosted endpoint

Use the deployed MCP endpoint:

`https://edge-6a5b0209-aum-amrita-university-amritapuri-campus.app.nitrocloud.ai`

In an HTTP-capable MCP client, add an entry equivalent to:

```json
{
  "mcpServers": {
    "edgesentinel": {
      "url": "https://edge-6a5b0209-aum-amrita-university-amritapuri-campus.app.nitrocloud.ai"
    }
  }
}
```

Restart the client after saving the configuration. For local development, start the server and use the local `/mcp` HTTP endpoint printed by NitroStack. The exact configuration-file location varies by client; follow that client’s MCP setup instructions.

## Example incident workflow

1. Call `audit_edge_system` with `{ "intensity": "standard" }`.
2. Review its normalized status, capabilities, observations, and remediation.
3. Use `check_hardware_state` for the affected subsystem and `syslog://dmesg` when kernel context is needed.
4. If an allowlisted service is degraded, first call `manage_system_service` with `"action": "status"`.
5. Only after human review, explicitly request the allowlisted `restart` action.

## Deploy your own MCP app

NitroStack provides the build, deployment, and hosting workflow for MCP applications. Start at [nitrostack.ai](https://nitrostack.ai/), configure secrets through your deployment environment, and keep `.env` files out of source control.

## Security notes

- EdgeSentinel resolves commands from `PATH` and uses fixed, allowlisted argument arrays with time and output bounds.
- MCP responses contain normalized error codes and remediation; raw host errors remain in server logs.
- Service operations are limited to `bluetooth`, `NetworkManager`, `docker`, and `sshd`.
- Run against production devices only with appropriate access controls and operator approval.

## License

MIT. See [LICENSE](LICENSE).

---

Built with ❤️ using MCP and NitroStack.
