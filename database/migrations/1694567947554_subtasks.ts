import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "subtasks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name");
      table.boolean("is_completed").defaultTo(false);

      table.integer("duration");

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
      table
        .integer("task_id")
        .unsigned()
        .references("tasks.id")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
