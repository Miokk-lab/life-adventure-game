# Converting Your Game Agents to Google Agent Runtime (ADK)

## Current Architecture Analysis

Your system has **3 sequential agents** (TypeScript with direct Gemini API calls):
1. **Agent 1**: CBT Problem Analysis → generates hero, monster, CBT analysis
2. **Agent 2**: World Generation → creates game world from analysis
3. **Agent 3**: Quest Generation → generates daily quests from world state
4. **Agent 2b**: Image Generation (Gemini 2.5 Flash or Agnes AI fallback)
5. **Agent 3b**: Victory Animation & Video

**Current flow:** User input → Text generation → Parallel image/video generation

---

## Migration Path: TypeScript to Python ADK

### Option 1: Pure Python ADK (Recommended)
- Cleaner integration with Google Cloud
- Better deployment to Agent Runtime
- Native observability

### Option 2: TypeScript ADK
- Keep existing codebase closer to original
- Still benefits from ADK framework
- More refactoring of existing code needed

**Recommendation: Option 1 (Python ADK)** - Better for Agent Runtime deployment.

---

## Step 1: Project Setup

### Create Python ADK Project

```bash
# Install ADK
pip install google-adk

# Create project
adk create game_agents

# Navigate to project
cd game_agents
```

### Project Structure After Setup

```
game_agents/
├── agent.py              # Main orchestration agent
├── tools/
│   ├── text_analysis.py  # Agent 1: Problem analysis
│   ├── world_gen.py      # Agent 2: World generation
│   ├── quest_gen.py      # Agent 3: Quest generation
│   ├── image_gen.py      # Agent 2b: Image generation
│   └── video_gen.py      # Agent 3b: Video animation
├── .env                  # API keys
└── __init__.py
```

### Install Dependencies

```bash
pip install google-adk google-genai python-dotenv pydantic
```

---

## Step 2: Convert Agent Functions to ADK Tools

### Structure: From Direct API → ADK Tools

**Before (Direct API call):**
```typescript
export async function analyzeProblem(
  worryText: string,
  worryType: string,
  apiKey: string,
): Promise<ProblemAnalysis> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    // ... direct API call
  );
}
```

**After (ADK Tool):**
```python
# tools/text_analysis.py
from pydantic import BaseModel
import json
import google.genai

class ProblemAnalysis(BaseModel):
    externalCauses: str
    internalCauses: str
    difficulty: int
    coreChallenge: str
    positiveQuality: str

def analyze_problem(worry_text: str, worry_type: str) -> ProblemAnalysis:
    """Analyze user worry using CBT framework.
    
    Args:
        worry_text: User's worry description (Chinese)
        worry_type: Category (work_stress, learning_growth, etc.)
    
    Returns:
        ProblemAnalysis with external/internal causes and insights
    """
    client = google.genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents={
            "systemInstruction": {
                "parts": [{
                    "text": "你是一位动森风格的CBT心理治疗师。分析用户烦恼，输出JSON格式：\n{...}"
                }]
            },
            "contents": [{
                "parts": [{
                    "text": f"烦恼类型：{worry_type}\n烦恼内容：{worry_text}"
                }]
            }]
        }
    )
    
    text = response.candidates[0].content.parts[0].text
    json_str = text.replace('```json\n', '').replace('```', '').strip()
    data = json.loads(json_str)
    
    return ProblemAnalysis(**data)
```

---

## Step 3: Convert Each Agent

### Agent 1: Text Analysis Tool

