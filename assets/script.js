(function () {
  "use strict";

  /**
   * CONFIGURATION
   * -------------
   * You can customise helpers, factories and upgrades by editing
   * the PRODUCERS and UPGRADES arrays below.
   */

  const PRODUCERS = [
    {
      id: "assistant_elf",
      name: "Assistant Elf",
      description: "Anxious elf who clicks for you once per second.",
      flavor: "HR insists they are \"volunteers\".",
      type: "assistant",
      baseCost: 15,
      costMultiplier: 1.15,
      basePps: 1,
      unlockAtPresents: 0
    },
    {
      id: "small_workshop",
      name: "Small Workshop",
      description: "A cozy workshop with questionable fire exits.",
      flavor: "Smells like cocoa and industrial solvent.",
      type: "factory",
      baseCost: 100,
      costMultiplier: 1.15,
      basePps: 5,
      unlockAtPresents: 50
    },
    {
      id: "assembly_line",
      name: "Automated Assembly Line",
      description: "Robots lovingly tighten bow #2,471,334.",
      flavor: "The safety manual is just the word \"Don’t\".",
      type: "factory",
      baseCost: 1000,
      costMultiplier: 1.17,
      basePps: 25,
      unlockAtPresents: 400
    },
    {
      id: "offshore_sweatshop",
      name: "Offshore Sweatshop",
      description: "The clouds outside are mostly exhaust.",
      flavor: "Santa calls it \"remote working\".",
      type: "factory",
      baseCost: 15000,
      costMultiplier: 1.18,
      basePps: 150,
      unlockAtPresents: 5000
    },
    {
      id: "interdimensional_warehouse",
      name: "Interdimensional Fulfillment Center",
      description: "Packages ship before they are ordered.",
      flavor: "Time zones are more of a suggestion.",
      type: "factory",
      baseCost: 250000,
      costMultiplier: 1.2,
      basePps: 2000,
      unlockAtPresents: 100000
    },
    {
      id: "ritual_circle",
      name: "Ritual Circle",
      description: "You do not remember this from Elf School.",
      flavor: "Produces gifts and an uneasy humming noise.",
      type: "ritual",
      baseCost: 5000000,
      costMultiplier: 1.25,
      basePps: 100000,
      unlockAtPps: 1000000,
      requiresFlag: "dyslexiaUnlocked"
    },
    {
      id: "abandoned_mall_ritual",
      name: "Abandoned Mall Summoning",
      description: "The food court chants in perfect harmony.",
      flavor: "Ho ho ho becomes something else entirely.",
      type: "ritual",
      baseCost: 50000000,
      costMultiplier: 1.3,
      basePps: 1000000,
      unlockAtPps: 2000000,
      requiresFlag: "dyslexiaUnlocked"
    }
  ];

  const UPGRADES = [
    {
      id: "better_gloves",
      name: "Padded Mittens",
      description: "Clicking hurts less. Doubles presents per click.",
      cost: 50,
      effect: { type: "ppcMultiplier", value: 2 },
      unlock: { totalPresents: 20 }
    },
    {
      id: "carpal_tunnel",
      name: "Questionable Ergonomics",
      description: "You lean in. +1 present per click.",
      cost: 250,
      effect: { type: "ppcAdd", value: 1 },
      unlock: { totalPresents: 150 }
    },
    {
      id: "industrial_gloves",
      name: "Industrial Strength Gloves",
      description: "Your fingers are basically tiny forklifts now. +3 per click.",
      cost: 2500,
      effect: { type: "ppcAdd", value: 3 },
      unlock: { totalPresents: 1500 }
    },
    {
      id: "elf_adrenaline",
      name: "Elf Adrenaline Shots",
      description: "You stop blinking for a bit. Click output x3.",
      cost: 15000,
      effect: { type: "ppcMultiplier", value: 3 },
      unlock: { totalPresents: 10000 }
    },
    {
      id: "phantom_clicks",
      name: "Phantom Clicks",
      description: "You swear you're still clicking even when you’re not. +10 per click.",
      cost: 90000,
      effect: { type: "ppcAdd", value: 10 },
      unlock: { totalPresents: 60000 }
    },
    {
      id: "quantum_pointer",
      name: "Quantum Pointer Device",
      description: "Each click happens in several timelines. Click output x4.",
      cost: 750000,
      effect: { type: "ppcMultiplier", value: 4 },
      unlock: { totalPresents: 400000 }
    },
    {
      id: "saint_nick_knuckles",
      name: "Saint Nick’s Knuckles",
      description: "Your hand is now a festive blunt instrument. +50 per click.",
      cost: 3500000,
      effect: { type: "ppcAdd", value: 50 },
      unlock: { totalPresents: 2000000 }
    },
    {
      id: "chromatic_reindeer_energy",
      name: "Chromatic Reindeer Energy Drink",
      description: "Illegally caffeinated. Click output x5.",
      cost: 25000000,
      effect: { type: "ppcMultiplier", value: 5 },
      unlock: { totalPresents: 15000000 }
    },
    {
      id: "assistant_whip",
      name: "Ergonomic Whips",
      description: "Assistants work twice as fast.",
      cost: 200,
      effect: { type: "typeMultiplier", targetType: "assistant", value: 2 },
      unlock: { totalPresents: 100 }
    },
    {
      id: "overtime",
      name: "Mandatory Overtime",
      description: "Factories run hotter. Factory output x2.",
      cost: 5000,
      effect: { type: "typeMultiplier", targetType: "factory", value: 2 },
      unlock: { totalPresents: 2000 }
    },
    {
      id: "time_dilation",
      name: "North Pole Time Dilation",
      description: "Hours stretch. Global output x2.",
      cost: 100000,
      effect: { type: "globalMultiplier", value: 2 },
      unlock: { totalPresents: 50000 }
    },
    {
      id: "dyslexia",
      name: "Dyslexia: ???",
      description: "You misread \"Santa\" as \"Satan\" and keep reading.",
      cost: 40000000,
      effect: { type: "setFlag", flag: "dyslexiaUnlocked", value: true },
      unlock: { pps: 1000000 }
    }
  ];

  const state = {
    presents: 0,
    totalPresents: 0,
    presentsPerClick: 1,
    presentsPerSecond: 0,
    producersOwned: {},
    multipliers: {
      global: 1,
      byType: {},
      byId: {}
    },
    purchasedUpgrades: new Set(),
    flags: {
      dyslexiaUnlocked: false
    }
  };

  const producerById = {};
  PRODUCERS.forEach(function (p) {
    producerById[p.id] = p;
    if (!state.multipliers.byType[p.type]) {
      state.multipliers.byType[p.type] = 1;
    }
    state.producersOwned[p.id] = 0;
  });

  const upgradeById = {};
  UPGRADES.forEach(function (u) {
    upgradeById[u.id] = u;
  });

  const presentCountEl = document.getElementById("present-count");
  const ppsCountEl = document.getElementById("pps-count");
  const ppcCountEl = document.getElementById("ppc-count");
  const presentButton = document.getElementById("present-button");
  const producersListEl = document.getElementById("producers-list");
  const upgradesListEl = document.getElementById("upgrades-list");
  const logListEl = document.getElementById("log");

  if (!presentButton || !presentCountEl || !ppsCountEl || !ppcCountEl) {
    return;
  }

  const producerViews = new Map();
  const upgradeViews = new Map();
  const recentMessages = [];

  function formatNumber(value) {
    if (!isFinite(value)) return "∞";
    if (value < 1000) return value.toFixed(0);

    var units = ["K", "M", "B", "T", "Qa", "Qi"];
    var unitIndex = -1;
    var v = value;

    while (v >= 1000 && unitIndex < units.length - 1) {
      v /= 1000;
      unitIndex += 1;
    }

    var decimals;
    if (v < 10) decimals = 2;
    else if (v < 100) decimals = 1;
    else decimals = 0;

    return v.toFixed(decimals) + units[unitIndex];
  }

  function addLog(message) {
    recentMessages.unshift(message);
    if (recentMessages.length > 6) {
      recentMessages.pop();
    }

    if (!logListEl) return;

    logListEl.innerHTML = "";
    recentMessages.forEach(function (msg) {
      var li = document.createElement("li");
      li.textContent = msg;
      logListEl.appendChild(li);
    });
  }

  function getProducerCost(producer) {
    var owned = state.producersOwned[producer.id] || 0;
    var cost = producer.baseCost * Math.pow(producer.costMultiplier, owned);
    return Math.ceil(cost);
  }

  function getMultiplierForProducer(producer) {
    var byType = state.multipliers.byType[producer.type] || 1;
    var byId = state.multipliers.byId[producer.id] || 1;
    return state.multipliers.global * byType * byId;
  }

  function recalcPps() {
    var total = 0;

    PRODUCERS.forEach(function (producer) {
      var owned = state.producersOwned[producer.id] || 0;
      if (!owned) return;

      var unitPps = producer.basePps * getMultiplierForProducer(producer);
      total += unitPps * owned;
    });

    state.presentsPerSecond = total;
  }

  function isProducerUnlocked(producer) {
    if (typeof producer.unlockAtPresents === "number" &&
        state.totalPresents < producer.unlockAtPresents) {
      return false;
    }

    if (typeof producer.unlockAtPps === "number" &&
        state.presentsPerSecond < producer.unlockAtPps) {
      return false;
    }

    if (producer.requiresFlag && !state.flags[producer.requiresFlag]) {
      return false;
    }

    return true;
  }

  function isUpgradeUnlocked(upgrade) {
    if (state.purchasedUpgrades.has(upgrade.id)) return false;

    var unlock = upgrade.unlock || {};
    if (typeof unlock.totalPresents === "number" &&
        state.totalPresents < unlock.totalPresents) {
      return false;
    }
    if (typeof unlock.pps === "number" &&
        state.presentsPerSecond < unlock.pps) {
      return false;
    }

    return true;
  }

  function updateStatsUI() {
    presentCountEl.textContent = formatNumber(Math.floor(state.presents));
    ppsCountEl.textContent = formatNumber(state.presentsPerSecond);
    ppcCountEl.textContent = formatNumber(state.presentsPerClick);
  }

  function updateProducersUI() {
    PRODUCERS.forEach(function (producer) {
      var view = producerViews.get(producer.id);
      if (!view) return;

      var unlocked = isProducerUnlocked(producer);
      view.card.style.display = unlocked ? "" : "none";

      if (!unlocked) return;

      var cost = getProducerCost(producer);
      var owned = state.producersOwned[producer.id] || 0;
      var unitPps = producer.basePps * getMultiplierForProducer(producer);

      view.costEl.textContent = "Cost: " + formatNumber(cost) + " 🎁";
      view.countEl.textContent = "Owned: " + owned;
      view.ppsEl.textContent = "+" + formatNumber(unitPps) + "/sec each";

      view.card.disabled = state.presents < cost;
    });
  }

  function updateUpgradesUI() {
    UPGRADES.forEach(function (upgrade) {
      var view = upgradeViews.get(upgrade.id);
      if (!view) return;

      var unlocked = isUpgradeUnlocked(upgrade);
      view.card.style.display = unlocked ? "" : "none";

      if (!unlocked) return;

      view.costEl.textContent = "Cost: " + formatNumber(upgrade.cost) + " 🎁";
      view.card.disabled = state.presents < upgrade.cost;
    });
  }

  function applyUpgradeEffect(upgrade) {
    var effect = upgrade.effect;

    if (!effect || !effect.type) return;

    if (effect.type === "ppcMultiplier") {
      state.presentsPerClick *= effect.value;
    } else if (effect.type === "ppcAdd") {
      state.presentsPerClick += effect.value;
    } else if (effect.type === "typeMultiplier") {
      var current = state.multipliers.byType[effect.targetType] || 1;
      state.multipliers.byType[effect.targetType] = current * effect.value;
    } else if (effect.type === "producerMultiplier") {
      var currentIdMulti = state.multipliers.byId[effect.targetId] || 1;
      state.multipliers.byId[effect.targetId] = currentIdMulti * effect.value;
    } else if (effect.type === "globalMultiplier") {
      state.multipliers.global *= effect.value;
    } else if (effect.type === "setFlag") {
      state.flags[effect.flag] = effect.value;
      if (effect.flag === "dyslexiaUnlocked" && effect.value === true) {
        addLog("You stare at the word 'Santa' for too long. Something looks wrong.");
        addLog("The workshop lights flicker. New procurement options whisper into existence.");
      }
    }

    recalcPps();
  }

  function spendPresents(amount) {
    state.presents -= amount;
    if (state.presents < 0) state.presents = 0;
  }

  function earnPresents(amount) {
    state.presents += amount;
    state.totalPresents += amount;
  }

  function buyProducer(id) {
    var producer = producerById[id];
    if (!producer) return;
    if (!isProducerUnlocked(producer)) return;

    var cost = getProducerCost(producer);
    if (state.presents < cost) return;

    spendPresents(cost);
    state.producersOwned[id] = (state.producersOwned[id] || 0) + 1;

    if (id === "assistant_elf" && state.producersOwned[id] === 1) {
      addLog("You hire your first Assistant Elf. They look both eager and terrified.");
    }

    recalcPps();
    updateStatsUI();
    updateProducersUI();
    updateUpgradesUI();
  }

  function buyUpgrade(id) {
    if (state.purchasedUpgrades.has(id)) return;

    var upgrade = upgradeById[id];
    if (!upgrade) return;
    if (!isUpgradeUnlocked(upgrade)) return;
    if (state.presents < upgrade.cost) return;

    spendPresents(upgrade.cost);
    state.purchasedUpgrades.add(id);

    applyUpgradeEffect(upgrade);

    addLog(upgrade.name + " acquired.");
    updateStatsUI();
    updateProducersUI();
    updateUpgradesUI();
  }

  function initProducersUI() {
    if (!producersListEl) return;

    PRODUCERS.forEach(function (producer) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "shop-card";
      card.style.display = "none";

      if (producer.type === "ritual") {
        card.classList.add("shop-card--ritual");
      }

      var top = document.createElement("div");
      top.className = "shop-card-top";

      var left = document.createElement("div");

      var nameEl = document.createElement("div");
      nameEl.className = "shop-card-name";
      nameEl.textContent = producer.name;

      var descEl = document.createElement("div");
      descEl.className = "shop-card-desc";
      descEl.textContent = producer.description;

      left.appendChild(nameEl);
      left.appendChild(descEl);

      var countEl = document.createElement("div");
      countEl.className = "shop-card-count";
      countEl.textContent = "Owned: 0";

      top.appendChild(left);
      top.appendChild(countEl);

      var bottom = document.createElement("div");
      bottom.className = "shop-card-bottom";

      var meta = document.createElement("div");
      meta.className = "shop-card-meta";

      var costEl = document.createElement("span");
      costEl.className = "shop-card-cost";

      var ppsEl = document.createElement("span");
      ppsEl.className = "shop-card-pps";

      meta.appendChild(costEl);
      meta.appendChild(ppsEl);

      var flavorEl = document.createElement("div");
      flavorEl.className = "shop-card-flavor";
      flavorEl.textContent = producer.flavor || "";

      bottom.appendChild(meta);
      bottom.appendChild(flavorEl);

      card.appendChild(top);
      card.appendChild(bottom);

      card.addEventListener("click", function () {
        buyProducer(producer.id);
      });

      producersListEl.appendChild(card);

      producerViews.set(producer.id, {
        card: card,
        costEl: costEl,
        countEl: countEl,
        ppsEl: ppsEl
      });
    });
  }

  function initUpgradesUI() {
    if (!upgradesListEl) return;

    UPGRADES.forEach(function (upgrade) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "shop-card shop-card--upgrade";
      card.style.display = "none";

      var top = document.createElement("div");
      top.className = "shop-card-top";

      var left = document.createElement("div");
      var nameEl = document.createElement("div");
      nameEl.className = "shop-card-name";
      nameEl.textContent = upgrade.name;

      var descEl = document.createElement("div");
      descEl.className = "shop-card-desc";
      descEl.textContent = upgrade.description;

      left.appendChild(nameEl);
      left.appendChild(descEl);

      top.appendChild(left);

      var bottom = document.createElement("div");
      bottom.className = "shop-card-bottom";

      var meta = document.createElement("div");
      meta.className = "shop-card-meta";

      var costEl = document.createElement("span");
      costEl.className = "shop-card-cost";

      meta.appendChild(costEl);
      bottom.appendChild(meta);

      card.appendChild(top);
      card.appendChild(bottom);

      card.addEventListener("click", function () {
        buyUpgrade(upgrade.id);
      });

      upgradesListEl.appendChild(card);

      upgradeViews.set(upgrade.id, {
        card: card,
        costEl: costEl
      });
    });
  }

  function registerClick() {
    earnPresents(state.presentsPerClick);
    updateStatsUI();
    updateProducersUI();
    updateUpgradesUI();
  }

  function attachEvents() {
    presentButton.addEventListener("click", function () {
      presentButton.classList.add("present-button--clicked");
      registerClick();
      window.setTimeout(function () {
        presentButton.classList.remove("present-button--clicked");
      }, 70);
    });
  }

  function gameLoop() {
    var lastTick = performance.now();

    window.setInterval(function () {
      var now = performance.now();
      var deltaSeconds = (now - lastTick) / 1000;
      lastTick = now;

      if (state.presentsPerSecond > 0) {
        var gained = state.presentsPerSecond * deltaSeconds;
        earnPresents(gained);
      }

      updateStatsUI();
      updateProducersUI();
      updateUpgradesUI();
    }, 100);
  }

  function init() {
    addLog("You clock in at the workshop. The night stretches ahead.");
    addLog("Santa slides a spreadsheet across the table.");
    addLog("\"Just hit the target,\" he says. \"Whatever it takes.\"");

    initProducersUI();
    initUpgradesUI();
    recalcPps();
    updateStatsUI();
    updateProducersUI();
    updateUpgradesUI();
    attachEvents();
    gameLoop();
  }

  init();
})();