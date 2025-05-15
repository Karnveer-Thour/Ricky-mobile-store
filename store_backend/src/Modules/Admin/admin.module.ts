import { Module } from "@nestjs/common";
import { AdminRepository } from "./Repositories/Admin.repo";

@Module({
    imports: [],
    controllers: [],
    providers: [AdminRepository],
})
export class AdminModule {}
