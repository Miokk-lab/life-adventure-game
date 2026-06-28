# Google Agent Development Kit (ADK) - Game Agent Build & Deployment Guide

## Overview
Google Agent Development Kit (ADK) is a framework for building, running, and deploying intelligent agents. Supported languages: Python, TypeScript, Go, Java, and Kotlin.

---

## PART 1: BUILDING AGENTS WITH ADK

### 1.1 Installation

```bash
# Install ADK via pip
pip install google-adk

# Create Python virtual environment (recommended)
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
# or .venv\Scripts\activate.bat  # Windows
```

### 1.2 Create an Agent Project

```bash
# Create new agent project
adk create my_game_agent

# Project structure
my_game_agent/
├── agent.py        # Main agent code
├── .env             # API keys or project IDs
└── __init__.py
```

### 1.3 Basic Agent Structure

```python
from google.adk.agents.llm_agent import Agent

# Define custom tools for your game
def get_player_status(player_id: str) -> dict:
    """Returns player status information."""
    return {
        "status": "success",
        "player_id": player_id,
        "level": 5,
        "health": 100
    }

def execute_game_action(action: str, target: str) -> dict:
    """Execute a game action."""
    return {
        "status": "success",
        "action": action,
        "target": target,
        "result": "Action executed successfully"
    }

# Create root agent
root_agent = Agent(
    model='gemini-flash-latest',
    name='game_agent',
    description="Manages game logic and player interactions",
    instruction="You are a game manager assistant. Use the provided tools to manage game state and execute player actions.",
    tools=[get_player_status, execute_game_action],
)
```

### 1.4 Set API Keys

```bash
# macOS/Linux
echo 'GOOGLE_API_KEY="YOUR_API_KEY"' > .env

# Or manually create .env file
GOOGLE_API_KEY="your-key-here"
```

Get API key from: https://aistudio.google.com/app/apikey

---

## PART 2: RUNNING AGENTS LOCALLY

### 2.1 Command Line Interface (CLI)

```bash
# Run agent interactively in terminal
adk run my_game_agent
```

**Output example:**
```
INFO: Started server process [12345]
INFO: Application startup complete.
```

### 2.2 Web Interface (Development UI)

```bash
# Start web interface on default port 8000
adk web --port 8000

# Note: Run from PARENT directory containing your agent folder
cd parent-directory/
adk web
```

Access at: http://localhost:8000

**Features:**
- Interactive chat interface
- Select agent from dropdown (top-left)
- Test queries in real-time
- View responses live

**⚠️ Important:** ADK Web is for development only, NOT production.

### 2.3 API Server for Testing

```bash
# Start API server
adk api_server

# Server runs on http://localhost:8000 by default
```

#### Create a Session
```bash
curl -X POST http://localhost:8000/apps/my_game_agent/users/u_123/sessions/s_123 \
  -H "Content-Type: application/json" \
  -d '{"key1": "value1", "key2": 42}'
```

#### Send Query (Single Response)
```bash
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "my_game_agent",
    "userId": "u_123",
    "sessionId": "s_123",
    "newMessage": {
      "role": "user",
      "parts": [{"text": "What is the player status?"}]
    }
  }'
```

**Response example:**
```json
[
  {
    "content": {
      "parts": [{
        "functionCall": {
          "id": "af-123...",
          "args": {"player_id": "p_1"},
          "name": "get_player_status"
        }
      }],
      "role": "model"
    },
    "timestamp": 1743712220.385936
  },
  {
    "content": {
      "parts": [{"text": "The player status is..."}],
      "role": "model"
    }
  }
]
```

#### Send Query (Streaming)
```bash
curl -X POST http://localhost:8000/run_sse \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "my_game_agent",
    "userId": "u_123",
    "sessionId": "s_123",
    "newMessage": {
      "role": "user",
      "parts": [{"text": "Execute attack action"}]
    },
    "streaming": true
  }'
```

### 2.4 Interactive API Documentation

Once API server is running, access Swagger UI at:
```
http://localhost:8000/docs
```

Features:
- View all available endpoints
- See request/response schemas
- Try out endpoints directly
- Test with "Try it out" button

---

## PART 3: RUNTIME CONFIGURATION

### 3.1 RunConfig Parameters

Control agent behavior with RunConfig:

```python
from google.genai.adk import RunConfig, StreamingMode
from google.genai import types

# Basic configuration
config = RunConfig(
    streaming_mode=StreamingMode.NONE,
    max_llm_calls=100
)

# Advanced configuration with streaming
config = RunConfig(
    streaming_mode=StreamingMode.SSE,  # Server-Sent Events
    max_llm_calls=200,
    save_input_blobs_as_artifacts=True,
    support_cfc=True  # Compositional Function Calling
)
```

### 3.2 Streaming Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `StreamingMode.NONE` | No streaming, complete responses | Simple agents |
| `StreamingMode.SSE` | One-way streaming from server to client | Chatbots, responsive UX |
| `StreamingMode.BIDI` | Bidirectional streaming | Real-time interactive agents |

