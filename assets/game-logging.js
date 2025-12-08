(function () {
  "use strict";

  /**
   * Narrative text and logging helpers.
   * Handles:
   * - flavour text for producers and upgrades
   * - periodic morale messages
   * - gate status narration
   * - rendering the rolling log in the UI
   */

  // Flavour pools for producer purchases.
  var PRODUCER_FLAVOURS = {
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
  var UPGRADE_FLAVOURS = {
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

  var MORALE_MESSAGES = [
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
  var GATES_STATUS_MESSAGES = [
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

  var recentMessages = [];
  var moraleAccumulator = 0;

  var logListEl = document.getElementById("log");

  function randomFrom(array) {
    if (!array || !array.length) return null;
    var index = Math.floor(Math.random() * array.length);
    return array[index];
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

    var PC = window.PRESENT_CLICKER || {};
    var PRODUCERS = PC.PRODUCERS || [];
    var state = PC.state;
    if (!state) return;

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

  function getGatesStageIndex(elapsedSeconds) {
    var minutes = elapsedSeconds / 60;
    if (minutes < 2) return 0;
    if (minutes < 4) return 1;
    if (minutes < 7) return 2;
    if (minutes < 10) return 3;
    return 4;
  }

  function updateGatesStatus(elapsedSeconds) {
    var PC = window.PRESENT_CLICKER || {};
    var state = PC.state;
    if (!state || !state.gates) return;

    var idx = getGatesStageIndex(elapsedSeconds);
    if (idx === state.gates.lastStageIndex) return;

    state.gates.lastStageIndex = idx;
    var pool = GATES_STATUS_MESSAGES[idx] || [];
    var msg = randomFrom(pool);
    if (msg) addLog(msg);
  }

  var PC = window.PRESENT_CLICKER || {};
  PC.log = {
    addLog: addLog,
    logProducerPurchase: logProducerPurchase,
    logUpgradePurchase: logUpgradePurchase,
    maybeLogMorale: maybeLogMorale,
    updateGatesStatus: updateGatesStatus,
    randomFrom: randomFrom
  };
  window.PRESENT_CLICKER = PC;
})();