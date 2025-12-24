import Dexie, { Table } from 'dexie';

export interface Assessment {
  id: string;
  timestamp: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  symptoms: string[];
  isSynced: boolean;
}

class MaaSathiDB extends Dexie {
  assessments!: Table<Assessment>;

  constructor() {
    super('MaaSathiDB');
    this.version(1).stores({
      assessments: 'id, timestamp, isSynced'
    });
  }
}

export const db = new MaaSathiDB();
