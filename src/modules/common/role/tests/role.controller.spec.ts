import { Test, TestingModule } from '@nestjs/testing';
import {RoleController} from "../role.controller";


describe('RoleController', () => {
    let roleController: RoleController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [RoleController],
        }).compile();

        roleController = app.get<RoleController>(RoleController);
    });

    describe('roles', () => {
        it('should return list of roles', () => {
            expect(roleController.getRoles()).toBe('Hello World!');
        });
    });
});
