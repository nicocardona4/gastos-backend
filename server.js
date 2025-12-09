require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Conectar a Mongo Atlas
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.error(err));

const gastoSchema = new mongoose.Schema({
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  local: String,
    descripcion: String,
  fecha: { type: Date, default: Date.now }
});

const Gasto = mongoose.model("Gasto", gastoSchema);

// 📌 POST
app.post("/gastos", async (req, res) => {
  const nuevo = await Gasto.create(req.body);
  res.status(201).json(nuevo);
});

// 📌 GET
app.get("/gastos", async (req, res) => {
  const gastos = await Gasto.find().sort({ fecha: -1 });
  res.json(gastos);
});

// 📌 PATCH
app.patch("/gastos/:id", async (req, res) => {
  const actualizado = await Gasto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
});

// 📌 DELETE
app.delete("/gastos/:id", async (req, res) => {
  await Gasto.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API escuchando en puerto", PORT));

