import {MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../modules/user/schemas/user.entity";
import {UserDBHelper} from "../shared/helpers/user-db-helper";

export class AddSuspended1642746627061 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        try {

            // await UserDBHelper.addColumn('suspendedAt');
        }
        catch (e) {
        }
    }

    async down(queryRunner: QueryRunner): Promise<void> {
    }


}