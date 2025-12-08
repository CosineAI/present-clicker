// Present Clicker configuration: producers and upgrades.
// Split out from main game logic for easier editing.

window.PRESENT_CLICKER_PRODUCERS = [
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

window.PRESENT_CLICKER_UPGRADES = [
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