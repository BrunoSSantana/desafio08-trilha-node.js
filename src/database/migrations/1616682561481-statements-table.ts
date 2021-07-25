import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class accountsTable1616682561481 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'statements',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
        },
        {
          name: 'received_id',
          type: 'uuid',
        },
        {
          name: 'send_id',
          type: 'uuid',
        },
        {
          name: 'description',
          type: 'varchar',
        },
        {
          name: 'amount',
          type: 'decimal',
          precision: 5,
          scale: 2,
        },
        {
          name: 'type',
          type: 'enum',
          enum: ['deposit', 'withdraw', 'transfer']
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()'
        }
      ],
      foreignKeys: [
        {
          name: 'statements',
          columnNames: ['received_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        {
          name: 'transfers',
          columnNames: ['send_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('statements');
  }

}
