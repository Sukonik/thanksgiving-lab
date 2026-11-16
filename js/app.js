import { fetchThanksgivingWeather, weatherForDate } from "./weather.js";

const STORAGE_KEY = "thanksgiving-lab:v1";
const THEME_KEY = "thanksgiving-lab:theme";
const MAX_PACKET_CHARS = 2 * 1024 * 1024;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let weatherCache = null;
let saveTimer;
let toastTimer;

function randomId(prefix) {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return `${prefix}_${[...bytes].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

function nextThanksgiving() {
  const now = new Date();
  let year = now.getFullYear();
  const holiday = y => {
    const first = new Date(y, 10, 1);
    const firstThursday = 1 + ((4 - first.getDay() + 7) % 7);
    return new Date(y, 10, firstThursday + 21, 16, 0, 0);
  };
  let date = holiday(year);
  if (date.getTime() < now.getTime()) date = holiday(++year);
  const pad = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function newPlan() {
  const now = new Date().toISOString();
  return {
    format:"thanksgiving-lab-packet", schemaVersion:1, planId:randomId("plan"), revisionId:randomId("rev"),
    createdAt:now, savedAt:now, name:"My Thanksgiving", dinnerAt:nextThanksgiving(), location:"",
    groceries:[], menu:[], guests:0, overnights:0, dinners:1, casualMeals:2,
    guestNotes:"", stayNotes:"", restNotes:"", transportNotes:"", hostNotes:""
  };
}

function text(value, max = 10000) {
  return typeof value === "string" ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, " ").slice(0, max) : "";
}

function boundedNumber(value, max = 200) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.round(n))) : 0;
}

function cleanPlan(raw) {
  if (!raw || raw.format !== "thanksgiving-lab-packet" || raw.schemaVersion !== 1) throw new Error("This is not a Thanksgiving Lab V1 packet.");
  const cleanList = (items, type) => (Array.isArray(items) ? items : []).slice(0, 500).map(item => ({
    id:/^(item|dish)_[a-f0-9]{8,40}$/.test(item?.id || "") ? item.id : randomId(type === "grocery" ? "item" : "dish"),
    name:text(item?.name, 80),
    ...(type === "grocery" ? { done:Boolean(item?.done) } : { course:["Main","Side","Starter","Dessert","Drink","Breakfast"].includes(item?.course) ? item.course : "Side" })
  })).filter(item => item.name);
  return {
    format:"thanksgiving-lab-packet", schemaVersion:1,
    planId:/^plan_[a-f0-9]{8,40}$/.test(raw.planId || "") ? raw.planId : randomId("plan"),
    revisionId:/^rev_[a-f0-9]{8,40}$/.test(raw.revisionId || "") ? raw.revisionId : randomId("rev"),
    createdAt:text(raw.createdAt, 40) || new Date().toISOString(), savedAt:text(raw.savedAt, 40) || new Date().toISOString(),
    name:text(raw.name, 80) || "My Thanksgiving", dinnerAt:text(raw.dinnerAt, 30) || nextThanksgiving(), location:text(raw.location, 100),
    groceries:cleanList(raw.groceries, "grocery"), menu:cleanList(raw.menu, "menu"),
    guests:boundedNumber(raw.guests), overnights:boundedNumber(raw.overnights), dinners:boundedNumber(raw.dinners, 20), casualMeals:boundedNumber(raw.casualMeals, 20),
    guestNotes:text(raw.guestNotes), stayNotes:text(raw.stayNotes), restNotes:text(raw.restNotes), transportNotes:text(raw.transportNotes), hostNotes:text(raw.hostNotes)
  };
}

function loadPlan() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? cleanPlan(JSON.parse(stored)) : newPlan();
  } catch (_) { return newPlan(); }
}

let plan = loadPlan();

function persist({ quiet = false } = {}) {
  plan.savedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    $("#saveState").innerHTML = "<span></span>Saved on this device";
  } catch (_) {
    $("#saveState").textContent = "Device storage unavailable. Save a packet instead.";
  }
  renderStats();
  renderPreview();
  if (!quiet) showToast("Saved on this device");
}

function queuePersist() {
  clearTimeout(saveTimer);
  $("#saveState").innerHTML = "<span></span>Saving…";
  renderStats();
  renderPreview();
  saveTimer = setTimeout(() => persist({ quiet:true }), 250);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function setView(name) {
  if (!$( `[data-view="${name}"]` )) return;
  $$("[data-view]").forEach(view => view.classList.toggle("is-active", view.dataset.view === name));
  $$("[data-view-link]").forEach(link => link.classList.toggle("is-active", link.dataset.viewLink === name));
  closeDrawer();
  window.scrollTo({ top:0, behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  history.replaceState(null, "", `#${name}`);
  if (name === "notes") renderPreview();
}

