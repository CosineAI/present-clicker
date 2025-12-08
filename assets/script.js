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

  // Flavour pools for producer purchases.
  const PRODUCER_FLAVOURS = {
    assistant_elf: [
      "An Assistant Elf clocks in, clutching a legally questionable contract.",
      "Your new Assistant Elf asks if 'sleep' is still part of the benefits package.",
      "An elf in a reflective vest appears. They already look over-caffeinated.",
      "The Assistant Elf nods solemnly. \"For the children,\" they whisper."
    ],
    small_workshop: [
      "Another Small Workshop springs up, complete with flickering fairy lights.",
      "A fresh Small Workshop opens. The fire marshal sends a strongly worded letter.",
      "Wood shavings and glitter start leaking from a newly built Small Workshop.",
      "You add a Small Workshop. Someone immediately hangs a \"Live, Laugh, Labor\" sign."
    ],
    assembly_line: [
      "An Automated Assembly Line whirs to life, humming a slightly off-key carol.",
      "Robotic arms begin wrapping gifts at inhuman speeds. HR looks concerned.",
      "An Assembly Line boots up and instantly files for overtime.",
      "Your new Assembly Line only crashes twice during startup. Progress."
    ],
    offshore_sweatshop: [
      "An Offshore Sweatshop flickers into existence beyond any known labor laws.",
      "Distant smokestacks appear on the horizon. Santa calls it 'logistics.'",
      "You open an Offshore Sweatshop. The clouds darken a shade.",
      "A shipping container vibrates ominously, then rebrands itself as a Sweatshop."
    ],
    interdimensional_warehouse: [
      "An Interdimensional Fulfillment Center opens. Packages arrive before requests.",
      "Reality stutters as your new Fulfillment Center slots into three timelines.",
      "A portal hiccups, and out pops an Interdimensional Warehouse supervisor.",
      "Your warehouse workers exist in four dimensions; morale in at least one is fine."
    ],
    ritual_circle: [
      "The Ritual Circle glows faintly. Elves agree not to talk about it.",
      "Chalk lines and candles mark a new Ritual Circle in the break room.",
      "You add a Ritual Circle. Somebody hums 'Jingle Bells' backwards.",
      "A Ritual Circle completes itself. You swear the presents look... haunted."
    ],
    abandoned_mall_ritual: [
      "An Abandoned Mall opens somewhere distant and wrong. The food court chants softly.",
      "Your new Mall Ritual echoes with ghostly Christmas elevator music.",
      "A carousel in the Abandoned Mall spins on its own, spitting out wrapped gifts.",
      "Security cameras in the Mall watch you back. Production, however, soars."
    ]
  };

  // Flavour pools for upgrades.
  const UPGRADE_FLAVOURS = {
    better_gloves: [
      "You slip on Padded Mittens. Pain goes down, productivity goes up.",
      "Padded Mittens acquired. OSHA sends a thank-you card.",
      "Your hands feel less like ground beef. Clicking intensifies."
    ],
    carpal_tunnel: [
      "You embrace Questionable Ergonomics. Future-you can handle the medical bills.",
      "Wrists protest; output doesn’t. Questionable Ergonomics indeed.",
      "You find a posture chart labeled 'Don’t.' You ignore it."
    ],
    industrial_gloves: [
      "Industrial Gloves click straight through the mouse and into metaphysics.",
      "Your fingers now qualify as heavy machinery.",
      "The gloves thud against the present icon with deeply worrying force."
    ],
    elf_adrenaline: [
      "Elf Adrenaline flows. Blinking is officially cancelled.",
      "You inject some holiday spirit directly into your workflow.",
      "Time slows down. Your clicking hand does not."
    ],
    phantom_clicks: [
      "You stop clicking for a second. The clicks don’t.",
      "Phantom Clicks echo through the UI long after you step away.",
      "You swear you hear someone else clicking in an empty room."
    ],
    quantum_pointer: [
      "Your cursor splits into several probable positions at once.",
      "Every click now happens in a handful of timelines. Most of them successful.",
      "The Quantum Pointer reports both success and failure, but only success counts."
    ],
    saint_nick_knuckles: [
      "Your knuckles crack in a way HR is not trained to handle.",
      "You deliver justice directly to the present button.",
      "Saint Nick’s Knuckles collide with the mouse. Present counts tremble."
    ],
    chromatic_reindeer_energy: [
      "You chug a Chromatic Reindeer. The can keeps vibrating afterwards.",
      "Your veins now hum in twelve festive colours.",
      "The energy drink label reads: 'May cause productivity, visions, antlers.'"
    ],
    assistant_whip: [
      "Ergonomic Whips arrive in tasteful holiday colours.",
      "The Assistants speed up. Their enthusiasm is not consulted.",
      "Whips crack. Spreadsheets cheer. Elves update their résumés."
    ],
    assistant_espresso_machine: [
      "An espresso machine appears in the break room. The Assistants stop blinking.",
      "New policy: one espresso shot per elf per click.",
      "The coffee smells faintly of brimstone and productivity."
    ],
    assistant_clone_program: [
      "The Assistant Cloning Program spins up. HR opens a new spreadsheet tab.",
      "You are no longer sure how many Assistant Elves you employ. Output says: enough.",
      "More elves clock in than clocked out. Nobody questions it."
    ],
    workshop_bunkbeds: [
      "Bunkbeds go up in the Small Workshops. Commutes go down to zero.",
      "Someone calls the new arrangements 'cozy'. Someone else calls a lawyer.",
      "The workshops now smell like cocoa, solvent, and shared dreams of escape."
    ],
    assembly_overclock: [
      "You overclock the Assembly Lines. The safety manual spontaneously combusts.",
      "Warning lights flash. Output rises. You pretend not to see the warning lights.",
      "An engineer tapes over the 'Do Not Exceed' line. The line has never been happier."
    ],
    sweatshop_global_sourcing: [
      "Global Sourcing kicks in. Packages now arrive from places not on any map.",
      "Supply chains vanish into a red string diagram and reappear faster.",
      "Accountants nod approvingly at the new 'off-chart' suppliers."
    ],
    warehouse_non_euclidean_layout: [
      "Shelves reconfigure themselves into angles you can’t quite look at.",
      "Pickers report that every aisle is now the closest aisle.",
      "The Fulfillment Center starts shipping items before the order is finished."
    ],
    ritual_blood_signed_contracts: [
      "The ink in the contract darkens several shades. Ritual output surges.",
      "Someone signs in something that is technically red. The circles glow brighter.",
      "New clauses appear in the contracts in very small, very sharp print."
    ],
    mall_food_court_entity: [
      "The Food Court Entity awakens and demands higher quotas and extra sauce.",
      "A voice over the mall PA whispers deals too good to be mortal.",
      "The pretzel stand starts chanting. Package throughput improves dramatically."
    ],
    overtime: [
      "Mandatory Overtime is announced via a cheerful email.",
      "Factory lights stay on past midnight; the clocks politely look away.",
      "Someone removes the word 'schedule' and replaces it with 'ongoing'."
    ],
    time_dilation: [
      "Time around the North Pole stretches like old tinsel.",
      "Minutes develop a suspicious number of extra seconds.",
      "A calendar page curls up and vanishes. You gain more working hours."
    ],
    dyslexia: [
      "You blink at the word 'Santa' and see something else entirely.",
      "For a moment, the letters rearrange themselves. You decide not to mention it.",
      "The ink on the contract wriggles. The signature is still yours."
    ]
  };

  const MORALE_MESSAGES = [
    "Factory morale report: officially 'fine'. The anonymous comments disagree.",
    "An elf suggestion box overflows. Management installs a larger shredder.",
    "Someone writes 'UNION' on the whiteboard. It is swiftly erased, then underlined.",
    "The break room cocoa is now 80% caffeine by volume. Spirits are... energetic.",
    "A poster reads 'Remember: You’re Replaceable, But We Appreciate You'.",
    "An elf asks about vacation days. Everyone laughs, then goes quiet.",
    "The workshop choir practices morale songs in a minor key.",
    "Management rolls out a 'Fun Friday'. It is identical to every other day.",
    "A memo announces 'Wellness Week'. The bullet points are just higher quotas.",
    "Rumour: one factory has a window. Productivity there is considered suspicious.",
    "The time clock develops a small queue of sighs and distant stares.",
    "An elf decorates their workstation. The glitter gets into the machinery.",
    "Someone replaces the safety posters with inspirational quotes. No one notices.",
    "Factory morale measured in candy canes per hour: inconclusive but sticky.",
    "An anonymous survey says morale is 'seasonally adjusted'. No further data given."
  ];

  // Stage-based status messages for when the gates are open.
  const GATES_STATUS_MESSAGES = [
    // Stage 0: freshly opened
    [
      "The Ritual Circle hums. The air smells faintly of cinnamon and ozone.",
      "You feel a distant pressure, like the world taking a deep breath.",
      "Somewhere, bells jingle out of sync with the music."
    ],
    // Stage 1: forces leaking through
    [
      "Shadows in the workshop move half a beat behind their owners.",
      "An elf insists the snow outside is falling upwards.",
      "You hear scratching sounds from inside sealed gift boxes."
    ],
    // Stage 2: demons getting comfortable
    [
      "The assembly line sings a carol in a language no one taught it.",
      "An invoice arrives pre-signed by 'Management, Infernal Division'.",
      "The cocoa in the break room briefly catches fire, then apologises."
    ],
    // Stage 3: situation deteriorating
    [
      "Maps quietly rearrange themselves to put the North Pole in the center.",
      "Quality control reports 'unusual but festive' manifestations.",
      "Elves report seeing hoofprints on the ceiling. No reindeer are present."
    ],
    // Stage 4: almost fully taken over
    [
      "The world outside the windows looks slightly off-axis.",
      "You’re pretty sure the globe on Santa’s desk just blinked.",
      "Some of the presents pulse softly, as if breathing. Productivity remains excellent."
    ]
  ];

  var moraleAccumulator = 0;

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
    gates: {
      open: false,
      openedAtMs: 0,
      lastStageIndex: -1,
      ui: null
    },
    shopsVisible: true,
    devConsole: {
      element: null,
      visible: false,
      presentsInput: null
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
  const shopsToggleButton = document.getElementById("shops-toggle-button");

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

  function getRitualGateBoost() {
    if (!state.gates.open || !state.gates.openedAtMs) return 1;

    var now = performance.now();
    var elapsedSeconds = (now - state.gates.openedAtMs) / 1000;
    if (elapsedSeconds < 0) elapsedSeconds = 0;

    // Exponential decay from 10x down towards 0, clamped at 0.5x.
    // 10 * exp(-k * t) = 0.5 at t = 600s => k = ln(20) / 600
    var k = Math.log(20) / 600;
    var boost = 10 * Math.exp(-k * elapsedSeconds);
    if (boost < 0.5) boost = 0.5;
    return boost;
  }

  function getMultiplierForProducer(producer) {
    var byType = state.multipliers.byType[producer.type] || 1;
    var byId = state.multipliers.byId[producer.id] || 1;
    var result = state.multipliers.global * byType * byId;

    if (producer.type === "ritual") {
      result *= getRitualGateBoost();
    }

    return result;
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

      var cannotAfford = state.presents < cost;
      if (cannotAfford) {
        view.card.classList.add("shop-card--disabled");
        view.card.setAttribute("aria-disabled", "true");
      } else {
        view.card.classList.remove("shop-card--disabled");
        view.card.setAttribute("aria-disabled", "false");
      }
      view.upgradeButton.disabled = state.presents < upgradeCost;
    });
  }

  function updateShopsVisibility() {
    var producersPanel = producersListEl ? producersListEl.parentElement : null;
    var upgradesPanel = upgradesListEl ? upgradesListEl.parentElement : null;
    var visible = state.shopsVisible;

    if (producersPanel) {
      producersPanel.style.display = visible ? "" : "none";
    }
    if (upgradesPanel) {
      upgradesPanel.style.display = visible ? "" : "none";
    }

    if (shopsToggleButton) {
      shopsToggleButton.textContent = visible ? "Hide shops & upgrades" : "Show shops & upgrades";
      shopsToggleButton.setAttribute("aria-pressed", visible ? "true" : "false");
    }
  });
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

    updateGatesUI();
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

      var costEl = document.createElement("span");
      costEl.className = "shop-card-cost";

      var ppsEl = document.createElement("span");
      ppsEl.className = "shop-card-pps";

      var levelEl = document.createElement("span");
      levelEl.className = "shop-card-level";

      meta.appendChild(costEl);
      meta.appendChild(ppsEl);
      meta.appendChild(levelEl);

      var flavorEl = document.createElement("div");
      flavorEl.className = "shop-card-flavor";
      flavorEl.textContent = producer.flavor || "";

      var upgradeRow = document.createElement("div");
      upgradeRow.className = "shop-card-upgrade-row";

      var upgradeButton = document.createElement("button");
      upgradeButton.type = "button";
      upgradeButton.className = "shop-card-upgrade-button";
      var upgradeCostEl = document.createElement("span");
      upgradeCostEl.className = "shop-card-upgrade-cost";
      upgradeButton.appendChild(upgradeCostEl);
      upgradeButton.addEventListener("click", function (event) {
        event.stopPropagation();
        upgradeProducer(producer.id);
      });

      upgradeRow.appendChild(upgradeButton);

      bottom.appendChild(meta);
      bottom.appendChild(flavorEl);
      bottom.appendChild(upgradeRow);

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
        ppsEl: ppsEl,
        levelEl: levelEl,
        upgradeButton: upgradeButton,
        upgradeCostEl: upgradeCostEl
      });
    });
  }

  function initUpgradesUI() {
    if (!upgradesListEl) return;

    // Normal upgrades
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

    // Gates toggle card (appears once rituals exist)
    var gatesCard = document.createElement("button");
    gatesCard.type = "button";
    gatesCard.className = "shop-card shop-card--upgrade shop-card--gates";
    gatesCard.style.display = "none";

    var gatesTop = document.createElement("div");
    gatesTop.className = "shop-card-top";

    var gatesLeft = document.createElement("div");
    var gatesNameEl = document.createElement("div");
    gatesNameEl.className = "shop-card-name";
    gatesNameEl.textContent = "OPEN THE GATES";

    var gatesDescEl = document.createElement("div");
    gatesDescEl.className = "shop-card-desc";
    gatesDescEl.textContent = "Trade stability for power. Temporarily supercharge rituals, then watch it all slip.";

    gatesLeft.appendChild(gatesNameEl);
    gatesLeft.appendChild(gatesDescEl);

    gatesTop.appendChild(gatesLeft);

    var gatesBottom = document.createElement("div");
    gatesBottom.className = "shop-card-bottom";

    var gatesMeta = document.createElement("div");
    gatesMeta.className = "shop-card-meta";

    var gatesCostEl = document.createElement("span");
    gatesCostEl.className = "shop-card-cost";

    var gatesStatusEl = document.createElement("span");
    gatesStatusEl.className = "shop-card-pps";

    gatesMeta.appendChild(gatesCostEl);
    gatesMeta.appendChild(gatesStatusEl);

    gatesBottom.appendChild(gatesMeta);

    var gatesFlavorEl = document.createElement("div");
    gatesFlavorEl.className = "shop-card-flavor";
    gatesFlavorEl.textContent = "Costs about one minute of current automatic output each time you open it.";

    gatesBottom.appendChild(gatesFlavorEl);

    gatesCard.appendChild(gatesTop);
    gatesCard.appendChild(gatesBottom);

    gatesCard.addEventListener("click", function () {
      toggleGates();
    });

    // Put the gates card at the top of the upgrades list.
    if (upgradesListEl.firstChild) {
      upgradesListEl.insertBefore(gatesCard, upgradesListEl.firstChild);
    } else {
      upgradesListEl.appendChild(gatesCard);
    }

    state.gates.ui = {
      card: gatesCard,
      nameEl: gatesNameEl,
      descEl: gatesDescEl,
      costEl: gatesCostEl,
      statusEl: gatesStatusEl
    };
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

    if (shopsToggleButton) {
      shopsToggleButton.addEventListener("click", function () {
        state.shopsVisible = !state.shopsVisible;
        updateShopsVisibility();
      });
    }

    // Toggle dev console with the "d" key.
    document.addEventListener("keydown", function (event) {
      // Ignore if focused in an input/textarea to avoid interfering with typing.
      var tag = (event.target && event.target.tagName) ? event.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea") return;

      if (event.key === "d" || event.key === "D") {
        toggleDevConsole();
      }
    });
  }
    });
  }

  function getGatesToggleCost() {
    var pps = state.presentsPerSecond;
    if (!pps || pps <= 0) return 0;
    // Roughly one minute of current automatic production.
    return Math.ceil(pps * 60);
  }

  function getGatesStageIndex(elapsedSeconds) {
    var minutes = elapsedSeconds / 60;
    if (minutes < 2) return 0;
    if (minutes < 4) return 1;
    if (minutes < 7) return 2;
    if (minutes < 10) return 3;
    return 4;
  }

  function updateGatesStatus(elapsedSeconds) {
    var idx = getGatesStageIndex(elapsedSeconds);
    if (idx === state.gates.lastStageIndex) return;

    state.gates.lastStageIndex = idx;
    var pool = GATES_STATUS_MESSAGES[idx] || [];
    var msg = randomFrom(pool);
    if (msg) addLog(msg);
  }

  function updateGatesBodyClass() {
    if (state.gates.open) {
      document.body.classList.add("gates-open");
    } else {
      document.body.classList.remove("gates-open");
    }
  }

  function openGates() {
    var cost = getGatesToggleCost();
    if (cost > 0 && state.presents < cost) {
      addLog("You reach for the Ritual Circle, but the accounting department shakes its head.");
      return;
    }

    if (cost > 0) {
      spendPresents(cost);
    }

    state.gates.open = true;
    state.gates.openedAtMs = performance.now();
    state.gates.lastStageIndex = -1;

    addLog("You OPEN THE GATES. The Ritual Circle roars like a distant furnace.");
    updateGatesBodyClass();
    recalcPps();
  }

  function closeGates() {
    if (!state.gates.open) return;

    state.gates.open = false;
    addLog("You CLOSE THE GATES. The workshop exhales, if only a little.");
    updateGatesBodyClass();
    recalcPps();
  }

  function toggleGates() {
    if (state.gates.open) {
      closeGates();
    } else {
      openGates();
    }
    updateGatesUI();
    updateStatsUI();
    updateProducersUI();
  }

  function updateGatesUI() {
    if (!state.gates.ui) return;

    var hasRitualCircle = state.producersOwned["ritual_circle"] > 0;
    var ui = state.gates.ui;

    ui.card.style.display = hasRitualCircle ? "" : "none";
    if (!hasRitualCircle) return;

    var cost = getGatesToggleCost();
    if (state.gates.open) {
      ui.nameEl.textContent = "CLOSE THE GATES";
      ui.descEl.textContent = "Seal the circle. Rituals return to their baseline efficiency.";
      ui.costEl.textContent = "Cost: 1 🎁";
      var boost = getRitualGateBoost();
      ui.statusEl.textContent = "Current ritual multiplier: x" + boost.toFixed(2);
      ui.card.disabled = state.presents < 1;
    } else {
      ui.nameEl.textContent = "OPEN THE GATES";
      ui.descEl.textContent = "Summon help from elsewhere. Rituals surge, then slowly slip away.";
      ui.costEl.textContent = "Cost: " + formatNumber(cost) + " 🎁";
      ui.statusEl.textContent = "Effect: rituals start at x10 and decay to x0.5 over ~10 minutes.";
      ui.card.disabled = state.presents < cost || cost === 0;
    }
  }

  function gameLoop() {
    var lastTick = performance.now();

    window.setInterval(function () {
      var now = performance.now();
      var deltaSeconds = (now - lastTick) / 1000;
      lastTick = now;

      // Recompute PPS so time-based effects (gates) stay accurate.
      recalcPps();

      if (state.presentsPerSecond > 0) {
        var gained = state.presentsPerSecond * deltaSeconds;
        earnPresents(gained);
      }

      if (state.gates.open && state.gates.openedAtMs) {
        var elapsedSeconds = (now - state.gates.openedAtMs) / 1000;
        if (elapsedSeconds < 0) elapsedSeconds = 0;
        updateGatesStatus(elapsedSeconds);
      }

      maybeLogMorale(deltaSeconds);
      updateStatsUI();
      updateProducersUI();
      updateUpgradesUI();
      updateDevConsole();
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
    updateShopsVisibility();
    attachEvents();
    gameLoop();
  }

  init();
})();