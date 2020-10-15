import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import UsersModel from '@models/UsersModel';

@Entity('SCHEDULES')
export default class SchedulesModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // coluna
  @Column('varchar')
  provider_id: string;

  // relacionamento
  @ManyToOne(() => UsersModel)
  @JoinColumn({ name: 'provider_id' })
  provider: UsersModel;

  // coluna
  @Column('varchar')
  user_id: string;

  // relacionamento
  @ManyToOne(() => UsersModel)
  @JoinColumn({ name: 'user_id' })
  user: UsersModel;

  @Column('time with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
