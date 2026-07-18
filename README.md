# EdgeSentinel

EdgeSentinel is a capability-aware Linux diagnostics MCP server for Raspberry Pi, IoT gateways, kiosks, developer laptops, and CI. It uses portable fallbacks and returns normalized diagnostic states instead of raw operating-system errors.

## Safety model

- Commands are resolved from `PATH`, use fixed allowlisted argument arrays, and have time/output bounds.
- Diagnostics are read-only. `manage_system_service` is the only mutating tool, accepts only the existing service allowlist, and restarts only after an explicit request and a read-only preflight.
- Host process errors, paths, stderr, and shell messages remain in server logs; MCP responses expose only normalized error codes and safe remediation.

## Local setup and verification

```bash
npm ci
npm test
npm run build
```

Start the local simulator:

```bash
EDGE_SENTINEL_MODE=simulation EDGE_SENTINEL_SCENARIO=network-down npm run dev
```

Available deterministic scenarios are `nominal`, `network-down`, `bluetooth-blocked`, `service-failed`, and `minimal-host`. Simulation never reads host commands or restarts services; a restart request reports a simulated “would restart” result.

## Kiosk Wi-Fi use case

1. Start with `EDGE_SENTINEL_MODE=simulation EDGE_SENTINEL_SCENARIO=network-down npm run dev`.
2. Invoke `audit_edge_system` with `{ "intensity": "standard" }`.
3. Verify the aggregate report is `degraded`, includes fallback network capabilities, reports `network_unavailable`, and recommends checking link/configuration without exposing an `nmcli` error.
4. Switch to `EDGE_SENTINEL_SCENARIO=service-failed` to see the Hardware HUD’s explicit restart recommendation.
5. Call `manage_system_service` separately to exercise the simulated approval path. Audits, prompts, and widgets never restart services.

## Clients

Connect NitroStudio to the local development server, invoke `get_system_health`, `check_hardware_state`, `audit_edge_system`, and `manage_system_service`, then inspect the Hardware HUD. For Inspector-compatible clients, use the server’s HTTP mode and its local `/mcp` endpoint as printed by the development server.

For a real Raspberry Pi or gateway, run without simulation. Inspect capabilities and use read-only tools first; attempt an explicit allowlisted restart only after reviewing the normalized status and recommended action.
