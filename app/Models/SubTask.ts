import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Task from "./Task";

export default class Subtask extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public isCompleted: boolean;

  @column()
  public duration: Number;

  @column()
  public taskId: number;

  @belongsTo(() => Task)
  public task: BelongsTo<typeof Task>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