### 3.3 Key Parameters

- **`max_llm_calls`**: Limit total LLM calls (default: 500). Set to 0 for unlimited.
- **`save_input_blobs_as_artifacts`**: Save input files for debugging
- **`support_cfc`**: Enable Compositional Function Calling (experimental)
- **`response_modalities`**: Output types (e.g., TEXT, AUDIO)
- **`speech_config`**: Audio output voice configuration

---

## PART 4: CHECKING GENERATED RESULTS

### 4.1 API Response Structure

Each response contains:
- **`content`**: Message parts (text, function calls, function responses)
- **`role`**: "user" or "model"
- **`author`**: Agent name
- **`timestamp`**: When event occurred
- **`invocationId`**: Unique run ID
- **`actions`**: State changes and artifacts

### 4.2 Event Types

1. **Function Call Event**
   - Agent invokes a tool
   - Contains function name and arguments

2. **Function Response Event**
   - Tool execution result
   - Contains function response data

3. **Model Response Event**
   - Agent's natural language response
   - The final answer to the user

### 4.3 Viewing Logs and Metrics

```bash
# Logging is built-in
# Check logs during runs for:
# - Tool execution times
# - Model invocations
# - Errors and warnings
```

### 4.4 Session Management

```bash
# Get session details
curl -X GET http://localhost:8000/apps/my_game_agent/users/u_123/sessions/s_abc

# Update session state
curl -X PATCH http://localhost:8000/apps/my_game_agent/users/u_123/sessions/s_abc \
  -H "Content-Type: application/json" \
  -d '{"stateDelta": {"visit_count": 5}}'

# Delete session
curl -X DELETE http://localhost:8000/apps/my_game_agent/users/u_123/sessions/s_abc
```

---

## PART 5: DEPLOYMENT TO GOOGLE CLOUD

### 5.1 Deployment Options

**Option A: Agent Runtime (Managed Service)**
- Simple, managed infrastructure
- Best for most use cases
- Pay-per-use pricing

**Option B: agents-cli (Accelerated Deployment)**
- Full CI/CD pipeline setup
- Infrastructure-as-Code (Terraform)
- Advanced configurations
- Recommended for production

**Option C: Cloud Run**
- Full control over scaling
- Serverless containers
- Flexible deployment

**Option D: GKE**
- Kubernetes-based deployment
- Complex workloads
- Advanced orchestration

### 5.2 Prerequisites for Agent Runtime Deployment

- **Google Cloud Project** with billing enabled
- **IAM Role**: Agent Platform User (or Owner for full setup)
- **Python environment**: Supported by Agents CLI
- **gcloud CLI**: Google Cloud command-line tool
- **uv tool**: Python environment manager
- **Make tool**: Build automation

### 5.3 Step-by-Step Agent Runtime Deployment (agents-cli)

#### Step 1: Prepare Your Project

Navigate to parent directory containing your agent:
```bash
cd your-project-directory/
```

Run Agents CLI scaffold command:
```bash
agents-cli scaffold enhance --deployment-target agent_engine
```

Follow prompts (accept defaults, choose appropriate GCP region for Agent Runtime).

Success message:
```
> Success! Your agent project is ready.
```

#### Step 2: Project Structure After Preparation

```
my-agent/
├─ app/                    # Core application code
│  ├─ agent.py             # Main agent logic
│  ├─ agent_engine_app.py  # Agent Runtime application wrapper
│  └─ utils/               # Utility functions
├─ .cloudbuild/            # CI/CD pipeline configs
├─ deployment/             # Infrastructure & scripts
├─ notebooks/              # Jupyter notebooks
├─ tests/                  # Unit/integration tests
├─ Makefile                # Common commands
├─ GEMINI.md               # AI-assisted dev guide
└─ pyproject.toml          # Dependencies & config
```

#### Step 3: Connect to Google Cloud

```bash
# Login to Google Cloud
gcloud auth application-default login

# Set your target project
gcloud config set project your-project-id-xxxxx

# Verify project is set
gcloud config get-value project
```

#### Step 4: Deploy Your Agent

```bash
# From your agent project directory
agents-cli deploy
```

The command:
- Builds container from agent code
- Pushes to registry
- Deploys to Agent Runtime
- Configures necessary services

#### Step 5: Enable Observability (Optional)

```bash
# Provision telemetry infrastructure
agents-cli infra single-project
```

### 5.4 Standard Deployment Alternative

For manual control without Agents CLI:

1. Use Cloud Console
2. Use ADK command line interface
3. Step-by-step configuration
4. Best for familiar users

### 5.5 Testing Deployed Agent

After deployment:

```bash
# Query your deployed agent via REST API
curl -X POST https://[agent-runtime-endpoint]/run \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "my_game_agent",
    "userId": "user_123",
    "sessionId": "session_123",
    "newMessage": {
      "role": "user",
      "parts": [{"text": "What is the player status?"}]
    }
  }'
```