```python
# tools/text_analysis.py

from pydantic import BaseModel
from typing import List
import json
import os
import google.genai

class ProblemAnalysis(BaseModel):
    externalCauses: str
    internalCauses: str
    difficulty: int
    coreChallenge: str
    positiveQuality: str

class TextContent(BaseModel):
    heroName: str
    heroStory: str
    heroSkills: List[str]
    monsterName: str
    monsterStory: str
    monsterAttacks: List[str]
    cbtAnalysis: str
    victoryText: str

def analyze_problem(worry_text: str, worry_type: str) -> ProblemAnalysis:
    """Agent 1 Phase 1: Analyze user problem with CBT framework."""
    client = google.genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    
    prompt = f"""你是一位动森风格的CBT心理治疗师。分析用户烦恼，输出JSON格式：
{{
  "externalCauses": "外部环境原因（1-2句话）",
  "internalCauses": "内心原因（1-2句话）",
  "difficulty": 1-5,
  "coreChallenge": "核心挑战一句话概括",
  "positiveQuality": "烦恼背后的正面品质"
}}
语言：中文，温暖可爱风格。

烦恼类型：{worry_type}
烦恼内容：{worry_text}"""
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt
    )
    
    text = response.candidates[0].content.parts[0].text
    json_str = text.replace('```json\n', '').replace('```', '').strip()
    return ProblemAnalysis(**json.loads(json_str))

def generate_text_content(analysis: ProblemAnalysis) -> TextContent:
    """Agent 1 Phase 2: Generate hero, monster, and story."""
    client = google.genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    
    prompt = f"""你是一位动森风格的游戏设计师。根据心理分析生成游戏世界，输出JSON：
{{
  "heroName": "英雄名字（动森风格可爱动物）",
  "heroStory": "英雄背景故事（约100字）",
  "heroSkills": ["技能1名", "技能2名", "技能3名", "技能4名"],
  "monsterName": "心魔名字（动森风格的可爱反派）",
  "monsterStory": "心魔背景故事（约100字）",
  "monsterAttacks": ["攻击1描述", "攻击2描述", "攻击3描述"],
  "cbtAnalysis": "CBT一体两面正向分析（约300字）",
  "victoryText": "通关胜利叙事（约200字）"
}}
语言：中文，温馨可爱。禁止负面标签化词汇。

分析结果：{analysis.json()}"""
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt
    )
    
    text = response.candidates[0].content.parts[0].text
    json_str = text.replace('```json\n', '').replace('```', '').strip()
    return TextContent(**json.loads(json_str))
```

### Agent 2: Quest Generation Tool

```python
# tools/quest_gen.py

from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import os
import google.genai

class QuestReward(BaseModel):
    mpBonus: Optional[int] = 0
    coins: Optional[int] = 0
    exp: Optional[int] = 0

class Quest(BaseModel):
    type: str  # breathing|sorting|writing|action|gratitude|movement
    description: str
    target: int
    reward: QuestReward

class QuestData(BaseModel):
    tasks: List[Quest]

def generate_quests(
    hero_name: str,
    hero_skills: List[str],
    monster_name: str,
    monster_story: str,
    hero_story: str
) -> QuestData:
    """Generate daily quests based on hero/monster characteristics."""
    client = google.genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    
    prompt = f"""你是一位动森风格的日常任务设计师。根据英雄和心魔信息生成6个日常任务，输出JSON：
{{
  "tasks": [
    {{
      "type": "breathing|sorting|writing|action|gratitude|movement",
      "description": "任务描述（动森风格，温暖可爱）",
      "target": 目标数字,
      "reward": {{"mpBonus": MP奖励或0, "coins": 铃钱奖励, "exp": 经验奖励}}
    }}
  ]
}}
语言：中文，动森风格。任务应与英雄技能和心魔弱点相关联。

英雄：{hero_name}，技能：{', '.join(hero_skills)}
心魔：{monster_name}
英雄背景：{hero_story}
心魔背景：{monster_story}"""
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt
    )
    
    text = response.candidates[0].content.parts[0].text
    json_str = text.replace('```json\n', '').replace('```', '').strip()
    return QuestData(**json.loads(json_str))
```

### Agent 3: Image Generation Tool

