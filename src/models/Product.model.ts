import { Table, Column, DataType, Model, Default } from "sequelize-typescript";

@Table({
  tableName: "products",
})

//Model es una clase por eso se define con llaves.. ahi estan sus propiedades y sus metodos.
class Product extends Model {
  // Aquí definís las columnas y/o métodos del modelo
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;
  @Column({
    type: DataType.FLOAT,
  })
  declare price: number;
  @Default(true) //siempre al crear un producto esta disponible.
  @Column({
    type: DataType.BOOLEAN,
  })
  declare availability: boolean;
}

export default Product;

/*
- Gracias a que tenemos Sequelize-typescript podemos usar los decoradores de sequelize @table @column, etc. Los decoradores en Sequelize describen la estructura del modelo,
y Sequelize luego traduce eso a SQL (cuando sincroniza con la DB). Los decoradores son funciones. 

- Sequelize se hizo con POO con clases-- React avanzo de clases a hooks

- EL @Column hay que asignarle un type sino Ts se queja. Por eso @Column({type: DataType.'tipo'})

-OJALDRE: segui los pasos del curso y sabia que esto se rompia cuando intentaba hacer la conexion con la DB segun los comentarios de los estudiantes, sin embargo lo hice como estaba en el curso y LEI el error que decia Error: No default export defined for file "Product.model" or export does not satisfy filename. --> entonces escribi export default Product en lugar de lo que tenia: export class Product ... y funciono. Leer los errores Victorino, leer los e rr o res

- La estructura de sequeliza para los modelos estan en los ejemplos de la documentacion sequelize-typescript.  https://sequelize.org/docs/v6/other-topics/typescript/






*/
