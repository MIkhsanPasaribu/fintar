# Fintar AI System Documentation

## Overview

Fintar's AI system adalah solusi optimalisasi finansial pintar berbasis AI yang dibangun menggunakan LangChain v0.3, LangSmith untuk monitoring, dan LangGraph untuk workflow orchestration. Sistem ini menyediakan komprehensif financial advisory, business consultation, dan intelligent chat capabilities untuk keluarga dan UMKM Indonesia.

## Architecture

### Core Components

1. **LangChain Service** - Core AI functionality dengan integrasi model AI terdepan
2. **LangSmith Service** - Monitoring, tracing, dan analytics
3. **LangGraph Service** - Workflow orchestration dan agent coordination
4. **Agent Services** - Specialized AI agents untuk berbagai domain finansial

### AI Model Configuration

- **Model**: Menggunakan model AI terdepan yang dapat dikonfigurasi
- **Keunggulan**: Large context window, advanced reasoning, multimodal capabilities
- **Cost-effective**: Optimasi biaya untuk solusi UMKM dan keluarga
- **Indonesian Language Support**: Pemahaman mendalam konteks finansial Indonesia

### Agent Architecture

#### Financial AI Agent

- Portfolio analysis and optimization
- Risk assessment and management
- Budget planning and recommendations
- Investment advice and insights
- Financial data analysis workflows

#### Chat Agent

- Conversational AI interface
- Context-aware responses
- Session management
- Multi-type chat support (general, financial, consultant, support)

#### Consultant Agent

- Business strategy consultation
- Industry analysis and insights
- Operational efficiency analysis
- Market analysis and recommendations
- Implementation planning

## API Endpoints

### Financial AI

#### POST `/ai/financial/analyze`

Perform comprehensive financial analysis using workflow orchestration.

**Request Body:**

```json
{
  "userId": "string",
  "sessionId": "string",
  "analysisType": "portfolio | budget | forecast | risk | comprehensive",
  "data": {},
  "preferences": {
    "riskTolerance": "conservative | moderate | aggressive",
    "investmentHorizon": "short | medium | long",
    "goals": ["string"]
  }
}
```

**Response:**

```json
{
  "analysisId": "string",
  "analysis": "string",
  "recommendations": ["string"],
  "riskLevel": "low | medium | high",
  "confidence": 0.95,
  "generatedAt": "2025-01-24T00:00:00Z",
  "metadata": {}
}
```

#### POST `/ai/financial/advice`

Get conversational financial advice.

**Request Body:**

```json
{
  "userId": "string",
  "sessionId": "string",
  "question": "string",
  "context": {},
  "previousMessages": []
}
```

#### POST `/ai/financial/portfolio`

Analyze portfolio performance and allocation.

#### POST `/ai/financial/risk`

Assess investment risk factors.

#### POST `/ai/financial/budget`

Generate budget recommendations.

### Chat System

#### POST `/ai/chat`

Process chat messages with context-aware responses.

**Request Body:**

```json
{
  "userId": "string",
  "sessionId": "string",
  "message": "string",
  "context": {},
  "chatType": "general | financial | consultant | support"
}
```

**Response:**

```json
{
  "responseId": "string",
  "message": "string",
  "confidence": 0.95,
  "suggestedActions": ["string"],
  "generatedAt": "2025-01-24T00:00:00Z",
  "metadata": {}
}
```

#### GET `/ai/chat/session/:sessionId`

Get chat session details.

#### GET `/ai/chat/history/:sessionId`

Get chat session history.

#### GET `/ai/chat/summary/:sessionId`

Get chat session summary with topics and sentiment.

#### DELETE `/ai/chat/session/:sessionId`

Clear chat session.

#### GET `/ai/chat/sessions/user/:userId`

Get all chat sessions for a user.

### Business Consultation

#### POST `/ai/consultation`

Get comprehensive business consultation using workflow orchestration.

**Request Body:**

```json
{
  "userId": "string",
  "sessionId": "string",
  "industryType": "string",
  "consultationType": "strategy | operations | financial | technology | marketing | general",
  "businessData": {},
  "specificQuestions": ["string"],
  "objectives": ["string"]
}
```

**Response:**

```json
{
  "consultationId": "string",
  "analysis": "string",
  "recommendations": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": "high | medium | low",
      "impact": "high | medium | low",
      "effort": "high | medium | low",
      "timeline": "string",
      "dependencies": ["string"]
    }
  ],
  "implementationPlan": [
    {
      "id": "string",
      "phase": "string",
      "title": "string",
      "description": "string",
      "duration": "string",
      "resources": ["string"],
      "milestones": ["string"],
      "successMetrics": ["string"]
    }
  ],
  "riskAssessment": "string",
  "expectedOutcomes": ["string"],
  "confidence": 0.95,
  "generatedAt": "2025-01-24T00:00:00Z",
  "metadata": {}
}
```

#### GET `/ai/consultation/industry-insights/:industryType`

Get industry-specific insights and trends.

#### POST `/ai/consultation/strategic-advice`

Get strategic advice for specific challenges.

#### POST `/ai/consultation/operational-analysis`

Analyze operational efficiency.

#### POST `/ai/consultation/market-analysis`

Generate market analysis reports.

### System Management

#### GET `/ai/health`

Get system health status.

**Response:**

