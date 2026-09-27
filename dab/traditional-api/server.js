import express from "express";
import cors from "cors";
import sql from "mssql";

const app = express();
app.use(cors());
app.use(express.json());

const pool = await sql.connect(process.env.TRADITIONAL_SQL_CONNECTION_STRING);
const allowedStatuses = new Set(["Open", "Doing", "Done"]);

app.get("/api/tasks", async (_req, res) => {
  const result = await pool.request().query(`
    SELECT TaskId, Title, Status, CreatedAt
    FROM dbo.Tasks
    ORDER BY CreatedAt DESC;`);
  res.json({ value: result.recordset });
});

app.post("/api/tasks", async (req, res) => {
  if (!req.body.Title || !allowedStatuses.has(req.body.Status)) return res.sendStatus(400);
  const result = await pool.request()
    .input("Title", sql.NVarChar(200), req.body.Title)
    .input("Status", sql.VarChar(20), req.body.Status)
    .query(`INSERT dbo.Tasks (Title, Status)
            OUTPUT inserted.* VALUES (@Title, @Status);`);
  res.status(201).json(result.recordset[0]);
});

app.patch("/api/tasks/:id", async (req, res) => {
  if (!allowedStatuses.has(req.body.Status)) return res.sendStatus(400);
  const result = await pool.request()
    .input("TaskId", sql.Int, req.params.id)
    .input("Status", sql.VarChar(20), req.body.Status)
    .query(`UPDATE dbo.Tasks SET Status = @Status
            OUTPUT inserted.* WHERE TaskId = @TaskId;`);
  if (!result.recordset.length) return res.sendStatus(404);
  res.json(result.recordset[0]);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const result = await pool.request()
    .input("TaskId", sql.Int, req.params.id)
    .query("DELETE dbo.Tasks WHERE TaskId = @TaskId;");
  res.sendStatus(result.rowsAffected[0] ? 204 : 404);
});

app.listen(3000, () => console.log("Traditional API: http://localhost:3000"));
