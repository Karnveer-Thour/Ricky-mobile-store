import { Module } from "@nestjs/common";
import { paymentRepository } from "./Repositories/Payment.repo";

@Module({
    providers:[paymentRepository],
})
export class PaymentModule {}