```json
{
  "status": "healthy | degraded | unhealthy",
  "services": {
    "langchain": true,
    "langsmith": true,
    "langgraph": true
  },
  "lastCheck": "2025-01-24T00:00:00Z"
}
```

#### GET `/ai/capabilities`

Get available AI capabilities.

#### GET `/ai/configuration`

Get current AI configuration.

#### GET `/ai/metrics`

Get performance metrics.

#### GET `/ai/traces/:sessionId`

Get tracing data for a session.

### Utility Endpoints

#### POST `/ai/session/generate`

Generate a new session ID.

#### POST `/ai/workflow/execute`

Execute custom workflows.

#### POST `/ai/batch`

Process multiple requests in batch.

#### POST `/ai/maintenance`

Perform system maintenance.

## Configuration

### Environment Variables

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=4000

# LangSmith Configuration (Optional)
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_PROJECT=fintar-ai
LANGSMITH_TRACING=true

# LangChain Configuration
LANGCHAIN_VERBOSE=false
LANGCHAIN_CALLBACKS_BACKGROUND=true
```

### Dependencies

The system uses the following LangChain v0.3 packages:

```json
{
  "langchain": "^0.3.29",
  "@langchain/core": "^0.3.62",
  "@langchain/community": "^0.3.48",
  "@langchain/openai": "^0.5.18",
  "@langchain/langgraph": "^0.3.7",
  "langsmith": "^0.2.36"
}
```

## Workflow Architecture

### Financial Analysis Workflow

1. **Data Collection** - Gather and validate financial data
2. **Risk Assessment** - Analyze risk factors and tolerance
3. **Portfolio Analysis** - Evaluate portfolio composition and performance
4. **Recommendation Generation** - Generate actionable recommendations
5. **Report Compilation** - Compile comprehensive analysis report

### Consultation Workflow

1. **Needs Assessment** - Understand business requirements
2. **Industry Analysis** - Analyze industry trends and benchmarks
3. **Solution Design** - Design tailored solutions
4. **Implementation Planning** - Create detailed implementation roadmap

## Features

### Advanced Capabilities

- **Context-Aware Conversations** - Maintains conversation context across sessions
- **Workflow Orchestration** - Complex multi-step AI workflows using LangGraph
- **Real-time Monitoring** - LangSmith integration for performance tracking
- **Multi-Agent System** - Specialized agents for different domains
- **Batch Processing** - Process multiple requests efficiently
- **Error Handling** - Comprehensive error handling and fallback mechanisms

### Financial AI Features

- Portfolio optimization and rebalancing recommendations
- Risk assessment with multiple risk models
- Budget analysis and optimization suggestions
- Investment opportunity identification
- Financial goal planning and tracking

### Business Consultation Features

- Industry-specific insights and benchmarking
- Strategic planning and implementation roadmaps
- Operational efficiency analysis
- Market analysis and competitive positioning
- Technology adoption recommendations

### Chat System Features

- Multi-type chat support (general, financial, consultant, support)
- Session management and history
- Sentiment analysis and topic extraction
- Suggested actions and follow-up questions
- User session analytics

## Monitoring and Analytics

### LangSmith Integration

- **Tracing** - Complete request/response tracing
- **Performance Metrics** - Response times, success rates, error rates
- **Usage Analytics** - Most used operations, user patterns
- **Error Monitoring** - Detailed error tracking and analysis

### Health Monitoring

- Real-time health checks for all AI services
- Performance degradation detection
- Automatic maintenance and cleanup
- Resource usage monitoring

## Security and Best Practices

### Security Measures

- API key encryption and secure storage
- Rate limiting on AI endpoints
- Input validation and sanitization
- Error message sanitization
- Audit logging for all AI operations

### Performance Optimization

- Connection pooling for LLM requests
- Response caching for common queries
- Batch processing for efficiency
- Background processing for non-blocking operations
- Resource cleanup and memory management

## Development Guidelines

### Adding New Agents

1. Create agent service in `/src/ai/agents/`
2. Implement required interfaces
3. Add agent to AI module providers
4. Update AI service to expose agent methods
5. Add controller endpoints
6. Update documentation

### Extending Workflows

1. Define workflow schema in LangGraph service
2. Implement workflow steps
3. Add workflow configuration
4. Test workflow execution
5. Add monitoring and error handling

### Best Practices

- Always use tracing for production operations
- Implement proper error handling and fallbacks
- Use appropriate confidence scoring
- Cache responses when possible
- Monitor performance and optimize regularly
- Follow security guidelines for API key management

## Troubleshooting

### Common Issues

1. **OpenAI API Key Issues** - Verify API key and usage limits
2. **LangSmith Connection** - Check API key and project configuration
3. **Memory Issues** - Monitor session cleanup and implement limits
4. **Performance Degradation** - Check metrics and optimize workflows

### Debugging

- Enable verbose logging with `LANGCHAIN_VERBOSE=true`
- Use LangSmith tracing for detailed request analysis
- Check health endpoints for service status
- Monitor error logs for patterns

## Future Enhancements

### Planned Features

- Custom model fine-tuning
- Advanced RAG (Retrieval-Augmented Generation) capabilities
- Real-time data integration
- Multi-language support
- Voice interaction capabilities
- Advanced analytics dashboard

### Integration Opportunities

- External financial data APIs
- CRM system integration
- Document processing and analysis
- Real-time market data feeds
- Third-party consultation tools
