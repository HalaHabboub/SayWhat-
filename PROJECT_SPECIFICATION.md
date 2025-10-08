# Multi-Language Translation & Communication Agent

## Project Overview
An AI-powered agent that handles multi-modal translation (text and audio) with optional summarization, image generation, and interactive Q&A capabilities through RAG (Retrieval Augmented Generation).

---

## System Architecture

### **Module 1: Text Translation Pipeline**

#### **Input Layer**
- **Web-based Input**: URL ingestion via `WebBaseLoader`
- **Document Input**: File upload support (PDF, TXT, DOCX, MD)
  - Loaders: `DirectoryLoader`

#### **Processing Layer**
1. **Document Loading**: Ingest content from web or files
2. **Text Splitting**: `RecursiveCharacterTextSplitter` (chunk_size: 1000-2000)
3. **Summarization (Optional)**:
   - Strategy: Map-reduce or refine summarization chains
   - Model: GPT-4o with custom prompt templates
   - Output: Condensed version maintaining key information

#### **Translation Layer**
1. **Language Selection**: User-specified target language(s)
2. **Translation Engine**:
   - Primary: GPT-4o via LangChain
   - Prompt: Include tone control (formal/informal/technical with target audience)
   - Cultural context preservation
3. **Quality Assurance**: Validation step for translation accuracy

#### **Output Layer**
1. **Markdown Generation**: Formatted translation output
   - Structure: Headers, metadata, source/target languages
2. **Image Banner Generation**:
   - Tool: DALL-E 3 or Stable Diffusion
   - Content: Visual representation of translation theme
   - Integration: Embedded in MD output
3. **RAG Integration**:
   - Embed translated text in vector database (Chroma/Pinecone)
   - Enable Q&A on translated content
   - Retrieval: Semantic search with OpenAI embeddings
4. **Audio Generation (Optional)**:
   - Text-to-Speech: OpenAI TTS API
   - Output: Translated audio file
   - Voice options: Alloy, Echo, Fable, Onyx, Nova, Shimmer

---

### **Module 2: Audio Translation Pipeline**

#### **Input Layer**
- **Audio Input**: Upload audio files (MP3, WAV, M4A, OGG)
- **Supported Sources**: Voice recordings, podcasts, lectures, meetings

#### **Transcription Layer**
1. **Speech-to-Text**: OpenAI Whisper API
2. **Output**: Raw transcript with timestamps (optional)
3. **Language Detection**: Automatic source language identification

#### **Processing Layer**
1. **Text Normalization**: Clean transcription artifacts
2. **Text Splitting**: `RecursiveCharacterTextSplitter`
3. **Summarization (Optional)**:
   - Condense lengthy audio transcripts
   - Preserve key points and context
   - Model: GPT-4o with summarization prompts

#### **Translation Layer**
1. **Language Selection**: User-specified target language(s)
2. **Translation Engine**: Same as text pipeline
   - Context-aware translation
   - Idiomatic expression handling
3. **Cultural Adaptation**: Tone and nuance preservation

#### **Output Layer**
1. **Markdown Generation**:
   - Structured format with source/target languages
   - Include original transcript (optional)
   - Metadata: Duration, speakers, timestamps
2. **Image Banner Generation**:
   - Visual summary of audio content
   - Integration: DALL-E 3/Stable Diffusion
3. **Audio Generation (Optional)**:
   - Text-to-Speech: OpenAI TTS API
   - Output: Translated audio file
   - Voice options: Alloy, Echo, Fable, Onyx, Nova, Shimmer
4. **RAG Integration**:
   - Vector database embedding
   - Q&A on translated audio content
   - Semantic search capabilities

---

## Shared Components

### **Q&A RAG System**
- **Vector Database**: Chroma or Pinecone
- **Embeddings**: OpenAI `text-embedding-3-large`
- **Retrieval**: Similarity search (k=4-6 documents)
- **Generation**: GPT-4o with context-aware prompts
- **Features**:
  - Ask questions about translated content
  - Cross-reference multiple translations
  - Contextual answers with citations

### **Memory System**
- **Conversation History**: `ConversationBufferMemory`
- **Long Conversations**: `ConversationSummaryMemory`
- **Cross-session Persistence**: Store user preferences, glossaries

### **Agent Orchestration**
- **Framework**: LangChain `AgentExecutor`
- **Tools**:
  - Translation tool
  - Summarization tool
  - Image generation tool
  - Audio processing tool (transcription/TTS)
  - RAG query tool
- **Decision Logic**: GPT-4o function calling for tool selection

---

## Technical Stack

