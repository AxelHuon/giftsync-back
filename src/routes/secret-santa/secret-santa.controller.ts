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
      await this.assignSecretSanta(users, body.maxPrice, body.title);
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
    html: string,
  ): Promise<void> {
    await transport.sendMail({
      from: "noreply@giftsync.fr",
      to,
      subject,
      html,
    });
  }

  private shuffleUsers(users: UserSecretSanta[]): UserSecretSanta[] {
    return [...users].sort(() => Math.random() - 0.5);
  }

  private generateEmailContent(
    giver: UserSecretSanta,
    receiver: UserSecretSanta,
    maxPrice: number,
    title: string,
  ): string {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Secret Santa - ${title}</title>
    </head>
    <body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; color: #1F1F1F;">
        <div style="text-align: center; padding-top: 20px; padding-bottom: 20px;">
            <img src="https://www.giftsync.fr/images/gslogo.png" alt="Logo" style="width: 250px; max-width: 100%; height: auto; margin-bottom: 20px;">
            <h1 style="color: #4747FF; margin: 0; font-size: 24px; font-weight: bold;">${title} - Secret Santa</h1>
        </div>
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin-bottom: 15px;">Bonjour <strong style="font-weight: bold;">${giver.name}</strong>,</p>
            <p style="margin-bottom: 15px;">Vous avez été choisi pour offrir un cadeau à <strong style="font-weight: bold;">${receiver.name}</strong> pour le Secret Santa.</p>
            <p style="margin-bottom: 15px;">Le prix maximum du cadeau est fixé à <strong style="font-weight: bold;">${maxPrice}€</strong>.</p>
            <p style="margin-bottom: 15px;">Joyeuses fêtes et amusez-vous bien !</p>
        </div>
    </body>
    </html>
  `;
  }

  private async assignSecretSanta(
    users: UserSecretSanta[],
    maxPrice: number,
    title: string,
  ): Promise<void> {
    const shuffled = this.shuffleUsers(users);
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];
      console.log(`Giver: ${giver.name} - Receiver: ${receiver.name}`);
      const htmlContent = this.generateEmailContent(
        giver,
        receiver,
        maxPrice,
        title,
      );
      await this.sendEmail(giver.email, "Secret Santa - " + title, htmlContent);
    }
  }
}
