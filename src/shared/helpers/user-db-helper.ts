import {User} from "../../modules/user/schemas/user.entity";
import {Injector} from "@nestjs/core/injector/injector";
import {Repository} from "typeorm";

export class UserDBHelper {
    public static async addColumn(columnName: string, handler: (user: User) => User): Promise<void> {
        const userRepo = new Repository<User>();
        const users = await userRepo.find({withDeleted: true});

        users.map(user => {
            return handler(user);
        });

        await userRepo.save(users);
    }

    // public static async restoreSoftDeleted(): Promise<void> {
    //     const userRepo = new Repository<User>();
    //     const users = await userRepo.find({ withDeleted: true});
    //     const deletedIds = users.filter(u => u.deletedAt).map(u => u.id);
    //     await userRepo.restore(deletedIds);
    // }
}
