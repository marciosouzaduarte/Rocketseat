import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UsersController {
  public async update(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(UpdateUserAvatarService);

    const user = await service.execute({
      user_id: request.user.id,
      avatar_filename: request.file.filename,
    });

    return response.send(user);
  }
}
