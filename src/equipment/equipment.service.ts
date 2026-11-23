import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { FindEquipmentQueryDto } from './dto/find-equipment-query.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import {
  Equipment,
  EquipmentCategory,
  EquipmentCondition,
} from './equipment.interface';

@Injectable()
export class EquipmentService {
  private equipmentList: Equipment[] = [
    {
      id: 1,
      assetCode: 'LAB-EL-001',
      name: 'Digital Oscilloscope Rigol',
      category: EquipmentCategory.ELECTRONIC,
      condition: EquipmentCondition.GOOD,
      stock: 5,
      location: 'Lab Elektronika Dasar',
    },
    {
      id: 2,
      assetCode: 'LAB-NW-001',
      name: 'MikroTik RouterBoard RB951',
      category: EquipmentCategory.NETWORK,
      condition: EquipmentCondition.GOOD,
      stock: 12,
      location: 'Lab Jaringan Komputer',
    },
    {
      id: 3,
      assetCode: 'LAB-MM-001',
      name: 'Proyektor Epson EB-X500',
      category: EquipmentCategory.MULTIMEDIA,
      condition: EquipmentCondition.MINOR_DAMAGE,
      stock: 3,
      location: 'Lab Multimedia',
    },
    {
      id: 4,
      assetCode: 'LAB-OT-001',
      name: 'Toolkit Obeng Presisi',
      category: EquipmentCategory.OTHER,
      condition: EquipmentCondition.NEEDS_REPAIR,
      stock: 8,
      location: 'Gudang Lab Terpadu',
    },
  ];

  findAll(query?: FindEquipmentQueryDto): Equipment[] {
    let result = [...this.equipmentList];

    if (query?.category) {
      result = result.filter((item) => item.category === query.category);
    }

    if (query?.keyword) {
      const keywordLower = query.keyword.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keywordLower) ||
          item.assetCode.toLowerCase().includes(keywordLower) ||
          item.location.toLowerCase().includes(keywordLower),
      );
    }

    if (query?.page || query?.limit) {
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const startIndex = (page - 1) * limit;
      return result.slice(startIndex, startIndex + limit);
    }

    return result;
  }

  findOne(id: number): Equipment {
    const equipment = this.equipmentList.find((item) => item.id === id);
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
    return equipment;
  }

  create(dto: CreateEquipmentDto): Equipment {
    const nextId = this.equipmentList.length
      ? Math.max(...this.equipmentList.map((item) => item.id)) + 1
      : 1;

    const newEquipment: Equipment = {
      id: nextId,
      ...dto,
    };

    this.equipmentList.push(newEquipment);
    return newEquipment;
  }

  update(id: number, dto: UpdateEquipmentDto): Equipment {
    const equipment = this.findOne(id);
    Object.assign(equipment, dto);
    return equipment;
  }

  remove(id: number): Equipment {
    const index = this.equipmentList.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('Equipment not found');
    }

    const [deleted] = this.equipmentList.splice(index, 1);
    return deleted;
  }
}
