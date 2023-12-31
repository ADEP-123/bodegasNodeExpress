import { Expose, Type, Transform } from "class-transformer";

export class inventarios {
    @Expose({ name: "ID" })
    @Transform(({ value }) => parseInt(value) ? value : "Error", { toClassOnly: true })
    ID: number;

    @Expose({ name: "ID_BODEGA" })
    @Transform(({ value, key }) => { if (Math.floor(value) || value == null) return Math.floor(value); else throw { status: 400, message: `Error en tipo de parametro` } }, { toClassOnly: true })
    ID_BODEGA: number;

    @Expose({ name: "ID_PRODUCTO" })
    @Transform(({ value, key }) => { if (Math.floor(value) || value == null) return Math.floor(value); else throw { status: 400, message: `Error en tipo de parametro` } }, { toClassOnly: true })
    ID_PRODUCTO: number;

    @Expose({ name: "CANTIDAD" })
    @Transform(({ value, key }) => { if (Math.floor(value) || value == null) return Math.floor(value); else throw { status: 400, message: `Error en tipo de parametro` } }, { toClassOnly: true })
    CANTIDAD: number;

    @Expose({ name: "CREADOR" })
    @Transform(({ value, key }) => { if (Math.floor(value) || value == null) return Math.floor(value); else throw { status: 400, message: `Error en tipo de parametro` } }, { toClassOnly: true })
    CREADOR: number;

    @Expose({ name: "ACTUALIZADOR" })
    @Transform(({ value, key }) => { if (Math.floor(value) || value == null) return Math.floor(value); else throw { status: 400, message: `Error en tipo de parametro` } }, { toClassOnly: true })
    ACTUALIZADOR: number;

    @Expose({ name: "FECHA_CREACION" })
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    FECHA_CREACION: Date;

    @Expose({ name: "FECHA_ACTUALIZACION" })
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    FECHA_ACTUALIZACION: Date;

    @Expose({ name: "FECHA_ELIMINACION" })
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    FECHA_ELIMINACION: Date;



    constructor(id: number = 2, id_bodega: number = 1, id_producto: number = 1, cantidad: number = 1, created_by: number = 0, update_by: number = 0, created_at: Date = new Date(), updated_at: Date = new Date(), deleted_at: Date = new Date()) {
        this.ID = id;
        this.ID_BODEGA = id_bodega;
        this.ID_PRODUCTO = id_producto;
        this.CANTIDAD = cantidad;
        this.CREADOR = created_by;
        this.ACTUALIZADOR = update_by;
        this.FECHA_CREACION = created_at;
        this.FECHA_ACTUALIZACION = updated_at;
        this.FECHA_ELIMINACION = deleted_at;
    }
}