```python
# tools/image_gen.py

from pydantic import BaseModel
from typing import Optional
import json
import os
import base64
import google.genai
import requests

class GeneratedImages(BaseModel):
    heroUrl: str
    monsterUrl: str

IMAGE_STYLE_PREFIX = """Style: cozy flat-illustration, warm parchment palette (#f8f8f0), 
mint teal accent (#19c8b9), pill shapes, Nintendo game-button aesthetic, pastel polka-dot 
textures, pastoral atmosphere. NOT Animal Crossing fan art — independent original illustration 
in similar warm game style. 512x512px PNG, transparent background."""

def generate_images(
    hero_prompt: str,
    monster_prompt: str,
    worry_type: str
) -> GeneratedImages:
    """Generate hero and monster images using Gemini 2.5 Flash Image API."""
    
    client = google.genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    
    # Use Gemini 2.5 Flash Image model for image generation
    try:
        hero_response = client.models.generate_content(
            model='gemini-2.5-flash',  # Image generation model
            contents=f"{IMAGE_STYLE_PREFIX}\n\n{hero_prompt}"
        )
        
        monster_response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"{IMAGE_STYLE_PREFIX}\n\n{monster_prompt}"
        )
        
        # Extract base64 images and save
        hero_url = save_generated_image(
            hero_response,
            f"hero-{worry_type}-{int(time.time())}"
        )
        monster_url = save_generated_image(
            monster_response,
            f"monster-{worry_type}-{int(time.time())}"
        )
        
        return GeneratedImages(heroUrl=hero_url, monsterUrl=monster_url)
        
    except Exception as e:
        print(f"[imageAgent] Gemini failed: {e}")
        # Fallback to preset images
        return get_preset_images(worry_type)

def save_generated_image(response, filename: str) -> str:
    """Save generated image to file and return URL."""
    # Save to /tmp or cloud storage
    # Return public URL
    pass

def get_preset_images(worry_type: str) -> GeneratedImages:
    """Fallback: return preset images by worry type."""
    WORRY_IMAGES = {
        'work_stress': {'hero': '/hero-monster/panda.png', 'monster': '/hero-monster/hamster.png'},
        'learning_growth': {'hero': '/hero-monster/owl.png', 'monster': '/hero-monster/hamster.png'},
        # ... more types
    }
    img = WORRY_IMAGES.get(worry_type, WORRY_IMAGES['work_stress'])
    return GeneratedImages(heroUrl=img['hero'], monsterUrl=img['monster'])

def generate_victory_image(victory_prompt: str) -> str:
    """Generate victory celebration image."""
    client = google.genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=f"{IMAGE_STYLE_PREFIX}\n\n{victory_prompt}"
    )
    
    return save_generated_image(response, f"victory-{int(time.time())}")
```

---

## Step 4: Create Main ADK Agent

```python
# agent.py

from google.adk.agents.llm_agent import Agent
from google.genai import types as genai_types
import os
from tools.text_analysis import analyze_problem, generate_text_content
from tools.quest_gen import generate_quests
from tools.image_gen import generate_images, generate_victory_image

# Define tools as ADK-compatible functions
def analyze_player_worry(worry_text: str, worry_type: str) -> dict:
    """Analyze player worry and generate game world."""
    # Phase 1: Analyze problem
    analysis = analyze_problem(worry_text, worry_type)
    
    # Phase 2: Generate text content
    content = generate_text_content(analysis)
    
    # Phase 3: Generate images (parallel)
    images = generate_images(
        content.heroName + " " + content.heroStory,
        content.monsterName + " " + content.monsterStory,
        worry_type
    )
    
    return {
        "textContent": content.dict(),
        "images": images.dict(),
        "analysis": analysis.dict()
    }

def generate_daily_quests(
    hero_name: str,
    hero_skills: str,  # comma-separated
    monster_name: str,
    monster_story: str,
    hero_story: str
) -> dict:
    """Generate daily quests for the player."""
    hero_skills_list = [s.strip() for s in hero_skills.split(',')]
    
    quests = generate_quests(
        hero_name,
        hero_skills_list,
        monster_name,
        monster_story,
        hero_story
    )
    
    return {"quests": quests.dict()}

def handle_victory(
    hero_name: str,
    monster_name: str,
    victory_text: str
) -> dict:
    """Generate victory image and animation."""
    victory_image_url = generate_victory_image(victory_text)
    
    return {
        "victoryImageUrl": victory_image_url,
        "message": f"{hero_name} has defeated {monster_name}!"
    }

# Create root agent
root_agent = Agent(
    model='gemini-2.0-flash',
    name='game_orchestrator',
    description="Manages the therapeutic game experience with heroes, monsters, quests, and victory animations",
    instruction="""You are the Game Orchestrator for a therapeutic game that turns player worries into 
game quests. Your role is to:
1. Analyze player worries and generate appropriate game content (heroes, monsters)
2. Generate daily quests that align with the game world
3. Manage victory celebrations when players complete quests

Use the available tools to orchestrate the complete game experience.""",
    tools=[
        analyze_player_worry,
        generate_daily_quests,
        handle_victory,
    ]
)
```

