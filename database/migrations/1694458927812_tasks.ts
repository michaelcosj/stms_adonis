import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "tasks";

  public async up() {
    this.schema.alterTable(this.tableName, (_) => {
      this.db.rawQuery("ALTER TYPE tag_enum RENAME VALUE 'WORK' TO 'CLASSES'");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
