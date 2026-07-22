const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const PORT = 3000;

app.use(morgan("dev"));

mongoose.connect("mongodb://127.0.0.1:27017/escuela")
    .then(() => {
        console.log("Conectado correctamente a MongoDB");
    })
    .catch((error) => {
        console.error("Error al conectar a MongoDB", error);
    });

const alumnoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    carrera: { type: String, required: true, trim: true },
    semestre: { type: Number, required: true, min: 1 }
}, {
    timestamps: true
});
const Alumno = mongoose.model("ALUMNO", alumnoSchema, "alumnos");

app.get("/alumnos", async(req, res) => {
    try {
        const alumnos = await Alumno.find();
        res.json(alumnos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los alumnos",
            error: error
        });
    }
});


app.get("alumnos/:id", async(req, res) => {
    try {
        const id = Number(req.params.id);
        const alumno = await Alumno.findById(id);
        if (!alumno) {
            return res.status(404).json({
                mensaje: "alumno no encontrado"
            });
        }

        res.json(alumno);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el alumno",
            error: error
        });
    }
});


app.put("/alumnos/:id", async(req, res) => {
    try {
        const { id } = Number(req.params.id);
        const { nombre, carrera, semestre } = req.body;

        if (!nombre || !carrera || !semestre) {
            return res.status(400).json({
                mensaje: "Faltan datos"
            });
        }
        const idnum = parseInt(id);
        const indice = alumnos.findIndex(alumno => alumno.id === idnum);
        if (indice === -1) {
            return res.status(404).json({
                mensaje: "alumno no encontrado "
            });
        }
        const alumnoActualizado = await Alumno.findByIdAndUpdate(
            id, { nombre, carrera, semestre }, { new: true, runValidators: true }
        )

        if (!alumnoActualizado) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }
        res.json({
            mensaje: "Alumno actualizado correctamente",
            alumno: alumnoActualizado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el alumno",
            error: error
        });

    };
});

app.post("/alumnos", async(req, res) => {
    try {
        const { nombre, carrera, semestre } = req.body;
        if (!nombre || !carrera || !semestre) {
            return res.status(400).json({
                mensaje: "Faltan datos"
            });
        }
        const nuevoAlumno = new Alumno({ nombre, carrera, semestre });

        console.log(nuevoAlumno);

        const alumnoguardado = await nuevoAlumno.save();
        res.json({
            mensaje: "Alumno guardado correctamente",
            alumno: alumnoguardado
        });

        res.status(201).json(nuevoAlumno);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: "Error al crear el alumno",
            error: error
        });
    }
});




app.delete("/alumnos/:id", async(req, res) => {
    try {
        const { id } = req.params.id;
        const { nombre, carrera, semestre } = req.body;
        const idnum = parseInt(id);
        const indice = alumnos.findIndex(alumno => alumno.id === idnum);
        if (indice === -1) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }
        const alumnoEliminado = alumnos.splice(indice, 1)[0];
        res.json({
            mensaje: "Alumno eliminado",
            alumno: alumnoEliminado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el alumno",
            error: error
        });
    }
});

app.listen(PORT, () => {

    console.log("Servidor iniciado en http://localhost:" + PORT);

});