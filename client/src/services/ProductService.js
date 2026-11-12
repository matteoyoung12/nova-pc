/** @typedef {'Standard'|'Pro'|'Ultra'|'Extreme'} Category */
/** @typedef {{id:string;category:Category;name:string;price:number;description:string;badges:string[];specifications:{cpu:string;gpu:string;ram:string;ssd:string}} Product */

export class ProductService {
  #products = [
    {
      id: "s-one",
      category: "Standard",
      name: "NOVA S1",
      price: 89990,
      description: "Чистый Full HD-гейминг без лишних компромиссов.",
      badges: ["Хит продаж", "Full HD"],
      specifications: {
        cpu: "Ryzen 5 7600",
        gpu: "GeForce RTX 4060",
        ram: "32 ГБ DDR5",
        ssd: "SSD NVMe 1 ТБ",
      },
    },
    {
      id: "s-two",
      category: "Standard",
      name: "NOVA S2",
      price: 104990,
      description: "Для киберспорта, первых стримов и плавной работы.",
      badges: ["144 Hz", "Тихая"],
      specifications: {
        cpu: "Core i5-14600KF",
        gpu: "GeForce RTX 4060 Ti",
        ram: "32 ГБ DDR5",
        ssd: "SSD NVMe 1 ТБ",
      },
    },
    {
      id: "p-one",
      category: "Pro",
      name: "NOVA P1",
      price: 134990,
      description: "Уверенная производительность в 1440p и стриминге.",
      badges: ["1440p Gaming", "Тихая"],
      specifications: {
        cpu: "Ryzen 7 7700",
        gpu: "RTX 4070 SUPER",
        ram: "32 ГБ DDR5",
        ssd: "SSD NVMe 2 ТБ",
      },
    },
    {
      id: "p-two",
      category: "Pro",
      name: "NOVA P2",
      price: 149990,
      description: "Баланс высокой частоты кадров и аккуратного дизайна.",
      badges: ["Creator", "2K Ultra"],
      specifications: {
        cpu: "Ryzen 7 7700",
        gpu: "Radeon RX 7800 XT",
        ram: "32 ГБ DDR5",
        ssd: "SSD NVMe 2 ТБ",
      },
    },
    {
      id: "u-one",
      category: "Ultra",
      name: "NOVA U1",
      price: 179990,
      description: "Для игр, монтажа и серьёзных творческих проектов.",
      badges: ["Creator", "VR Ready"],
      specifications: {
        cpu: "Ryzen 9 7900",
        gpu: "RTX 4070 Ti SUPER",
        ram: "64 ГБ DDR5",
        ssd: "SSD NVMe 2 ТБ",
      },
    },
    {
      id: "u-two",
      category: "Ultra",
      name: "NOVA U2",
      price: 204990,
      description: "Максимум запаса для 4K-монитора и производственных задач.",
      badges: ["4K Ready", "Liquid cooled"],
      specifications: {
        cpu: "Ryzen 9 7950X",
        gpu: "RTX 4080 SUPER",
        ram: "64 ГБ DDR5",
        ssd: "SSD NVMe 2 ТБ",
      },
    },
    {
      id: "x-one",
      category: "Extreme",
      name: "NOVA X1",
      price: 269990,
      description: "4K-гейминг и максимальная мощность без оглядки.",
      badges: ["4K Gaming", "Premium"],
      specifications: {
        cpu: "Ryzen 7 7800X3D",
        gpu: "RTX 4080 SUPER",
        ram: "64 ГБ DDR5",
        ssd: "SSD NVMe 4 ТБ",
      },
    },
    {
      id: "x-two",
      category: "Extreme",
      name: "NOVA X2",
      price: 349990,
      description: "Флагманская станция для игр, 3D и тяжёлого рендера.",
      badges: ["Flagship", "No limits"],
      specifications: {
        cpu: "Ryzen 9 7950X3D",
        gpu: "RTX 4090",
        ram: "96 ГБ DDR5",
        ssd: "SSD NVMe 4 ТБ",
      },
    },
  ];

  async getProducts() {
    await new Promise((resolve) => setTimeout(resolve, 180));
    return this.#products.map((item) => ({
      ...item,
      specifications: { ...item.specifications },
    }));
  }
}
