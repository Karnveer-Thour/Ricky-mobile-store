import { Module } from "@nestjs/common";
import { UserRepository } from "./Repositories/User.repo";

@Module({
    imports: [],
    controllers: [],
    providers: [UserRepository],
})
export class UserModule {}
