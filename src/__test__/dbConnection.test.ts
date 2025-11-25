// Importamos la base de datos real (pero será reemplazada por el mock más abajo)
import { db } from '../config/db';

// Importamos la función real que vamos a testear
import { connectDb } from '../server';

/**
 * MOCK DE LA BASE DE DATOS
 * -------------------------
 * Jest reemplaza el módulo '../config/db' completo por un mock.
 * El mock debe exportar { db: {...} } porque en el código real
 * el archivo db.ts exporta "export const db = ..." ─ NO UN DEFAULT.
 */
jest.mock('../config/db', () => {
  // Creamos un objeto db falso con las funciones que usa connectDb()
  const dbMock = {
    authenticate: jest.fn(), // luego lo forzaremos a fallar
    sync: jest.fn(),
  };

  return {
    // 🔥 PUNTO CLAVE: el mock debe exportar "db", no "default"
    db: dbMock,
  };
});

/**
 * TEST DEL MANEJO DE ERROR DE CONEXIÓN
 * ------------------------------------
 * Validamos que connectDb() capture correctamente un error
 * cuando authenticate() falla.
 */
describe('connectToDatabase', () => {
  it('should handle database connection error', async () => {
    
    /**
     * MOCK: forcing db.authenticate() to fail
     * Esto simula un error real de conexión a la Base de Datos.
     */
    jest
      .spyOn(db, 'authenticate')  // tomamos la función mockeada
      .mockRejectedValueOnce(new Error('Unable to connect to the database'));

    /**
     * Espiamos console.error
     * -----------------------
     * Para que:
     * 1. No ensucie el output del test.
     * 2. Podemos verificar después que fue llamado correctamente.
     */
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Ejecutamos la función real que estamos testando
    await connectDb();

    /**
     * ASSERT: verificamos que connectDb() realmente capturó el error
     * y llamó a console.error con el mensaje esperado.
     */
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unable to connect to the database:'),
      expect.any(Error)
    );

    // Verificamos que authenticate() haya sido llamado
    expect(db.authenticate).toHaveBeenCalled();
  });
});


