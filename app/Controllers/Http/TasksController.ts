import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { DateTime } from "luxon";
import Task from "App/Models/Task";

export default class TasksController {
  public async index({ auth, request }: HttpContextContract) {
    const user = auth.use("api").user;
    const tasks = await user?.related("tasks").query();

    if (!tasks || tasks === []) {
      return { status: "success", data: { tasks: [] } };
    }

    const {
      is_completed: done_filter,
      priority: priority_filter,
      id: id_filter,
      tag: tags_filter,
    } = request.qs();

    // filter tags based on query params
    let filtered: Task[] = [];
    for (const task of tasks) {
      let done_match = done_filter === undefined;
      let tag_match = tags_filter === undefined;
      let priority_match = priority_filter === undefined;
      let id_match = id_filter === undefined;

      if (!id_match) {
        // id
        let id = "";
        if (Array.isArray(id_filter)) {
          id = id_filter[0];
        } else {
          id = id_filter;
        }

        id_match = task.id === Number(id);
      }

      if (!done_match) {
        // completed
        let completed = "";
        if (Array.isArray(done_filter)) {
          completed = done_filter[0];
        } else {
          completed = done_filter;
        }

        done_match = task.isCompleted === (completed === "true");
      }

      if (!priority_match) {
        // priority
        let priority = "";
        if (Array.isArray(priority_filter)) {
          priority = priority_filter[0];
        } else {
          priority = priority_filter;
        }

        priority_match = Boolean(task.priority) === (priority === "true");
      }

      if (!tag_match) {
        // task
        let tags: string[];
        if (!Array.isArray(tags_filter)) {
          tags = [tags_filter];
        } else {
          tags = tags_filter;
        }

        for (const t of tags) {
          if (task.tag.toLowerCase() === t) {
            tag_match = true;
            break;
          }
        }
      }

      if (tag_match && priority_match && id_match && done_match) {
        filtered.push(task);
        continue;
      }
    }

    return { status: "success", data: { tasks: filtered } };
  }

  public async store({ auth, request, routeKey }: HttpContextContract) {
    const user = auth.use("api").user;

    const payload = await request.validate({
      schema: schema.create({
        name: schema.string([rules.minLength(3)]),
        tag: schema.enum(["study", "classes", "others"]),
        time_due: schema.date(),
        description: schema.string.optional(),
        priority: schema.boolean.optional(),
      }),
      cacheKey: routeKey,
    });

    const task = await Task.create({
      name: payload.name,
      tag: payload.tag.toUpperCase(),
      timeDue: payload.time_due,
      description: payload.description || "",
      priority: payload.priority || false,
      userId: user?.id,
    });

    return { status: "success", data: { task } };
  }

  public async show({ auth, request, response }: HttpContextContract) {
    const user = auth.use("api").user;

    const taskID: number = request.param("id");
    const task = await user
      ?.related("tasks")
      .query()
      .where("id", taskID)
      .first();

    if (!task) {
      return response.notFound({
        status: "fail",
        data: { details: "task not found" },
      });
    }

    return { status: "success", data: { todo: task } };
  }

  public async update({
    auth,
    request,
    response,
    routeKey,
  }: HttpContextContract) {
    const user = auth.use("api").user;
    const taskID: number = request.param("id");

    const payload = await request.validate({
      schema: schema.create({
        name: schema.string.optional([rules.minLength(3)]),
        tag: schema.enum.optional(["study", "classes", "others"]),
        time_due: schema.date.optional(),
        description: schema.string.optional(),
        priority: schema.boolean.optional(),
        is_completed: schema.boolean.optional(),
      }),
      cacheKey: routeKey,
    });

    const task = await user
      ?.related("tasks")
      .query()
      .where("id", taskID)
      .first();

    if (!task) {
      return response.notFound({
        status: "fail",
        data: { details: "task not found" },
      });
    }

    if (payload.is_completed) {
      task.timeCompleted = DateTime.now();
    }

    const updated_task = await task?.merge(payload).save();

    return { status: "success", data: { task: updated_task } };
  }

  public async destroy({ auth, request }: HttpContextContract) {
    const user = auth.use("api").user;

    const taskId: number = request.param("id");
    const task = await user
      ?.related("tasks")
      .query()
      .where("id", taskId)
      .first();

    await task?.delete();

    return { status: "success", data: null };
  }
}
