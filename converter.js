// converter.js


function convertString(input) {
    return input
        .replace(
            /\[color=#([0-9a-fA-F]{6})\]([\s\S]*?)\[\/color\]/g,
            (_, hex, text) => `{col:${hex}}${text.trim()}{/col}`
        )
        .normalize("NFKC");
}


const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const copyButton = document.getElementById("copy");
const statusEl = document.getElementById("status");
const themeButton = document.getElementById("theme-toggle");

function setStatus(text) {
    statusEl.textContent = text;
}

function convert() {
    const input = inputEl.value;
    if (!input.trim()) {
        outputEl.value = "";
        return setStatus("Nothing to convert.");
    }

    const hasColorTags = /\[color=#([0-9a-fA-F]{6})\][\s\S]*?\[\/color\]/.test(input);
    if (!hasColorTags) {
        outputEl.value = "";
        return setStatus("No {color=#...} tags found.");
    }

    outputEl.value = convertString(input);
    setStatus("Converted.");
}

inputEl.addEventListener("input", convert);

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
    }

    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
}

copyButton.addEventListener("click", async () => {
    if (!outputEl.value) return setStatus("Nothing to copy yet.");
    const ok = await copyText(outputEl.value);
    setStatus(ok ? "Copied to clipboard." : "Copy failed \u2014 select the text manually.");
    if (ok) flashCopyButton();
});

let copyFlashTimer = null;
function flashCopyButton() {
    copyButton.textContent = "Copied!";
    clearTimeout(copyFlashTimer);
    copyFlashTimer = setTimeout(() => { copyButton.textContent = "Copy"; }, 1200);
}

themeButton.addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    themeButton.textContent = next === "light" ? "Dark Mode" : "Light Mode";
});
