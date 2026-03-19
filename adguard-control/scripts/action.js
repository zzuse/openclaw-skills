#!/usr/bin/env node

const http = require('http'); // using http since target is http

// --- Config ---
const ADGUARD_BASE_URL = process.env.ADGUARD_BASE_URL;
const ADGUARD_AUTH = process.env.ADGUARD_AUTH;
const ENDPOINT_SERVICES = "/control/blocked_services/update";

if (!ADGUARD_BASE_URL || !ADGUARD_AUTH) {
    console.error('Error: ADGUARD_BASE_URL and ADGUARD_AUTH must be set in the environment.');
    process.exit(1);
}

// --- AI Rule Config ---
const AI_RULE_NAME = "AI";
const AI_RULE_URL = "https://raw.githubusercontent.com/zzuse/adguard_home_rule/refs/heads/main/block_ai.txt";
const ENDPOINT_AI = "/control/filtering/set_url";

// --- Default Block List ---
const BLOCKED_SERVICE_IDS_DEFAULT = [
    "4chan", "500px", "9gag", "activision_blizzard", "aliexpress", "amazon", "amino",
    "battle_net", "betano", "betfair", "betway", "bigo_live", "bilibili", "blaze",
    "blizzard_entertainment", "bluesky", "box", "canais_globo", "claro", "cloudflare",
    "clubhouse", "coolapk", "crunchyroll", "dailymotion", "deezer", "directvgo",
    "discoveryplus", "disneyplus", "douban", "dropbox", "ebay", "electronic_arts",
    "epic_games", "espn", "facebook", "fifa", "flickr", "globoplay", "gog", "hbomax",
    "hulu", "icloud_private_relay", "iheartradio", "imgur", "instagram", "iqiyi",
    "kakaotalk", "kik", "kook", "lazada", "leagueoflegends", "line", "linkedin",
    "lionsgateplus", "looke", "mail_ru", "mastodon", "mercado_libre", "nebula",
    "netflix", "nintendo", "nvidia", "ok", "olvid", "onlyfans", "origin",
    "paramountplus", "peacock_tv", "pinterest", "playstation", "plenty_of_fish",
    "plex", "pluto_tv", "privacy", "qq", "rakuten_viki", "rockstar_games",
    "samsung_tv_plus", "shein", "shopee", "signal", "slack", "soundcloud", "spotify",
    "telegram", "temu", "tidal", "tiktok", "tinder", "tumblr", "twitter", "ubisoft",
    "viber", "vimeo", "vk", "voot", "wargaming", "wechat", "weibo", "whatsapp",
    "wizz", "xiaohongshu", "yy", "reddit", "riot_games", "valorant", "amazon_streaming",
    "zhihu", "twitch"
];

const BLOCKED_SERVICE_IDS_GAME = [
    "xboxlive", "minecraft", "steam", "apple_streaming", "snapchat",
    "discord", "youtube", "roblox"
];

// --- Parse Args ---
const actionArg = process.argv[2]; 
if (!actionArg) {
    console.error('Usage:\n  ./action.js [block|unblock|close|open] "service..."\n  ./action.js games [block|unblock|close|open]\n  ./action.js ai [block|unblock|close|open]');
    process.exit(1);
}

let payloadObj = null;
let finalEndpoint = ENDPOINT_SERVICES;
let finalMethod = 'PUT';
let logMsg = "";

// Normalize action name
const action = actionArg.toLowerCase();

if (action === 'ai') {
    const subActionArg = process.argv[3];
    if (!subActionArg) {
        console.error('Usage: ./action.js ai [block|unblock|close|open]');
        process.exit(1);
    }
    const subAction = subActionArg.toLowerCase();
    const enabled = (subAction === 'block' || subAction === 'close');
    payloadObj = {
        url: AI_RULE_URL,
        data: { name: AI_RULE_NAME, url: AI_RULE_URL, enabled: enabled },
        whitelist: false
    };
    finalEndpoint = ENDPOINT_AI;
    finalMethod = 'POST';
    logMsg = `Setting AI block rule enabled=${enabled}...`;

} else if (action === 'games') {
    const subActionArg = process.argv[3];
    if (!subActionArg) {
        console.error('Usage: ./action.js games [block|unblock|close|open]');
        process.exit(1);
    }
    const subAction = subActionArg.toLowerCase();
    const isBlocking = (subAction === 'block' || subAction === 'close');
    
    let targetServices = BLOCKED_SERVICE_IDS_GAME;
    let finalSet = new Set(BLOCKED_SERVICE_IDS_DEFAULT);
    targetServices.forEach(svc => {
        if (isBlocking) finalSet.add(svc);
        else finalSet.delete(svc);
    });

    const finalArray = Array.from(finalSet);
    payloadObj = {
        ids: finalArray,
        schedule: { time_zone: "UTC" }
    };
    logMsg = `Sending ${isBlocking ? 'block' : 'unblock'} for [GAMES]... Total blocked: ${finalArray.length}`;

} else if (action === 'block' || action === 'close' || action === 'unblock' || action === 'open') {
    const isBlocking = (action === 'block' || action === 'close');
    const servicesArg = process.argv.slice(3);
    let targetServices = [];
    servicesArg.forEach(arg => {
        const items = arg.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
        targetServices.push(...items);
    });

    let finalSet = new Set(BLOCKED_SERVICE_IDS_DEFAULT);
    targetServices.forEach(svc => {
        if (isBlocking) finalSet.add(svc);
        else finalSet.delete(svc);
    });

    const finalArray = Array.from(finalSet);
    payloadObj = {
        ids: finalArray,
        schedule: { time_zone: "UTC" }
    };
    logMsg = `Sending ${isBlocking ? 'block' : 'unblock'} for [${targetServices.join(', ')}]... Total blocked: ${finalArray.length}`;

} else {
    console.error(`Unknown action: ${action}`);
    process.exit(1);
}

// --- Send Request ---
const payload = JSON.stringify(payloadObj);
const url = new URL(ADGUARD_BASE_URL + finalEndpoint);
const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: finalMethod,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(ADGUARD_AUTH).toString('base64'),
        'Content-Length': Buffer.byteLength(payload)
    }
};

console.log(logMsg);

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('Success!');
        } else {
            console.error(`Error: ${res.statusCode} ${res.statusMessage}`);
            console.error(data);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
    process.exit(1);
});

req.write(payload);
req.end();
