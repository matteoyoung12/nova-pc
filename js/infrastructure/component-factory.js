import { CpuComponent, GpuComponent, MotherboardComponent, MemoryComponent, StorageComponent, PsuComponent, CaseComponent, CoolerComponent } from '../domain/components.js';
import { CatalogError } from '../domain/errors.js';
const TYPES = { cpu: CpuComponent, gpu: GpuComponent, motherboard: MotherboardComponent, memory: MemoryComponent, storage: StorageComponent, psu: PsuComponent, case: CaseComponent, cooler: CoolerComponent };
export class ComponentFactory { create(record) { const Type = TYPES[record?.category]; if (!Type) throw new CatalogError('Каталог содержит неизвестную категорию компонента.'); return new Type(record); } }
