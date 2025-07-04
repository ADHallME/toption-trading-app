from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import json
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store templates in memory (replace with database later)
templates: Dict[str, Any] = {}

class Template(BaseModel):
    name: str
    data: Dict[str, Any]

@app.get("/")
async def read_root():
    return {"status": "Plotly Builder API is running"}

@app.post("/templates")
async def create_template(template: Template):
    templates[template.name] = template.data
    return {"status": "success", "template": template}

@app.get("/templates")
async def get_templates():
    return templates

@app.get("/templates/{name}")
async def get_template(name: str):
    if name not in templates:
        raise HTTPException(status_code=404, detail="Template not found")
    return templates[name]

@app.delete("/templates/{name}")
async def delete_template(name: str):
    if name not in templates:
        raise HTTPException(status_code=404, detail="Template not found")
    del templates[name]
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 