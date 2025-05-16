import { Exclude, Expose } from "class-transformer";
import { BaseEntity } from "Common/Entities/Base.entity";
import { birthToAge } from "Common/Utils/Utils";
import { Address } from "../../Address/Entities/Address.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { DeliveryAddress } from "Modules/Delivery_address/Entities/DeliveryAddress.entity";
import { ProductReview } from "Modules/Product_review/Entitities/ProductReview.entity";
import { Sale } from "Modules/Sale/Entities/Sale.entity";
import { Chat } from "Modules/Chat/Entities/Chat.entity";
import { Cart } from "Modules/Cart/Entities/Cart.entity";
import { Wishlist } from "Modules/Wishlist/Entities/Wishlist.entity";
import { Payment } from "Modules/Payment/Entities/Payment.entity";

export enum role{
    Admin="Admin",
    Customer="Customer"
}

@Entity()
@Index([
    "firstName",
    "lastName",
    "email",
    "mobileNumber",
    "password",
    "pictureUrl",
    "role",
    "dateBirth",
])
export class User extends BaseEntity<User> {
    @Column({
        name: "firstName",
        type: "varchar",
        length: 25,
        nullable: false,
    })
    firstName: string;

    @Column({
        name: "lastName",
        type: "varchar",
        length: 25,
        nullable: false,
    })
    lastName: string;

    @Column({
        name: "email",
        type: "varchar",
        length: 254,
        nullable: false,
    })
    email: string;

    @Column({
        name: "mobileNumber",
        type: "varchar",
        length: 25,
        nullable: true,
    })
    mobileNumber: string;

    @Column({
        name: "password",
        type: "varchar",
        length: 255,
        nullable: false,
    })
    @Exclude()
    password: string;

    @Column({name:"pictureUrl",type:"varchar",length:255,nullable:true})
    pictureUrl:string;

    @Column({name:"role",type:"enum",enum:role,nullable:false})
    role:role;

    @OneToOne(() => Address,address=>address.userAddress, { cascade: true, eager: true })
    @JoinColumn({ name: "addressId" }) // this should match the foreign key column name
    address: Address;

    @Column({ name: "dateBirth", type: "date", nullable: false })
    dateBirth: Date;

    @Expose()
    get age(): number | null {
        return birthToAge(this.dateBirth);
    }

    // Inverse relations
    @OneToOne(()=>Cart,cart=>cart.cartOwner)
    cart:Cart;

    @OneToMany(() => DeliveryAddress, deliveryAddress => deliveryAddress.customer)
    deliveryAddress: DeliveryAddress[];

    @OneToMany(() => ProductReview, (reviews) => reviews.reviewedBy)
    reviews: ProductReview[];

    @OneToMany(()=>Sale,sales=>sales.buyer)
    sales:Sale[];

    @OneToMany(()=>Chat,sendedChats=>sendedChats.senderId)
    sendedChats:Chat[];
    
    @OneToMany(()=>Chat,recievedMessages=>recievedMessages.receiverId)
    recievedMessages:Chat[];

    @OneToMany(()=>Payment,recievedAmounts=>recievedAmounts.buyer)
    recievedAmounts:Payment[];

    @ManyToOne(()=>Wishlist,wishlists=>wishlists.wisher)
    wishlists:Wishlist[];
}
