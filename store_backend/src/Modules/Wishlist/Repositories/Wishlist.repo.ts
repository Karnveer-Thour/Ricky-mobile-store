import { BaseRepository } from "Common/Repositories/Base.repo";
import { Wishlist } from "../Entities/Wishlist.entity";
import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WishlistRepository extends BaseRepository<Wishlist>{
    constructor(private readonly dataSource:DataSource){
        super(Wishlist,dataSource);
    }
}