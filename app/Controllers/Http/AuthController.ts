import Redis from "@ioc:Adonis/Addons/Redis";
import Mail from "@ioc:Adonis/Addons/Mail";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import { generateOTP } from "App/Utils/utils";
import Env from "@ioc:Adonis/Core/Env";

export default class AuthController {
  public async register({ request, routeKey }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        username: schema.string({}, [rules.alphaNum()]),
        email: schema.string({}, [rules.email()]),
        password: schema.string({}, [rules.minLength(6)]),
      }),
      cacheKey: routeKey,
    });

    const user = await User.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });

    return { status: "success", data: { user: user.serialize() } };
  }

  public async login({ request, routeKey, auth }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        email: schema.string(),
        password: schema.string(),
      }),
      cacheKey: routeKey,
    });

    const token = await auth
      .use("api")
      .attempt(payload.email, payload.password);

    return { status: "success", data: { token: token } };
  }

  public async startVerification({ request, routeKey }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        email: schema.string(),
      }),
      cacheKey: routeKey,
    });

    const otp = generateOTP(4);

    await Redis.set(otp, payload.email);

    console.log(`sending ${otp} to ${payload.email}`);

    await Mail.sendLater((message) => {
      message
        .from(Env.get("EMAIL_SENDER"))
        .to(payload.email)
        .subject("Verify Email!")
        .htmlView("emails/verify", { code: otp });
    });

    return { status: "success", data: { email: payload.email, otp } };
  }

  public async verify({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        code: schema.string(),
      }),
    });

    const email = await Redis.get(payload.code);
    if (email === null) {
      return response.status(400).send({
        status: "fail",
        data: { details: "invalid email verification code" },
      });
    }

    // just verify user email if user already exists
    const user = await User.findBy("email", email);
    if (user === null) {
      return response.status(400).send({
        status: "fail",
        data: { details: "user does not exist" },
      });
    }

    // set user to be verified and then update
    user.isVerified = true;
    user.save();

    return { status: "success", data: { user } };
  }
}
