import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Subtask from "./SubTask";

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public tag: string;

  @column()
  public priority: boolean;

  @column()
  public isCompleted: boolean;

  @column()
  public percentage_complete: Number;

  @column()
  public description: string;

  @column.dateTime()
  public startTime: DateTime;

  @column.dateTime()
  public finishTime: DateTime;

  @column.dateTime()
  public endTime: DateTime;

  @column()
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @hasMany(() => Subtask)
  public subTasks: HasMany<typeof Subtask>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
