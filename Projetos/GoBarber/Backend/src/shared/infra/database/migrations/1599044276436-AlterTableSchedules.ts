import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterTableSchedules1599044276436
  implements MigrationInterface {
  constructor(private tableName = 'SCHEDULES') {}

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, 'provider');

    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: 'provider_id',
        type: 'varchar',
        length: '200',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: 'SchedulesProvider',
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'USERS',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, 'SchedulesProvider');

    await queryRunner.dropColumn(this.tableName, 'provider_id');

    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: 'provider',
        type: 'varchar',
        length: '200',
        isNullable: true,
      }),
    );
  }
}
