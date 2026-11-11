const product=(id,slug,name,description,price,tone,specs)=>({id,slug,name,description,price,tone,specs:JSON.stringify(specs)});
export const storeProducts=[
product('pc-start','start','Pixel Start','Надёжный ПК для учёбы, работы и первых игр.',69990,'violet',{cpu:'Ryzen 5 7600',gpu:'RTX 4060',memory:'16 ГБ DDR5',storage:'1 ТБ NVMe'}),
product('pc-play','play','Pixel Play','Сбалансированная игровая сборка в тихом корпусе.',114990,'sky',{cpu:'Ryzen 7 7700',gpu:'RTX 4070 SUPER',memory:'32 ГБ DDR5',storage:'1 ТБ NVMe'}),
product('pc-studio','studio','Pixel Studio','Мощность для 3D, монтажа и тяжёлых проектов.',169990,'pink',{cpu:'Ryzen 7 7800X3D',gpu:'RTX 4070 SUPER',memory:'64 ГБ DDR5',storage:'2 ТБ NVMe'}),
product('pc-quiet','quiet','Pixel Quiet','Незаметный рабочий компьютер без лишнего шума.',84990,'amber',{cpu:'Core i5-12400F',gpu:'RTX 4060',memory:'32 ГБ DDR4',storage:'1 ТБ NVMe'})
];
