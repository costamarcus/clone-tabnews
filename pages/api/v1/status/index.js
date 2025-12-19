import database from "infra/database.js";

async function status(request, response) {
  // Date format ISO 8651
  const updateAt = new Date().toISOString();

  // Server info
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databeMaxConectionResult = await database.query(
    "SHOW max_connections;",
  );
  const databeMaxConectionValue =
    databeMaxConectionResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1 and state = 'active';",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        status: "healthy",
        max_connections: parseInt(databeMaxConectionValue),
        opened_connections: databaseOpenedConnectionsValue,
        latency: {},
        version: databaseVersionValue,
      },
    },
  });
}

export default status;