### 5.6 Deployment Payload

When deployed, the following are uploaded:
- Your ADK agent code
- Dependencies from your project
- ADK libraries (Python doesn't include API server, Go does)
- Configuration files

**⚠️ Note:** Agent Runtime provides its own API server functionality for Python deployments.

---

## PART 6: OBSERVABILITY & MONITORING

### 6.1 Built-in Logging

ADK provides automatic logging for:
- Model invocations
- Tool executions
- Timing information
- Errors and warnings

### 6.2 Integrations

**Supported observability platforms:**
- Comet Opik (LLM observability & evaluation)
  - Open-source platform
  - Native ADK support
  - Trace and debug agent calls

Configure via Callbacks in ADK.

### 6.3 Available Metrics

- **Latency**: Tool and LLM call times
- **Tool usage**: Which tools are called most
- **Model calls**: Number and type of model invocations
- **Errors**: Tool failures and exceptions
- **State changes**: Session and artifact modifications

---

## PART 7: QUICK REFERENCE COMMANDS

### Development
```bash
adk create my_agent           # Create new project
adk run my_agent              # Run in CLI
adk web --port 8000          # Start web UI
adk api_server                # Start API server
```

### Deployment (agents-cli)
```bash
agents-cli scaffold enhance --deployment-target agent_engine
gcloud auth application-default login
gcloud config set project PROJECT_ID
agents-cli deploy
agents-cli infra single-project  # Optional: observability
```

### Testing
```bash
# List agents
curl http://localhost:8000/list-apps

# Create session
curl -X POST http://localhost:8000/apps/[app]/users/[user]/sessions/[session]

# Run agent
curl -X POST http://localhost:8000/run [request-body]

# Stream responses
curl -X POST http://localhost:8000/run_sse [request-body]
```

---

## PART 8: COMMON PATTERNS FOR GAME AGENTS

### 8.1 Player Status Tracking

```python
def get_player_status(player_id: str) -> dict:
    """Get current player game status."""
    return {
        "level": 5,
        "experience": 2500,
        "health": 85,
        "mana": 120,
        "inventory": ["sword", "shield", "potion"]
    }

root_agent = Agent(
    model='gemini-flash-latest',
    tools=[get_player_status],
    instruction="You manage player progression and stats."
)
```

### 8.2 Game Action Execution

```python
def execute_action(action_type: str, target: str) -> dict:
    """Execute a game action (attack, defend, use item, etc.)."""
    outcomes = {
        "attack": {"damage": 25, "success": True},
        "defend": {"damage_reduction": 50, "success": True},
        "use_item": {"effect": "healing", "amount": 30, "success": True}
    }
    return {
        "status": "success",
        "action": action_type,
        "target": target,
        "outcome": outcomes.get(action_type, {})
    }
```

### 8.3 Game State Management

```python
# Use RunConfig to limit LLM calls for game speed
config = RunConfig(
    streaming_mode=StreamingMode.NONE,
    max_llm_calls=50  # Keep game responsive
)
```

---

## PART 9: TROUBLESHOOTING

### Issue: Agent runs but returns no results
- **Check**: API key is set correctly in .env
- **Check**: Agent tools are properly defined
- **Check**: Model name is correct

### Issue: API Server won't start
- **Check**: Port 8000 is not in use
- **Check**: Use `--port XXXX` flag to change port
- **Check**: Running from correct directory

### Issue: Deployment fails
- **Check**: Google Cloud project ID is correct
- **Check**: Billing is enabled on project
- **Check**: Have appropriate IAM roles
- **Check**: Running `agents-cli deploy` from agent directory

### Issue: Performance is slow
- **Solution**: Reduce `max_llm_calls` in RunConfig
- **Solution**: Use streaming mode for better UX
- **Solution**: Optimize tool implementations

---

## RESOURCES

**Official Documentation:**
- Main docs: https://adk.dev/
- Python quickstart: https://adk.dev/get-started/python/
- Agent Runtime: https://adk.dev/runtime/
- Deployment: https://adk.dev/deploy/agent-runtime/
- agents-cli guide: https://google.github.io/agents-cli/

**API References:**
- Python API: https://adk.dev/api-reference/python/
- REST API: https://adk.dev/api-reference/rest/
- CLI Reference: https://adk.dev/api-reference/cli/

**GitHub Repositories:**
- adk-python: https://github.com/google/adk-python
- adk-js: https://github.com/google/adk-js
- adk-go: https://github.com/google/adk-go
- adk-docs: https://github.com/google/adk-docs

---

## SUMMARY

1. **Build**: Create agent with ADK, define tools, set API keys
2. **Test Locally**: Run with CLI, Web UI, or API Server
3. **Check Results**: Monitor logs, API responses, session state
4. **Deploy**: Use agents-cli for production setup → Google Cloud
5. **Monitor**: Track logs, metrics, and observability data

Your game agents are now ready for development, testing, and production deployment on Google Cloud!