---

## Step 5: Environment Configuration

```bash
# .env file
GOOGLE_API_KEY="your-api-key-here"
DEPLOYMENT_TARGET=agent_engine
```

---

## Step 6: Run Locally

### Test with CLI
```bash
adk run game_agents
```

### Test with Web UI
```bash
adk web --port 8000
```

### Test with API Server
```bash
adk api_server
```

**Example API call:**
```bash
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "game_agents",
    "userId": "player_123",
    "sessionId": "game_session_456",
    "newMessage": {
      "role": "user",
      "parts": [{
        "text": "I analyzed the player worry and want to generate quests. Hero: 小松, Skills: 呼吸,整理,感恩, Monster: 焦虑怪, Story: ..."
      }]
    }
  }'
```

---

## Step 7: Deploy to Agent Runtime

### Option A: Using agents-cli (Recommended)

```bash
# From parent directory containing game_agents/
cd ../
agents-cli scaffold enhance --deployment-target agent_engine

# Follow prompts (accept defaults, choose GCP region)

# Login to Google Cloud
gcloud auth application-default login

# Set target project
gcloud config set project YOUR_PROJECT_ID

# Deploy
agents-cli deploy

# Enable observability (optional)
agents-cli infra single-project
```

### Option B: Standard Deployment

```bash
# In Google Cloud Console:
# 1. Create Agent Runtime instance
# 2. Upload your game_agents/ folder
# 3. Configure environment variables
# 4. Set Python 3.10+ runtime
# 5. Deploy
```

---

## Step 8: Project Structure After Migration

```
game_agents/
├── agent.py                           # Main orchestration agent
├── tools/
│   ├── __init__.py
│   ├── text_analysis.py               # Agent 1: Problem → Text Content
│   ├── quest_gen.py                   # Agent 2: Quests generation
│   ├── image_gen.py                   # Agent 3: Image generation
│   └── video_gen.py                   # Agent 3b: Victory video (optional)
├── .env                               # API keys & config
├── .env.example                       # Template for .env
├── requirements.txt                   # Python dependencies
├── pyproject.toml                     # Project config (after agents-cli setup)
├── README.md                          # Documentation
└── __init__.py

# After agents-cli setup:
├── .cloudbuild/                       # CI/CD pipelines
├── deployment/                        # Terraform IaC
├── tests/                             # Unit tests
├── Makefile                           # Common commands
└── GEMINI.md                          # AI-assisted dev guide
```

---

## Step 9: Key Differences from Your Original Setup

| Aspect | Original (TypeScript) | ADK (Python) |
|--------|----------------------|--------------|
| **API Calls** | Direct fetch() to Gemini | ADK Agent framework with tools |
| **Tool Definition** | Async functions | Python functions with type hints |
| **Orchestration** | Manual pipeline (sequence) | Agent manages orchestration |
| **State Management** | Manual (props passing) | ADK Sessions (built-in) |
| **Deployment** | Custom Docker | Google Agent Runtime (managed) |
| **Observability** | Manual logging | Built-in ADK logging + integrations |
| **Error Handling** | Try/catch blocks | ADK-managed with callbacks |
| **Streaming** | Not built-in | ADK supports SSE & Bidi streaming |

---

## Step 10: Testing Checklist

### Local Testing
- [ ] Run `adk run game_agents` successfully
- [ ] Web UI accessible at http://localhost:8000
- [ ] API server starts on port 8000
- [ ] Tool invocations work correctly
- [ ] Prompts generate valid JSON responses
- [ ] Images download successfully
- [ ] Error handling works (timeouts, API failures)

