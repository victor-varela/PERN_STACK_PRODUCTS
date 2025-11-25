import { db } from '../config/db'
import { connectDb } from '../server'

jest.mock('../config/db', () => {
  const dbMock = {
    authenticate: jest.fn(),
    sync: jest.fn(),
  };
  return { db: dbMock };   // 🔥 ESTA ES LA CLAVE
});

describe('connectToDatabase', () => {
  it('should handle database connection error', async () => {
    // ❗ Ahora sí db existe y tiene authenticate()
    jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Unable to connect to the database'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await connectDb();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unable to connect to the database:'),
      expect.any(Error)
    );

    expect(db.authenticate).toHaveBeenCalled();
  });
});


