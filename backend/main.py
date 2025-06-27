from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class LineHistoryRequest(BaseModel):
    repoName: str
    line: int
    relativePath: str
    commitHashes: List[str]

class FileHistoryRequest(BaseModel):
    repoName: str
    relativePath: str
    commitHashes: List[str]

@app.post("/line-history-ai")
async def line_history_ai(req: LineHistoryRequest):
    # TODO: Integrate with LLM and MCP as needed
    return {"result": f"Received line history request for {req.repoName}, file {req.relativePath}, line {req.line}, commits: {', '.join(req.commitHashes)}"}

@app.post("/file-history-ai")
async def file_history_ai(req: FileHistoryRequest):
    # TODO: Integrate with LLM and MCP as needed
    return {"result": f"Received file history request for {req.repoName}, file {req.relativePath}, commits: {', '.join(req.commitHashes)}"}