function openDrawer() {
  $("#drawer").classList.add("open"); $("#scrim").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false"); $("#menuOpen").setAttribute("aria-expanded", "true");
  document.body.classList.add("lock"); $("#menuClose").focus();
}
function closeDrawer() {
  $("#drawer").classList.remove("open"); $("#scrim").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true"); $("#menuOpen").setAttribute("aria-expanded", "false"); document.body.classList.remove("lock");
}

function renderLists() {
  const groceryList = $("#groceryList"); groceryList.replaceChildren();
  plan.groceries.forEach(item => {
    const li = document.createElement("li"); li.classList.toggle("done", item.done);
    const check = document.createElement("input"); check.type = "checkbox"; check.checked = item.done; check.setAttribute("aria-label", `Mark ${item.name} purchased`);
    check.addEventListener("change", () => { item.done = check.checked; renderLists(); persist({ quiet:true }); });
    const name = document.createElement("span"); name.className = "item-text"; name.textContent = item.name;
    const remove = document.createElement("button"); remove.className = "delete-btn"; remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", `Remove ${item.name}`);
    remove.addEventListener("click", () => { plan.groceries = plan.groceries.filter(row => row.id !== item.id); renderLists(); persist({ quiet:true }); });
    li.append(check, name, remove); groceryList.append(li);
  });
  $("#groceryEmpty").hidden = plan.groceries.length > 0;
  const open = plan.groceries.filter(item => !item.done).length;
  $("#groceryPill").textContent = `${open} open`;

  const menuList = $("#menuList"); menuList.replaceChildren();
  plan.menu.forEach(item => {
    const li = document.createElement("li");
    const tag = document.createElement("span"); tag.className = "item-tag"; tag.textContent = item.course;
    const name = document.createElement("span"); name.className = "item-text"; name.textContent = item.name;
    const remove = document.createElement("button"); remove.className = "delete-btn"; remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", `Remove ${item.name}`);
    remove.addEventListener("click", () => { plan.menu = plan.menu.filter(row => row.id !== item.id); renderLists(); persist({ quiet:true }); });
    li.append(tag, name, remove); menuList.append(li);
  });
  $("#menuEmpty").hidden = plan.menu.length > 0;
  $("#menuPill").textContent = `${plan.menu.length} ${plan.menu.length === 1 ? "dish" : "dishes"}`;
  renderStats(); renderPreview();
}

