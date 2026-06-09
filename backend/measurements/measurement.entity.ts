import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  humidity: number;

  @Column('float')
  temperature: number;

  @Column('int')
  radonShortTermAvg: number;

  @Column('int')
  radonLongTermAvg: number;

  @CreateDateColumn()
  createdAt: Date;
}
