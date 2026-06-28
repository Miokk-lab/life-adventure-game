# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Serve the reasoning_engine ``{class_method, input}`` contract over HTTP.

Exists to guarantee support for the Vertex AI Console Playground and Gemini
Enterprise (via ADK registration), which both invoke the engine through this
contract. Agent Engine forwards calls to ``/api/reasoning_engine`` (sync) and
``/api/stream_reasoning_engine`` (streaming); dispatch is limited to the
:class:`AdkApp` ``register_operations()`` methods so the wire output matches a
packaged Agent Engine.
"""

import inspect
import json

from fastapi import FastAPI, HTTPException, Request, encoders, responses
from vertexai.agent_engines.templates.adk import AdkApp

from game_agents.app_utils import services


def attach_reasoning_engine_routes(app: FastAPI) -> None:
    """Register reasoning_engine routes that dispatch to an AdkApp."""
    runtime: AdkApp | None = None
    streaming_methods: set[str] = set()
    sync_methods: set[str] = set()

    def get_runtime() -> AdkApp:
        nonlocal runtime, streaming_methods, sync_methods
        if runtime is None:
            import os

            from game_agents.agent import app as adk_app

            if os.environ.get("INTEGRATION_TEST") == "TRUE":

                def custom_set_up(self):
                    from google.adk.artifacts.in_memory_artifact_service import (
                        InMemoryArtifactService,
                    )
                    from google.adk.memory.in_memory_memory_service import (
                        InMemoryMemoryService,
                    )
                    from google.adk.runners import Runner
                    from google.adk.sessions.in_memory_session_service import (
                        InMemorySessionService,
                    )

                    from game_agents.app_utils import services

                    self._tmpl_attrs["session_service"] = services.get_session_service()
                    self._tmpl_attrs["artifact_service"] = (
                        services.get_artifact_service()
                    )
                    self._tmpl_attrs["memory_service"] = InMemoryMemoryService()
                    self._tmpl_attrs["runner"] = Runner(
                        app=self._tmpl_attrs.get("app"),
                        agent=(
                            None
                            if self._tmpl_attrs.get("app")
                            else self._tmpl_attrs.get("agent")
                        ),
                        app_name=(
                            None
                            if self._tmpl_attrs.get("app")
                            else self._tmpl_attrs.get("app_name")
                        ),
                        plugins=(
                            None
                            if self._tmpl_attrs.get("app")
                            else self._tmpl_attrs.get("plugins")
                        ),
                        session_service=self._tmpl_attrs.get("session_service"),
                        artifact_service=self._tmpl_attrs.get("artifact_service"),
                        memory_service=self._tmpl_attrs.get("memory_service"),
                    )
                    self._tmpl_attrs["in_memory_session_service"] = (
                        InMemorySessionService()
                    )
                    self._tmpl_attrs["in_memory_artifact_service"] = (
                        InMemoryArtifactService()
                    )

                AdkApp.set_up = custom_set_up

            # Reuse the process-wide services so sessions created here are
            # visible to the adk_api and A2A paths, and vice versa (see services.py).
            runtime = AdkApp(
                app=adk_app,
                session_service_builder=services.get_session_service,
                artifact_service_builder=services.get_artifact_service,
            )
            runtime.set_up()
            operations = runtime.register_operations()
            streaming_methods = set(operations.get("stream", [])) | set(
                operations.get("async_stream", [])
            )
            sync_methods = set(operations.get("", [])) | set(
                operations.get("async", [])
            )
        return runtime

    def resolve_method(class_method: str, *, streaming: bool):
        rt = get_runtime()
        allowed = streaming_methods if streaming else sync_methods
        if class_method not in allowed:
            raise HTTPException(
                status_code=404,
                detail=f"Unsupported reasoning_engine method: {class_method!r}",
            )
        return getattr(rt, class_method)

    @app.post("/api/stream_reasoning_engine")
    async def stream_query(request: Request) -> responses.StreamingResponse:
        body = await request.json()
        method = resolve_method(body["class_method"], streaming=True)

        async def generator():
            async for event in method(**(body.get("input") or {})):
                yield json.dumps(event) + "\n"

        return responses.StreamingResponse(
            content=generator(), media_type="application/json"
        )

    @app.post("/api/reasoning_engine")
    async def query(request: Request) -> responses.JSONResponse:
        body = await request.json()
        method = resolve_method(body["class_method"], streaming=False)
        kwargs = body.get("input") or {}
        output = (
            await method(**kwargs)
            if inspect.iscoroutinefunction(method)
            else method(**kwargs)
        )
        return responses.JSONResponse(
            content=encoders.jsonable_encoder({"output": output})
        )
