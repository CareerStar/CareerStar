from psycopg2 import pool
from contextlib import contextmanager


class ConnectionPool(pool.SimpleConnectionPool):
    @contextmanager
    def connection(self):
        conn = self.getconn()
        try:
            yield conn
        finally:
            self.putconn(conn)
