from fastapi import FastAPI

app = FastAPI()

@app.get("/noticias")
def get_noticias():
    return {"mensaje": "Aquí irán las noticias"}

@app.post("/eventos")
def create_evento():
    return {"mensaje": "Evento creado"}

@app.get("/estudiantes")
def listar_estudiantes():
    return {"estudiantes": ["Juan", "Ana", "Karla"]}

@app.put("/horarios")
def actualizar_horarios():
    return {"mensaje": "Horarios actualizados"}
