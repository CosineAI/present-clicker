(function () {
  "use strict";

  /**
   * CONFIGURATION
   * -------------
   * Producers and upgrades are now defined in assets/config.js
   * and exposed via window.PRESENT_CLICKER_PRODUCERS / _UPGRADES.
   */
 
  const PRODUCERS = window.PRESENT_CLICKER_PRODUCERS || [];
  const UPGRADES = window.PRESENT_CLICKER_UPGRADES || [];

  const state = {
    presents: 0,
    totalPresents: 0,
    presentsPerClick: 1,
    presentsPerSecond: 0,
    producersOwned: {},
    // Per-producer upgrade levels (1 = base). Upgrades can go as high as you can afford.
    producerLevels: {},
    multipliers: {
      global: 1,
      byType: {},
      byId: {}
    },
    purchasedUpgrades: new Set(),
    flags: {
      dyslexiaUnlocked: false
    },
    devConsole: {
      element: null,
      visible: false
    }
  };

  const producerById = {};
  PRODUCERS.forEach(function (p) {
    producerById[p.id] = p;
    if (!state.multipliers.byType[p.type]) {
      state.multipliers.byType[p.type] = 1;
    }
    state.producersOwned[p.id] = 0;
    state.producerLevels[p.id] = 1;
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

    // Show full integers (with grouping) up to 1 quadrillion.
    if (Math.abs(value) < 1e15) {
      return Math.floor(value).toLocaleString("en-US");
    }

    // For truly enormous numbers, fall back to compact notation.
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

  function randomFrom(array) {
    if (!array || !array.length) return null;
    var index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  function logProducerPurchase(producer, ownedCount) {
    // Special case: first ever Assistant Elf keeps its narrative hook.
    if (producer.id === "assistant_elf" && ownedCount === 1) {
      addLog("You hire your first Assistant Elf. They look both eager and terrified.");
      return;
    }

    var pool = PRODUCER_FLAVOURS[producer.id];
    var msg = randomFrom(pool);
    if (!msg) {
      msg = "Another " + producer.name + " joins the production nightmare.";
    }
    addLog(msg);
  }

  function logUpgradePurchase(upgrade) {
    var pool = UPGRADE_FLAVOURS[upgrade.id];
    var msg = randomFrom(pool);
    if (!msg) {
      msg = "You tinker with the spreadsheets. \"" + upgrade.name + "\" takes effect.";
    }
    addLog(msg);
  }

  function maybeLogMorale(deltaSeconds) {
    moraleAccumulator += deltaSeconds;
    if (moraleAccumulator < 25) return; // wait at least 25s before considering

    // Only log morale if you actually have factories running.
    var hasFactory = false;
    for (var i = 0; i < PRODUCERS.length; i += 1) {
      var p = PRODUCERS[i];
      if (p.type === "factory" && (state.producersOwned[p.id] || 0) > 0) {
        hasFactory = true;
        break;
      }
    }
    if (!hasFactory) return;

    // Random chance, but guarantee something at least every ~60s once factories exist.
    var shouldLog = Math.random() < 0.3 || moraleAccumulator > 60;
    if (!shouldLog) return;

    var msg = randomFrom(MORALE_MESSAGES);
    if (msg) {
      addLog(msg);
    }

    moraleAccumulator = 0;
  });
  }

  function getProducerCost(producer) {
    var owned = state.producersOwned[producer.id] || 0;
    var cost = producer.baseCost * Math.pow(producer.costMultiplier, owned);
    return Math.ceil(cost);
  }

  function getProducerLevel(producerId) {
    return state.producerLevels[producerId] || 1;
  }

  // Upgrade cost scales with producer base cost and current level.
  // Current formula: baseCost * 5 * level^2
  function getProducerUpgradeCost(producer) {
    var level = getProducerLevel(producer.id);
    var cost = producer.baseCost * 5 * Math.pow(level, 2);
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

      var level = getProducerLevel(producer.id);
      var unitPps = producer.basePps * level * getMultiplierForProducer(producer);
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
      var level = getProducerLevel(producer.id);
      var unitPps = producer.basePps * level * getMultiplierForProducer(producer);
      var upgradeCost = getProducerUpgradeCost(producer);

      view.costEl.textContent = "Cost: " + formatNumber(cost) + " 🎁";
      view.countEl.textContent = "Owned: " + owned;
      view.ppsEl.textContent = "+" + formatNumber(unitPps) + "/sec each";

      view.levelEl.textContent = "Lvl " + level;
      view.upgradeCostEl.textContent = "Upgrade: " + formatNumber(upgradeCost) + " 🎁";

      view.card.disabled = state.presents < cost;
      view.upgradeButton.disabled = state.presents < upgradeCost;
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

    logProducerPurchase(producer, state.producersOwned[id]);

    recalcPps();
    updateStatsUI();
    updateProducersUI();
    updateUpgradesUI();
  }

  function upgradeProducer(id) {
    var producer = producerById[id];
    if (!producer) return;
    if (!isProducerUnlocked(producer)) return;

    var upgradeCost = getProducerUpgradeCost(producer);
    if (state.presents < upgradeCost) return;

    spendPresents(upgradeCost);
    state.producerLevels[id] = (state.producerLevels[id] || 1) + 1;

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
    logUpgradePurchase(upgrade);

    updateStatsUI();
    updateProducersUI();
    updateUpgradesUI();
  }

  function initProducersUI() {
    if (!producersListEl) return;

    PRODUCERS.forEach(function (producer) {
      var card = document.createElement("div");
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

      var costEl = document.createElement("button");
      costEl.type = "button";
      costEl.className = "shop-card-cost";
      costEl.addEventListener("click", function () {
        buyProducer(producer.id);
      });

      var ppsEl = document.createElement("span");
      ppsEl.className = "shop-card-pps";

      var levelEl = document.createElement("span");
      levelEl.className = "shop-card-level";

      var upgradeButton = document.createElement("button");
      upgradeButton.type = "button";
      upgradeButton.className = "shop-card-upgrade-button";
      var upgradeCostEl = document.createElement("span");
      upgradeCostEl.className = "shop-card-upgrade-cost";
      upgradeButton.appendChild(upgradeCostEl);
      upgradeButton.addEventListener("click", function () {
        upgradeProducer(producer.id);
      });

      meta.appendChild(costEl);
      meta.appendChild(ppsEl);
      meta.appendChild(levelEl);
      meta.appendChild(upgradeButton);

      var flavorEl = document.createElement("div");
      flavorEl.className = "shop-card-flavor";
      flavorEl.textContent = producer.flavor || "";

      bottom.appendChild(meta);
      bottom.appendChild(flavorEl);

      card.appendChild(top);
      card.appendChild(bottom);

      producersListEl.appendChild(card);

      producerViews.set(producer.id, {
        card: card,
        costEl: costEl,
        countEl: countEl,
        ppsEl: ppsEl,
        levelEl: levelEl,
        upgradeButton: upgradeButton,
        upgradeCostEl: upgradeCostEl
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

    // Toggle dev console with the \"d\" key.
    document.addEventListener("keydown", function (event) {
      // Ignore if focused in an input/textarea to avoid interfering with typing.
      var tag = (event.target && event.target.tagName) ? event.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea") return;

      if (event.key === "d" || event.key === "D") {
        toggleDevConsole();
      }
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

      maybeLogMorale(deltaSeconds);
      updateStatsUI();
      updateProducersUI();
      updateUpgradesUI();
      updateDevConsole();
    }, 100);
  }, 100);
  }

  function buildDevConsole() {
    if (state.devConsole.element) return;

    var container = document.createElement("div");
    container.className = "dev-console";

    var header = document.createElement("div");
    header.className = "dev-console-header";

    var title = document.createElement("div");
    title.className = "dev-console-title";
    title.textContent = "Dev Console";

    var hint = document.createElement("div");
    hint.className = "dev-console-hint";
    hint.textContent = "Press \"d\" to toggle";

    header.appendChild(title);
    header.appendChild(hint);

    var body = document.createElement("div");
    body.className = "dev-console-body";

    // Global section
    var globalSection = document.createElement("div");
    globalSection.className = "dev-console-section";

    var globalTitle = document.createElement("div");
    globalTitle.className = "dev-console-section-title";
    globalTitle.textContent = "Global";

    var presentsRow = document.createElement("div");
    presentsRow.className = "dev-console-row";
    var presentsLabel = document.createElement("label");
    presentsLabel.textContent = "Presents";
    var presentsInput = document.createElement("input");
    presentsInput.type = "number";
    presentsInput.min = "0";
    presentsInput.className = "dev-console-input";

    var presentsApply = document.createElement("button");
    presentsApply.type = "button";
    presentsApply.className = "dev-console-button";
    presentsApply.textContent = "Set";

    presentsApply.addEventListener("click", function () {
      var value = parseFloat(presentsInput.value);
      if (!isFinite(value) || value < 0) return;
      state.presents = value;
      if (state.totalPresents < value) {
        state.totalPresents = value;
      }
      updateStatsUI();
      updateProducersUI();
      updateUpgradesUI();
    });

    presentsRow.appendChild(presentsLabel);
    presentsRow.appendChild(presentsInput);
    presentsRow.appendChild(presentsApply);

    globalSection.appendChild(globalTitle);
    globalSection.appendChild(presentsRow);

    var globalHint = document.createElement("div");
    globalHint.className = "dev-console-hint";
    globalHint.textContent = "For testing; does not persist.";
    globalSection.appendChild(globalHint);

    body.appendChild(globalSection);

    // Producers section
    var producersSection = document.createElement("div");
    producersSection.className = "dev-console-section";

    var producersTitle = document.createElement("div");
    producersTitle.className = "dev-console-section-title";
    producersTitle.textContent = "Producers";

    producersSection.appendChild(producersTitle);

    PRODUCERS.forEach(function (producer) {
      var row = document.createElement("div");
      row.className = "dev-console-row";

      var label = document.createElement("label");
      label.textContent = producer.name;

      var ownedInput = document.createElement("input");
      ownedInput.type = "number";
      ownedInput.min = "0";
      ownedInput.className = "dev-console-input";

      var levelInput = document.createElement("input");
      levelInput.type = "number";
      levelInput.min = "1";
      levelInput.className = "dev-console-input";

      var applyButton = document.createElement("button");
      applyButton.type = "button";
      applyButton.className = "dev-console-button";
      applyButton.textContent = "Apply";

      applyButton.addEventListener("click", function () {
        var ownedVal = parseInt(ownedInput.value, 10);
        var levelVal = parseInt(levelInput.value, 10);

        if (isFinite(ownedVal) && ownedVal >= 0) {
          state.producersOwned[producer.id] = ownedVal;
        }
        if (isFinite(levelVal) && levelVal >= 1) {
          state.producerLevels[producer.id] = levelVal;
        }

        recalcPps();
        updateStatsUI();
        updateProducersUI();
        updateUpgradesUI();
      });

      row.appendChild(label);
      row.appendChild(ownedInput);
      row.appendChild(levelInput);
      row.appendChild(applyButton);

      producersSection.appendChild(row);
    });

    body.appendChild(producersSection);

    // Upgrades section
    var upgradesSection = document.createElement("div");
    upgradesSection.className = "dev-console-section";

    var upgradesTitle = document.createElement("div");
    upgradesTitle.className = "dev-console-section-title";
    upgradesTitle.textContent = "Grant Upgrades";

    upgradesSection.appendChild(upgradesTitle);

    UPGRADES.forEach(function (upgrade) {
      var row = document.createElement("div");
      row.className = "dev-console-row";

      var label = document.createElement("label");
      label.textContent = upgrade.name;

      var grantButton = document.createElement("button");
      grantButton.type = "button";
      grantButton.className = "dev-console-button";
      grantButton.textContent = "Grant";

      grantButton.addEventListener("click", function () {
        if (state.purchasedUpgrades.has(upgrade.id)) return;
        state.purchasedUpgrades.add(upgrade.id);
        applyUpgradeEffect(upgrade);
        updateStatsUI();
        updateProducersUI();
        updateUpgradesUI();
      });

      row.appendChild(label);
      row.appendChild(grantButton);

      upgradesSection.appendChild(row);
    });

    body.appendChild(upgradesSection);

    container.appendChild(header);
    container.appendChild(body);

    document.body.appendChild(container);
    state.devConsole.element = container;
    state.devConsole.presentsInput = presentsInput;
  }

  function updateDevConsole() {
    if (!state.devConsole.element || !state.devConsole.visible) return;

    // Keep presents input roughly in sync for convenience.
    if (state.devConsole.presentsInput) {
      state.devConsole.presentsInput.value = Math.floor(state.presents);
    }
  }

  function toggleDevConsole() {
    buildDevConsole();

    state.devConsole.visible = !state.devConsole.visible;
    if (state.devConsole.element) {
      if (state.devConsole.visible) {
        state.devConsole.element.classList.add("dev-console--visible");
      } else {
        state.devConsole.element.classList.remove("dev-console--visible");
      }
    }
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