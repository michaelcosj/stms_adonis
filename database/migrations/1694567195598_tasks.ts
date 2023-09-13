import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "tasks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name");
      table.enum("tag", ["CLASSES", "STUDY", "OTHERS"], {
        useNative: true,
        enumName: "tag_enum",
        existingType: true,
      });
      table.string("description");
      table.boolean("priority").defaultTo(false);

      table.boolean("is_completed").defaultTo(false);
      table.integer("percentage_complete").defaultTo(0);

      table.dateTime("start_time", { useTz: true });
      table.dateTime("end_time", { useTz: true });
      table.datetime("finish_time", { useTz: true });

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");

      table.index(["end_time", "finish_time"]);
    });
  }

  public async down() {
    this.schema.raw('DROP TYPE IF EXISTS "tag_enum"');
    this.schema.dropTable(this.tableName);
  }
}
