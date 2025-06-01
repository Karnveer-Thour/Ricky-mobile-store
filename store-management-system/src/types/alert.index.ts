export enum alertType{
    success="success",
    error="error"
}

export interface alert{
    type:alertType|null,
    message:string|null,
    id:number|null
}