function renderStats() {
  const done = plan.groceries.filter(item => item.done).length;
  $("#groceryStat").textContent = `${done} / ${plan.groceries.length}`;
  $("#menuStat").textContent = plan.menu.length;
  $("#guestStat").textContent = plan.guests;
  $("#stayStat").textContent = plan.overnights;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

function formatDinner() {
  if (!plan.dinnerAt) return "Dinner time not set";
  const date = new Date(plan.dinnerAt);
  return Number.isNaN(date.getTime()) ? "Dinner time not set" : date.toLocaleString([], { weekday:"long", month:"long", day:"numeric", hour:"numeric", minute:"2-digit" });
}

function renderPreview() {
  const groceries = plan.groceries.filter(item => !item.done).slice(0, 12);
  const menu = plan.menu.slice(0, 12);
  const note = escapeHtml(plan.hostNotes).replace(/\n/g, "<br>") || "No additional host notes yet.";
  $("#paperPreview").innerHTML = `
    <div class="paper-meta"><span>THANKSGIVING LAB / QUICK NOTES</span><span>${escapeHtml(new Date().toLocaleDateString())}</span></div>
    <h2>${escapeHtml(plan.name)}</h2><p>${escapeHtml(formatDinner())}${plan.location ? ` · ${escapeHtml(plan.location)}` : ""}</p>
    <h3>Table</h3><p>${plan.guests} guests · ${plan.overnights} overnight · ${plan.dinners} sit-down dinner${plan.dinners === 1 ? "" : "s"}</p>
    <h3>Menu</h3>${menu.length ? `<ul>${menu.map(item => `<li>${escapeHtml(item.course)}: ${escapeHtml(item.name)}</li>`).join("")}</ul>` : "<p>No dishes added yet.</p>"}
    <h3>Still to buy</h3>${groceries.length ? `<ul>${groceries.map(item => `<li>${escapeHtml(item.name)}</li>`).join("")}</ul>` : "<p>Nothing open on the grocery list.</p>"}
    <h3>Host notes</h3><p>${note}</p>`;
}

function updateCountdown() {
  const target = new Date(plan.dinnerAt).getTime();
  const el = $("#countdown");
  if (!Number.isFinite(target)) { el.textContent = "Set your dinner time"; return; }
  const diff = target - Date.now();
  if (diff <= 0) { el.textContent = "Dinner time"; return; }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  el.textContent = days > 0 ? `${days}d ${hours}h to go` : `${hours}h ${mins}m to go`;
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

async function savePacket() {
  plan.revisionId = randomId("rev"); plan.savedAt = new Date().toISOString(); persist({ quiet:true });
  const body = cleanPlan(plan);
  const packet = { ...body, checksum:{ alg:"sha-256", value:await sha256(JSON.stringify(body)) } };
  const blob = new Blob([JSON.stringify(packet, null, 2) + "\n"], { type:"application/json" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob);
  const date = plan.savedAt.slice(0,10).replaceAll("-", "");
  link.download = `thanksgiving-${date}-${plan.revisionId.slice(4,10)}.thanks`; link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000); showToast("Thanksgiving packet saved");
}

async function openPacket(file) {
  if (!file) return;
  if (file.size > MAX_PACKET_CHARS) { showToast("That packet is too large"); return; }
  try {
    const rawText = await file.text();
    const raw = JSON.parse(rawText);
    if (raw.checksum?.alg === "sha-256") {
      const { checksum, ...body } = raw;
      if (await sha256(JSON.stringify(body)) !== checksum.value) throw new Error("The packet checksum does not match. The file may have changed.");
    }
    const incoming = cleanPlan(raw);
    if (!confirm(`Open “${incoming.name}”? Your current device copy will be kept until you confirm.`)) return;
    try { localStorage.setItem(`${STORAGE_KEY}:backup`, JSON.stringify(plan)); } catch (_) {}
    plan = incoming; persist({ quiet:true }); fillInputs(); renderLists(); updateCountdown();
    if (plan.location) refreshWeather(plan.location); showToast("Packet opened with a device backup"); setView("dashboard");
  } catch (error) { showToast(error.message || "This packet could not be opened"); }
  $("#openPacket").value = "";
}

function fillInputs() {
  const values = { dinnerAt:plan.dinnerAt, location:plan.location, weatherLocation:plan.location, guests:plan.guests, overnights:plan.overnights, dinners:plan.dinners, casualMeals:plan.casualMeals, guestNotes:plan.guestNotes, stayNotes:plan.stayNotes, restNotes:plan.restNotes, transportNotes:plan.transportNotes, hostNotes:plan.hostNotes };
  Object.entries(values).forEach(([id, value]) => { const el = $(`#${id}`); if (el) el.value = value ?? ""; });
}

async function refreshWeather(place = plan.location) {
  const query = String(place || "").trim();
  if (!query) { showToast("Add a city or ZIP code first"); return; }
  $("#weatherTemp").textContent = "Loading…"; $("#weatherSource").textContent = "Resolving the location and requesting Open-Meteo…";
  try {
    weatherCache = await fetchThanksgivingWeather(query);
    plan.location = query; $("#location").value = query; $("#weatherLocation").value = query; queuePersist(); renderWeather();
  } catch (error) {
    $("#weatherTemp").textContent = "Weather"; $("#weatherSource").textContent = error.message;
    showToast(error.message);
  }
}

function renderWeather() {
  if (!weatherCache) return;
  const current = weatherCache.current;
  $("#weatherIcon").textContent = current.icon; $("#weatherTemp").textContent = `${current.temp}°`;
  const dinnerDay = weatherForDate(weatherCache, plan.dinnerAt);
  const target = dinnerDay || weatherCache.days[0];
  $("#miniWeather").innerHTML = `<span>${escapeHtml(target.icon)}</span><div><b>${escapeHtml(weatherCache.place)}</b><small>${escapeHtml(target.label)} · ${target.high}° / ${target.low}° · ${target.rain}% rain</small></div>`;
  $("#weatherCurrent").innerHTML = `<div class="weather-big-icon">${escapeHtml(current.icon)}</div><div><p class="eyebrow">Now · ${escapeHtml(weatherCache.place)}</p><strong>${current.temp}°</strong><p>${escapeHtml(current.label)} · Feels ${current.feels}° · Wind ${current.wind} mph</p></div>`;
  const days = weatherCache.days.slice(0, 4);
  $("#weatherDays").innerHTML = days.map(day => `<article class="panel weather-day"><p class="eyebrow">${escapeHtml(new Date(`${day.date}T12:00`).toLocaleDateString([], { weekday:"short" }))}</p><div class="day-icon">${escapeHtml(day.icon)}</div><b>${day.high}° / ${day.low}°</b><small>${escapeHtml(day.label)}</small><small>${day.rain}% rain</small></article>`).join("");
  $("#weatherSource").textContent = `Open-Meteo · ${weatherCache.place} · Updated ${new Date(weatherCache.fetchedAt).toLocaleTimeString([], { hour:"numeric", minute:"2-digit" })}`;
}

function bind() {
  $$('[data-view-link]').forEach(link => link.addEventListener("click", () => setView(link.dataset.viewLink)));
  $("#menuOpen").addEventListener("click", openDrawer); $("#menuClose").addEventListener("click", closeDrawer); $("#scrim").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeDrawer(); });
  $$("[data-theme-choice]").forEach(button => button.addEventListener("click", () => {
    const theme = button.dataset.themeChoice; document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    $$("[data-theme-choice]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  }));
  const activeTheme = document.documentElement.dataset.theme;
  $$("[data-theme-choice]").forEach(item => item.setAttribute("aria-pressed", String(item.dataset.themeChoice === activeTheme)));

  $("#groceryForm").addEventListener("submit", event => { event.preventDefault(); const input = $("#groceryInput"); const name = text(input.value,80).trim(); if (!name) return; plan.groceries.push({ id:randomId("item"), name, done:false }); input.value = ""; renderLists(); persist({ quiet:true }); input.focus(); });
  $("#menuForm").addEventListener("submit", event => { event.preventDefault(); const input = $("#menuInput"); const name = text(input.value,80).trim(); if (!name) return; plan.menu.push({ id:randomId("dish"), name, course:$("#menuCourse").value }); input.value = ""; renderLists(); persist({ quiet:true }); input.focus(); });

  const fields = { dinnerAt:"dinnerAt", location:"location", guests:"guests", overnights:"overnights", dinners:"dinners", casualMeals:"casualMeals", guestNotes:"guestNotes", stayNotes:"stayNotes", restNotes:"restNotes", transportNotes:"transportNotes", hostNotes:"hostNotes" };
  Object.entries(fields).forEach(([id,key]) => {
    const el = $(`#${id}`); el.addEventListener("input", () => {
      plan[key] = el.type === "number" ? boundedNumber(el.value, key === "dinners" || key === "casualMeals" ? 20 : 200) : text(el.value, key === "location" ? 100 : 10000);
      if (key === "location") $("#weatherLocation").value = plan.location;
      if (key === "dinnerAt") updateCountdown(); queuePersist();
    });
  });
  $("#location").addEventListener("change", () => { if (plan.location) refreshWeather(plan.location); });
  $("#weatherRefresh").addEventListener("click", () => refreshWeather($("#weatherLocation").value));
  $("#weatherLocation").addEventListener("keydown", event => { if (event.key === "Enter") refreshWeather(event.target.value); });
  ["savePacket","savePacketInline","savePacketNotes"].forEach(id => $(`#${id}`).addEventListener("click", savePacket));
  $("#openPacket").addEventListener("change", event => openPacket(event.target.files?.[0]));
  ["printDashboard","printNotes"].forEach(id => $(`#${id}`).addEventListener("click", () => { setView("notes"); setTimeout(() => window.print(), 200); }));
}

fillInputs(); bind(); renderLists(); renderPreview(); updateCountdown();
setInterval(updateCountdown, 60000);
const initialView = location.hash.slice(1);
if (["dashboard","food","weekend","weather","notes"].includes(initialView)) setView(initialView);
if (plan.location) setTimeout(() => refreshWeather(plan.location), 300);
