const row = (category, id, name, price, performance, power, specs) => ({
  category,
  id,
  name,
  price,
  performance,
  power,
  specs: JSON.stringify(specs),
});
export const seedCatalog = [
  row("cpu", "cpu-7600", "AMD Ryzen 5 7600", 18990, 78, 65, { socket: "AM5" }),
  row("cpu", "cpu-7700", "AMD Ryzen 7 7700", 24990, 88, 65, { socket: "AM5" }),
  row("cpu", "cpu-14600", "Intel Core i5-14600KF", 25990, 89, 181, {
    socket: "LGA1700",
  }),
  row("cpu", "cpu-12400", "Intel Core i5-12400F", 12990, 69, 117, {
    socket: "LGA1700",
  }),
  row("gpu", "gpu-4060", "NVIDIA GeForce RTX 4060", 31990, 67, 115, {
    length: 242,
  }),
  row("gpu", "gpu-4070", "NVIDIA GeForce RTX 4070 SUPER", 64990, 91, 220, {
    length: 300,
  }),
  row("gpu", "gpu-7700", "AMD Radeon RX 7700 XT", 48990, 82, 245, {
    length: 320,
  }),
  row("gpu", "gpu-7800", "AMD Radeon RX 7800 XT", 57990, 88, 263, {
    length: 335,
  }),
  row("motherboard", "mb-b650m", "MSI PRO B650M-A WIFI", 17490, 76, 45, {
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "mATX",
    memorySlots: 4,
  }),
  row("motherboard", "mb-b650", "ASUS TUF GAMING B650-PLUS", 21990, 85, 50, {
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "ATX",
    memorySlots: 4,
  }),
  row("motherboard", "mb-b760m", "GIGABYTE B760M DS3H", 13990, 70, 42, {
    socket: "LGA1700",
    memoryType: "DDR5",
    formFactor: "mATX",
    memorySlots: 4,
  }),
  row("motherboard", "mb-b660", "ASRock B660M Pro RS", 10990, 62, 40, {
    socket: "LGA1700",
    memoryType: "DDR4",
    formFactor: "mATX",
    memorySlots: 4,
  }),
  row("memory", "ram-ddr5-16", "Kingston Fury Beast 16 ГБ DDR5", 6990, 70, 5, {
    memoryType: "DDR5",
  }),
  row("memory", "ram-ddr5-32", "Corsair Vengeance 32 ГБ DDR5", 12990, 88, 7, {
    memoryType: "DDR5",
  }),
  row("memory", "ram-ddr4-16", "Kingston Fury Beast 16 ГБ DDR4", 4590, 65, 4, {
    memoryType: "DDR4",
  }),
  row("memory", "ram-ddr4-32", "G.Skill Ripjaws 32 ГБ DDR4", 8190, 78, 6, {
    memoryType: "DDR4",
  }),
  row("storage", "ssd-1tb", "WD Blue SN580 1 ТБ NVMe", 6490, 74, 5, {
    capacity: "1 ТБ",
  }),
  row("storage", "ssd-2tb", "Samsung 990 EVO 2 ТБ NVMe", 15990, 93, 6, {
    capacity: "2 ТБ",
  }),
  row("storage", "ssd-500", "Kingston NV2 500 ГБ NVMe", 3990, 60, 4, {
    capacity: "500 ГБ",
  }),
  row("storage", "hdd-2tb", "Seagate BarraCuda 2 ТБ", 5990, 45, 7, {
    capacity: "2 ТБ",
  }),
  row("psu", "psu-550", "be quiet! System Power 10 550W", 6290, 62, 0, {
    wattage: 550,
  }),
  row("psu", "psu-650", "Deepcool PK650D 650W", 7490, 72, 0, { wattage: 650 }),
  row("psu", "psu-750", "Corsair RM750e 750W", 11990, 88, 0, { wattage: 750 }),
  row("psu", "psu-850", "MSI MAG A850GL 850W", 13990, 93, 0, { wattage: 850 }),
  row("case", "case-air", "Deepcool CC560 ARGB", 5990, 70, 10, {
    formFactors: ["ATX", "mATX"],
    maxGpuLength: 370,
    maxCoolerHeight: 163,
  }),
  row("case", "case-mini", "Zalman i3 NEO", 4390, 55, 8, {
    formFactors: ["mATX"],
    maxGpuLength: 300,
    maxCoolerHeight: 155,
  }),
  row("case", "case-nzxt", "NZXT H5 Flow", 9990, 86, 12, {
    formFactors: ["ATX", "mATX"],
    maxGpuLength: 365,
    maxCoolerHeight: 165,
  }),
  row("case", "case-q300", "Cooler Master Q300L", 5290, 60, 8, {
    formFactors: ["mATX"],
    maxGpuLength: 360,
    maxCoolerHeight: 159,
  }),
  row("cooler", "cooler-stock", "AMD Wraith Stealth", 0, 35, 3, {
    height: 55,
    type: "top",
  }),
  row("cooler", "cooler-ag400", "Deepcool AG400", 2490, 70, 4, {
    height: 150,
    type: "tower",
  }),
  row("cooler", "cooler-ak620", "Deepcool AK620", 6390, 92, 5, {
    height: 160,
    type: "tower",
  }),
  row("cooler", "cooler-noctua", "Noctua NH-U12S redux", 5390, 85, 5, {
    height: 158,
    type: "tower",
  }),
];
