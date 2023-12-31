import getConnection from "../db/database.js";
import 'reflect-metadata';
import { plainToClass } from "class-transformer";
import { productos } from '../controllerTS/productos.js';
import { bodegas } from "../controllerTS/bodegas.js";
import { inventarios } from "../controllerTS/inventarios.js";
const connection = getConnection();


//4. QUERY QUE PERMITE LISTAR TODAS LAS BODEGAS ORDENADAS ALFABETICAMENTE
const getStorageNames = (req, res) => {
    connection.query(/*sql*/`SELECT id AS Id, nombre AS Nombre, id_responsable AS Responsable, estado AS Estado, created_by AS Creado_por, update_by AS Actualizado_por FROM bodegas ORDER BY nombre`, (err, data, fil) => {
        if (err) {
            res.send(err)
        } else {
            res.json(data)
        }
    });
}

//5. QUERY QUE PERMITE CREAR UNA BODEGA
/**
 * ? Datos de entrada : 
 ** {
 **"NOMBRE": Varchar ej ("Emily"),
 **"RESPONSABLE": Entero grande, debe coincidir con un id existente de la tabla users ej (11),
 **"ESTADO": Entero ej (1),
 **"CREADOR": Entero grande, debe coincidir con un id existente de la tabla users ej (11),
 **"ACTUALIZADOR": Entero grande, debe coincidir con un id existente de la tabla users ej (11),
 **"FECHA_CREACION": Date-Time ej ("2023-05-25 01:02:57"),
 **"FECHA_ACTUALIZACION": Date-Time ej ("2023-05-25 01:02:57"),
 **"FECHA_ELIMINACION": Date-Time ej ("2023-05-25 01:02:59")
 ** }
 */
