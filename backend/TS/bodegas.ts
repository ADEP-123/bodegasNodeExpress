import { Expose, Type, Transform } from "class-transformer";

export class bodegas {
    @Expose({ name: "ID" })
    @Transform(({ value }) => parseInt(value) ? value : "Error", { toClassOnly: true })
    ID: number;

    @Expose({ name: "NOMBRE" })
    @Transform(({ value, key }) => { if (/^[a-z A-Z]+$/.test(value) || value == null) return value; else throw { status: 400, message: `Error en tipo de parametro` } }, { toClassOnly: true })
    NOMBRE: string;

    @Expose({ name: "RESPONSABLE" })
    @Transform(({ value, key }) => { if (Math.floor(value) || value == null) return Math.floor(value); else throw { status: 400, message: `Error en tipo de parametro` } }, { toClassOnly: true })
    RESPONSABLE: number;

    @Expose({ name: "ESTADO" })
    @Transform(({ value, key }) => { if (Math.floor(value) || value == null) return Math.floor(value); else throw { status: 400, message: `Error en tipo de parametro` } }, { toClassOnly: true })
    ESTADO: number;

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



    constructor(id: number, nombre: string, id_responsable: number, estado: number, created_by: number, update_by: number, created_at: Date, updated_at: Date, deleted_at: Date) {
        this.ID = id;
        this.NOMBRE = nombre;
        this.RESPONSABLE = id_responsable;
        this.ESTADO = estado;
        this.CREADOR = created_by;
        this.ACTUALIZADOR = update_by;
        this.FECHA_CREACION = created_at;
        this.FECHA_ACTUALIZACION = updated_at;
        this.FECHA_ELIMINACION = deleted_at;
    }
}