### Deployment Testing
- [ ] `agents-cli scaffold enhance` completes
- [ ] Google Cloud authentication works
- [ ] `agents-cli deploy` succeeds
- [ ] Agent Runtime service starts
- [ ] API endpoints respond correctly
- [ ] Sessions persist across calls
- [ ] Logs appear in Cloud Logging

---

## Step 11: Configuration for Game-Specific Features

### Parallel Execution (Image + Video Generation)

ADK supports parallel tool execution:

```python
# In agent.py, ADK can handle parallel calls
def analyze_and_generate(worry_text: str, worry_type: str) -> dict:
    """This will invoke analyze_problem, then generate_images and generate_quests in parallel."""
    # ADK's event loop handles parallelization automatically
    pass
```

### Session-Based State

Store game state in ADK sessions:

```python
# Session data persists automatically
# Access via session context in agent
def continue_game(player_id: str, action: str) -> dict:
    # ADK stores hero_name, monster_name, quests, etc. in session
    # Retrieve from session automatically
    pass
```

### Streaming Responses

Configure streaming for real-time updates:

```python
from google.genai.adk import RunConfig, StreamingMode

config = RunConfig(
    streaming_mode=StreamingMode.SSE,  # Server-Sent Events
    max_llm_calls=100  # Limit calls for cost control
)
```

---

## Step 12: Migration Checklist

- [ ] Install ADK: `pip install google-adk`
- [ ] Create project: `adk create game_agents`
- [ ] Migrate tools to Python functions
- [ ] Create main agent.py
- [ ] Add .env with API keys
- [ ] Test locally with `adk run`
- [ ] Test web UI with `adk web`
- [ ] Test API server with `adk api_server`
- [ ] Run `agents-cli scaffold enhance`
- [ ] Setup Google Cloud authentication
- [ ] Deploy with `agents-cli deploy`
- [ ] Test deployed endpoints
- [ ] Enable observability
- [ ] Monitor logs in Cloud Logging

---

## Step 13: Monitoring & Observability

### Built-in Logging

ADK logs automatically:
```python
import logging
logger = logging.getLogger(__name__)

# Logs appear in Cloud Logging automatically
logger.info("Quest generated for player")
logger.error("Image generation failed")
```

### Integration with Observability Tools

Connect to Comet Opik for traces:

```python
from google.adk.callbacks import CometOpikCallback

# ADK will automatically log to Comet Opik
# Configure via environment variables
```

### Metrics to Track

- Agent execution time
- Tool invocation count
- Error rate by tool
- Session duration
- Image generation success rate
- Quest completion rate

---

## Step 14: Cost Optimization

### For Agent Runtime

```python
# Limit LLM calls to control costs
config = RunConfig(
    max_llm_calls=50  # Prevent runaway costs
)

# Use caching for repeated prompts
# ADK supports context caching with Gemini
```

### Image Generation Fallback

Keep your preset images fallback:
```python
# If Gemini image gen fails, use local presets
# This saves API cost and ensures gameplay continuity
```

---

## Common Migration Gotchas

1. **Type Hints**: ADK tools need type hints for proper serialization
2. **API Keys**: Must be in `.env` or environment variables
3. **JSON Parsing**: Always handle markdown code blocks in LLM responses
4. **Async**: ADK handles async internally, but keep tool functions sync
5. **Error Messages**: Return structured error responses, not raw exceptions

---

## Support Resources

- ADK Docs: https://adk.dev/
- Python Examples: https://github.com/google/adk-python
- Agent Runtime: https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview
- Agents CLI: https://google.github.io/agents-cli/

---

## Next Steps After Migration

1. **Testing**: Run comprehensive tests locally
2. **Optimization**: Refine prompts based on test results
3. **Deployment**: Deploy to Agent Runtime with CI/CD
4. **Monitoring**: Setup dashboards for performance tracking
5. **Iteration**: Gather user feedback and improve prompts
6. **Scaling**: Use Agent Runtime's autoscaling for high load

Your game agents are now ready for production deployment on Google Cloud! 🚀