### **Core Dependencies**
```
langchain-openai
langchain-community
langchain-core
chromadb / pinecone-client
openai (for Whisper, DALL-E, TTS)
pydub (audio processing)
pypdf / python-docx (document parsing)
```

### **LLM & APIs**
- **Primary LLM**: OpenAI GPT-4o
- **Embeddings**: OpenAI `text-embedding-3-large`
- **Transcription**: OpenAI Whisper
- **Image Gen**: DALL-E 3 or Stable Diffusion
- **TTS**: OpenAI TTS API

### **Storage**
- **Vector DB**: Chroma (local) or Pinecone (cloud)
- **File Storage**: Local filesystem or cloud (S3/GCS)
- **Metadata**: SQLite or PostgreSQL

---

## Workflow Diagrams

### **Text Translation Flow**
```
Web/Document Input → Load → Split → [Optional: Summarize]
    ↓
Choose Language → Translate (GPT-4o) → Format MD
    ↓
Generate Banner (DALL-E) → Embed in MD
    ↓
Store in Vector DB → Enable RAG Q&A
```

### **Audio Translation Flow**
```
Audio Input → Transcribe (Whisper) → Split → [Optional: Summarize]
    ↓
Choose Language → Translate (GPT-4o) → Format MD
    ↓
Generate Banner (DALL-E) → [Optional: TTS Audio]
    ↓
Store in Vector DB → Enable RAG Q&A
```

---

## Key Features

### **1. Multi-Modal Input**
- Text (web/documents)
- Audio (files/recordings)

### **2. Intelligent Processing**
- Optional summarization for long content
- Context preservation across translations
- Cultural nuance handling

### **3. Rich Output**
- Structured Markdown documents
- AI-generated visual banners
- Optional translated audio (TTS)

### **4. Interactive Q&A**
- RAG-powered questions on translated content
- Semantic search across translations
- Contextual answers with citations

### **5. Extensibility**
- Support for multiple languages
- Customizable tone and formality
- User glossaries and terminology databases

---

## Implementation Phases

### **Phase 1: Core Text Translation**
- Web/document loaders
- Basic translation pipeline
- Markdown output

### **Phase 2: Enhanced Features**
- Summarization integration
- Image banner generation
- RAG Q&A system

### **Phase 3: Audio Pipeline**
- Whisper transcription
- Audio translation
- TTS output

### **Phase 4: Agent Orchestration**
- Multi-tool agent
- User preferences and memory
- Advanced workflow automation

---

## Project Structure

```
Say What/
├── README.md
├── PROJECT_SPECIFICATION.md
├── requirements.txt
├── config/
│   ├── .env.example
│   └── settings.py
├── src/
│   ├── agents/
│   │   ├── translation_agent.py
│   │   └── orchestrator.py
│   ├── tools/
│   │   ├── loader_tools.py
│   │   ├── translation_tools.py
│   │   ├── summarization_tools.py
│   │   ├── image_tools.py
│   │   ├── audio_tools.py
│   │   └── rag_tools.py
│   ├── chains/
│   │   ├── text_pipeline.py
│   │   └── audio_pipeline.py
│   ├── memory/
│   │   └── conversation_memory.py
│   └── utils/
│       ├── document_parsers.py
│       └── formatters.py
├── data/
│   ├── input/
│   ├── output/
│   └── vector_db/
├── notebooks/
│   ├── text_translation_demo.ipynb
│   └── audio_translation_demo.ipynb
└── tests/
    ├── test_translation.py
    ├── test_rag.py
    └── test_audio.py
```

---

## Getting Started

### **Prerequisites**
- Python 3.8+
- OpenAI API key
- FFmpeg (for audio processing)

### **Installation**
```bash
cd "Say What"
pip install -r requirements.txt
```

### **Configuration**
1. Copy `.env.example` to `.env`
2. Add your OpenAI API key
3. Configure vector database settings

### **Usage**
```python
from src.agents.translation_agent import TranslationAgent

# Initialize agent
agent = TranslationAgent()

# Translate text
result = agent.translate_text(
    input_source="https://example.com/article",
    target_language="Spanish",
    include_summary=True,
    generate_banner=True
)

# Ask questions about translation
answer = agent.query_translation(
    question="What are the main points discussed?"
)
```

---

## Future Enhancements

- [ ] Real-time translation API
- [ ] Multi-language simultaneous translation
- [ ] Video subtitle translation
- [ ] Custom terminology management
- [ ] Translation quality metrics
- [ ] Collaborative translation workflows
- [ ] Mobile app integration

---

## License
MIT License

## Contributors
Your Team

## Acknowledgments
Built using Week 2 concepts from General Assembly Data Science Course
