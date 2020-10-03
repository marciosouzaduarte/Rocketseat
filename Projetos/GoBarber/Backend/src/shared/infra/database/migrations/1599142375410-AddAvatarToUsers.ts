import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAvatarToUsers1599142375410
  implements MigrationInterface {
  constructor(private tableName = 'USERS') {}

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, 'avatar');
  }
}
