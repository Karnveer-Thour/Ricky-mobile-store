import { BaseEntity } from "Common/Entities/Base.entity";
import { Customer } from "Modules/Customer/Entities/Customer.entity";
import { Product } from "Modules/Product/Entities/Product.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

export enum status{
  PENDING = 'PENDING',             
  CONFIRMED = 'CONFIRMED',         
  SHIPPED = 'SHIPPED',             
  IN_TRANSIT = 'IN_TRANSIT',       
  DELIVERED = 'DELIVERED',         
  CANCELLED = 'CANCELLED',        
  RETURN_REQUESTED = 'RETURN_REQUESTED', 
  RETURNED = 'RETURNED',           
  FAILED = 'FAILED', 
}

@Entity()
@Index(["buyer","product","status"])
export class Sale extends BaseEntity<Sale>{

    @ManyToOne(()=>Customer,customer=>customer.sales,{eager:true})
    @JoinColumn({name:"buyerId"})
    buyer:Customer;

    @ManyToOne(()=>Product,product=>product.sales,{eager:true})
    @JoinColumn({name:"productId"})
    product:Product;

    @Column({name:"status",type:"enum",enum:status,nullable:false})
    status:status;
}