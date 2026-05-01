import dns from 'node:dns';
import mongoose, { Connection } from 'mongoose';

let cachedConnection: Connection | null = null;

export async function connectDB(): Promise<Connection> {
  if (cachedConnection) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  const uriDatabaseName = (() => {
    try {
      const parsed = new URL(mongoUri);
      return parsed.pathname.replace(/^\//, '') || '(default)';
    } catch {
      return '(unparseable)';
    }
  })();

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    cachedConnection = connection.connection;
    console.log(
      `Database connected successfully: ${cachedConnection.name} @ ${cachedConnection.host} (uri db: ${uriDatabaseName})`
    );
    return cachedConnection;
  } catch (error) {
    console.error('Database connection error:', error);

    if (error instanceof Error && error.message.includes('querySrv ECONNREFUSED')) {
      const previousDnsServers = dns.getServers();

      try {
        dns.setServers(['1.1.1.1', '8.8.8.8']);

        const connection = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 10000,
        });
        cachedConnection = connection.connection;
        console.log(
          `Database connected successfully after DNS fallback: ${cachedConnection.name} @ ${cachedConnection.host} (uri db: ${uriDatabaseName})`
        );
        return cachedConnection;
      } catch (retryError) {
        console.error('Database connection retry failed:', retryError);
        throw new Error(
          'MongoDB Atlas SRV lookup failed. Check that MONGODB_URI is a valid reachable Atlas connection string and that your network/DNS can resolve _mongodb._tcp records.'
        );
      } finally {
        dns.setServers(previousDnsServers);
      }
    }

    throw error;
  }
}
