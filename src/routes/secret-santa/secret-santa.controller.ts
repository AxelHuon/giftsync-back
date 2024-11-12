import {
  Body,
  Controller,
  Middlewares,
  Post,
  Request,
  Res,
  Route,
  Tags,
  TsoaResponse,
} from "tsoa";
import transport from "../../mailConfig/mailConfig";
import { validationBodyMiddleware } from "../../middleware/validation.middleware";
import { ErrorResponse } from "../../types/Error";
import {
  SecretSantaRequest,
  SecretSantaResponse,
  UserSecretSanta,
} from "./secret-santa.interface";

require("dotenv").config();

@Tags("Secret Santa")
@Route("secret-santa")
export class SecretSantaController extends Controller {
  @Post()
  @Middlewares([validationBodyMiddleware(SecretSantaRequest)])
  public async postSecretSanta(
    @Body() body: SecretSantaRequest,
    @Request() req: any,
    @Res() errorResponse: TsoaResponse<400 | 401 | 404 | 500, ErrorResponse>,
  ): Promise<SecretSantaResponse> {
    try {
      const users = body.users;

      if (users.length < 2) {
        return errorResponse(400, {
          message: "Il faut au moins deux participants pour le Secret Santa.",
          code: "invalid_participant_count",
        });
      }
      await this.assignSecretSanta(users, body.maxPrice);
      return {
        message: "Secret Santa request has been created and emails sent",
        code: 200,
      };
    } catch (err) {
      console.error(err);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    await transport.sendMail({
      from: "contact@axelhuon.fr",
      to,
      subject,
      text,
    });
  }

  private shuffleUsers(users: UserSecretSanta[]): UserSecretSanta[] {
    return [...users].sort(() => Math.random() - 0.5);
  }

  private async assignSecretSanta(
    users: UserSecretSanta[],
    maxPrice: number,
  ): Promise<void> {
    const shuffled = this.shuffleUsers(users);
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];
      console.log(`Giver: ${giver.name} - Receiver: ${receiver.name}`);
      await this.sendEmail(
        giver.email,
        "Votre assignation Secret Santa",
        `Bonjour ${giver.name}, vous devez offrir un cadeau à ${receiver.name} pour le Secret Santa. Le prix maximum est de ${maxPrice}€.`,
      );
    }
  }
}
