import { Injectable, NotFoundException } from '@nestjs/common';
import { Lab, LabStatus } from './lab.interface';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { FindLabQueryDto } from './dto/find-lab-query.dto';

@Injectable()
export class LabsService {
  private readonly labs: Lab[] = [
    {
      id: 1,
      labCode: 'ROOM-EL-01',
      name: 'Lab Elektronika Dasar',
      building: 'Gedung A Lantai 2',
      capacity: 30,
      picName: 'Budi Santoso',
      status: LabStatus.ACTIVE,
    },
    {
      id: 2,
      labCode: 'ROOM-NW-01',
      name: 'Lab Jaringan Komputer',
      building: 'Gedung B Lantai 3',
      capacity: 40,
      picName: 'Siti Aminah',
      status: LabStatus.ACTIVE,
    },
    {
      id: 3,
      labCode: 'ROOM-MM-01',
      name: 'Lab Multimedia Kreatif',
      building: 'Gedung C Lantai 1',
      capacity: 35,
      picName: 'Ahmad Fauzi',
      status: LabStatus.UNDER_MAINTENANCE,
    },
  ];

  findAll(query?: FindLabQueryDto): Lab[] {
    let result = [...this.labs];

    if (query?.status) {
      result = result.filter((lab) => lab.status === query.status);
    }

    if (query?.keyword) {
      const keyword = query.keyword.toLowerCase();
      result = result.filter(
        (lab) =>
          lab.name.toLowerCase().includes(keyword) ||
          lab.labCode.toLowerCase().includes(keyword) ||
          lab.building.toLowerCase().includes(keyword),
      );
    }

    if (query?.page || query?.limit) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const startIndex = (page - 1) * limit;
      result = result.slice(startIndex, startIndex + limit);
    }

    return result;
  }

  findOne(id: number): Lab {
    const lab = this.labs.find((item) => item.id === id);
    if (!lab) {
      throw new NotFoundException('Lab not found');
    }
    return lab;
  }

  create(dto: CreateLabDto): Lab {
    const nextId = this.labs.length
      ? Math.max(...this.labs.map((item) => item.id)) + 1
      : 1;

    const newLab: Lab = {
      id: nextId,
      labCode: dto.labCode,
      name: dto.name,
      building: dto.building,
      capacity: dto.capacity,
      picName: dto.picName,
      status: dto.status ?? LabStatus.ACTIVE,
    };

    this.labs.push(newLab);
    return newLab;
  }

  update(id: number, dto: UpdateLabDto): Lab {
    const lab = this.findOne(id);
    Object.assign(lab, dto);
    return lab;
  }

  remove(id: number): Lab {
    const index = this.labs.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('Lab not found');
    }
    const [removedLab] = this.labs.splice(index, 1);
    return removedLab;
  }
}
