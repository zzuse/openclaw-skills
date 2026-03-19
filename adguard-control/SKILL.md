---
name: adguard-control
description: Update AdGuard blocked services (block/unblock) using a default list.
---

# AdGuard Control Skill

When the user asks to "block" or "unblock" (or "close" or "open") services on AdGuard, run the `scripts/action.js` script.

The script maintains a hardcoded DEFAULT list of blocked services.

Usage:
`./skills/adguard-control/scripts/action.js [block|unblock|close|open] "service1 service2..."`
`./skills/adguard-control/scripts/action.js games [block|unblock|close|open]`
`./skills/adguard-control/scripts/action.js ai [block|unblock|close|open]`

Examples:
- "Block youtube": `./skills/adguard-control/scripts/action.js block youtube`
- "Open youtube": `./skills/adguard-control/scripts/action.js unblock youtube`
- "Close games": `./skills/adguard-control/scripts/action.js games block`
- "Open games": `./skills/adguard-control/scripts/action.js games unblock`
- "Close AI": `./skills/adguard-control/scripts/action.js ai block`
- "Open AI": `./skills/adguard-control/scripts/action.js ai unblock`