const postBodegas = (req, res) => {

    const { NOMBRE, RESPONSABLE, ESTADO, CREADOR, ACTUALIZADOR, FECHA_CREACION, FECHA_ACTUALIZACION, FECHA_ELIMINACION } = req.body;

    const bodega = plainToClass(bodegas, {
        NOMBRE,
        RESPONSABLE,
        ESTADO,
        CREADOR,
        ACTUALIZADOR,
        FECHA_CREACION,
        FECHA_ACTUALIZACION,
        FECHA_ELIMINACION
    })

    connection.query(/*sql*/`
      INSERT INTO bodegas (nombre, id_responsable, estado, created_by, update_by, created_at, updated_at, deleted_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            bodega.NOMBRE,
            bodega.RESPONSABLE,
            bodega.ESTADO,
            bodega.CREADOR,
            bodega.ACTUALIZADOR,
            bodega.FECHA_CREACION,
            bodega.FECHA_ACTUALIZACION,
            bodega.FECHA_ELIMINACION
        ],
        (err, data, fil) => {
            if (err) {
                res.send(err);
            } else {

                res.json({ message: 'Data ingresada con exito', data: data });
            }
        }
    );
}


//6. QUERY QUE PERMITE LISTAR PRODUCTOS EN ORDEN DESCENDENTE POR EL CAMPO TOTAL
const getAllProducts = (req, res) => {
    connection.query(/*sql*/`SELECT id_producto AS ID, SUM(cantidad) AS Total
    FROM inventarios
    GROUP BY id_producto
    ORDER BY Total DESC`, (err, data, fil) => {
        if (err) {
            res.send(err)
        } else {
            res.json(data)
        }
    });
}

//7. QUERY QUE PERMITA INSERTAR UN PRODUCTO Y ASIGNE UNA CANTIDAD INICIAL DEL MISMO EN LA TABLA INVENTARIOS EN UNA DE LAS BODEGAS POR DAFAULT
/**
 * ? Datos de entrada : 
 ** {
 **"NOMBRE": Varchar ej ("Nombre del Producto"),
 **"DESCRIPCION": Varchar ej ("Descripción del Producto"),
 **"ESTADO": Entero ej (1),
 **"CREADOR": Entero grande, debe coincidir con un id existente de la tabla users ej (11),
 **"ACTUALIZADOR": Entero grande, debe coincidir con un id existente de la tabla users ej (11)
 ** }
 *? La bodega determinada a la que llegara es la 60, y la cantidad predeterminada es 10
 */
const newProduct = (req, res) => {
    const { NOMBRE, DESCRIPCION, ESTADO, CREADOR, ACTUALIZADOR } = req.body;
    const producto = plainToClass(productos, {
        NOMBRE,
        DESCRIPCION,
        ESTADO,
        CREADOR,
        ACTUALIZADOR
    })

    connection.query(/*SQL*/`
    INSERT INTO productos (nombre, descripcion, estado, created_by, update_by) VALUES (?, ?, ?, ?, ?)`, [
        producto.NOMBRE,
        producto.DESCRIPCION,
        producto.ESTADO,
        producto.CREADOR,
        producto.ACTUALIZADOR
    ], (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const idProducto = data.insertId
            connection.query(/*sql*/`
             INSERT INTO inventarios (id_bodega, id_producto, cantidad, created_by, update_by) VALUES (50, ?, 10, ?, ?)`,
                [idProducto, CREADOR, ACTUALIZADOR],
                (err, data) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.json({ message: 'Producto creado exitosamente' });
                    }
                }
            );
        }
    }
    );
};

//8. QUERY QUE PERMITA INSERTAR REGISTROS EN LA TABLA INVENTARIOS, DEBE VALIDAR SI LA COMBINACION BODEGA PRODUCTO YA EXISTE
/**
 * ? Datos de entrada : 
 ** {
 **"ID_PRODUCTO": Entero Grande ej (11),
 **"ID_BODEGA": Entero Grande ej (12),
 **"CANTIDAD": Entero  ej (60)
 ** }
 */
const newInventario = (req, res) => {
    const { ID_PRODUCTO, ID_BODEGA } = req.query;
    const { CANTIDAD } = req.body;

    connection.query(/*SQL*/`
    SELECT * FROM inventarios WHERE id_bodega = ${ID_BODEGA} AND id_producto = ${ID_PRODUCTO}`, (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const existe = data[0] == null ? false : true
            if (existe == true) {
                connection.query(/*sql*/`
                UPDATE inventarios SET cantidad = ${CANTIDAD} WHERE id_bodega = ${ID_BODEGA} AND id_producto = ${ID_PRODUCTO}`, (err, data) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.json({
                            Existe: existe,
                            message: 'Inventario actualizado exitosamente'
                        });
                    }
                }
                );
            } else {
                connection.query(/*sql*/`
                INSERT INTO inventarios (id_bodega, id_producto, cantidad) VALUES (?,?,?)`, [ID_BODEGA, ID_PRODUCTO, CANTIDAD
                ], (err, data) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else {
                        res.json({
                            Existe: existe,
                            message: 'Inventario creado exitosamente'
                        });
                    }
                }
                );
            }
        }
    }
    );
};

//9. QUERY QUE PERMITA TRASLADAR CANTIDADES DE UN PRODUCTO DE UNA BODEGA A OTRA, DEBE VALIDAD QUE LA CANTIDAD A TRASLADAR EXISTA EN AL BODEGA DE DONDE SALE SI NO ENVIAR UN MENSAJE
/**
 * ? Datos de entrada : 
 ** {
 **"ID_PRODUCTO": Entero Grande ej (11),
 **"ID_BODEGA1": (Bodega de donde sale) Entero Grande ej (12),
 **"ID_BODEGA2": (Bodega a donde entra) Entero Grande ej (12),
 **"CANTIDAD": Entero  ej (60)
 ** }
 */
const trasladoBodega = (req, res) => {

    const { ID_PRODUCTO, ID_BODEGA1, ID_BODEGA2, CANTIDAD, } = req.body;

    connection.query(/*SQL*/`
    SELECT * FROM inventarios WHERE id_bodega = ${ID_BODEGA1} AND id_producto = ${ID_PRODUCTO}`, (err, data) => {
        if (err) {
            console.log("hay error en el primero");
            res.status(500).json({ error: err.message });
        } else {
            const existe1 = data[0] == null ? false : true
            if (existe1 == true) {
                const cantBodOrig = data[0].cantidad;
                // res.json({
                //     data: data,
                //     cantidadEnBodegaOrigen: cantBodOrig
                // })
                if (cantBodOrig < CANTIDAD) {
                    res.json({ message: `La bodega de origen solo contiene ${cantBodOrig} de dicho producto` })
                } else {
                    connection.query(/*sql*/`
                    SELECT id_bodega FROM inventarios WHERE id_producto = ${ID_PRODUCTO}`, (err, data) => {
                        if (err) {
                            res.status(500).json({ error: err.message });
                        } else {
                            let existeEnBodDest = false
                            data.forEach(element => {
                                if (element.id_bodega == ID_BODEGA2) {
                                    existeEnBodDest = true
                                }
                            });
                            if (existeEnBodDest == true) {
                                connection.query(/*sql*/`
                                UPDATE inventarios SET cantidad = cantidad - ${CANTIDAD} WHERE id_bodega = ${ID_BODEGA1} AND id_producto = ${ID_PRODUCTO}`, (err, data) => {
                                    if (err) {
                                        res.status(500).json({ error: err.message });
                                    } else {
                                        connection.query(/*sql*/`
                                        UPDATE inventarios SET cantidad = cantidad + ${CANTIDAD} WHERE id_bodega = ${ID_BODEGA2} AND id_producto = ${ID_PRODUCTO}`, (err, data) => {
                                            if (err) {
                                                res.status(500).json({ error: err.message });
                                            } else {
                                                res.json({ message: `${CANTIDAD} del producto ${ID_PRODUCTO} movido existosamente de la bodega ${ID_BODEGA1} a la bodega ${ID_BODEGA2}` });
                                            }
                                        }
                                        );
                                    }
                                }
                                );
                            } else {
                                connection.query(/*sql*/`
                                SELECT * FROM bodegas WHERE id = ${ID_BODEGA2}`, (err, data) => {
                                    if (err) {
                                        res.status(500).json({ error: err.message });
                                    } else {
                                        const existe2 = data[0] == null ? false : true
                                        if (existe2 == true) {
                                            connection.query(/*sql*/`
                                            UPDATE inventarios SET cantidad = cantidad - ${CANTIDAD} WHERE id_bodega = ${ID_BODEGA1} AND id_producto = ${ID_PRODUCTO}`, (err, data) => {
                                                if (err) {
                                                    res.status(500).json({ error: err.message });
                                                } else {
                                                    connection.query(/*sql*/`
                                                    INSERT INTO inventarios (id,id_bodega, id_producto, cantidad) VALUES (100,?,?,?)`, [ID_BODEGA2, ID_PRODUCTO, CANTIDAD], (err, data) => {
                                                        if (err) {
                                                            res.status(500).json({ error: err.message, aca: "aca" });
                                                        } else {
                                                            res.json({ message: `${CANTIDAD} del producto ${ID_PRODUCTO} movido existosamente de la bodega ${ID_BODEGA1} a la bodega ${ID_BODEGA2}` });
                                                        }
                                                    }
                                                    );
                                                }
                                            }
                                            );
                                        } else {
                                            res.json({ message: `La bodega destino (${ID_BODEGA2}) no existe, primero debe crearla` });
                                        }
                                    }
                                }
                                );
                            }
                        }
                    }
                    );
                }
            } else {
                res.json({ message: `La bodega origen (${ID_BODEGA1}) no existe o no tiene un producto con ese id (${ID_PRODUCTO})` });
            }
        }
    }
    );
};


export const methodsHTTP = {
    getAllProducts: getAllProducts,
    getStorageNames: getStorageNames,
    postBodegas: postBodegas,
    newProduct: newProduct,
    newInventario: newInventario,
    trasladoBodega: trasladoBodega
}

