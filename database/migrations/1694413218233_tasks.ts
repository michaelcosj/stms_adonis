import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "tasks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name");
      table.enum("tag", ["WORK", "STUDY", "OTHERS"], {
        useNative: true,
        enumName: "tag_enum",
        existingType: false,
      });
      table.boolean("priority").defaultTo(false);
      table.boolean("is_completed").defaultTo(false);
      table.string("description");
      table.dateTime("time_due", { useTz: true });
      table.dateTime("time_completed", { useTz: true });
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");

      table.index(["time_due", "time_completed"]);
    });
  }

  public async down() {
    this.schema.raw('DROP TYPE IF EXISTS "tag_enum"');
    this.schema.dropTable(this.tableName);
  }
}
