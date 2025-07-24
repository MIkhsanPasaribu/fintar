import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LangChainService } from "./langchain.service";
import { LangSmithService } from "./langsmith.service";
import { createAiConfig, AiConfig } from "../config/ai.config";

export interface SimpleWorkflowState {
  context: Record<string, any>;
  step: string;
  userId: string;
  sessionId: string;
  result?: any;
}

export interface SimpleWorkflowConfig {
  userId: string;
  sessionId: string;
  workflowType: "financial_analysis" | "consultation" | "chat" | "custom";
  initialContext?: Record<string, any>;
}

export interface SimpleWorkflowResult {
  finalState: SimpleWorkflowState;
  steps: string[];
  success: boolean;
  error?: string;
  duration: number;
}

@Injectable()
export class LangGraphSimpleService {
  private readonly logger = new Logger(LangGraphSimpleService.name);
  private readonly config: AiConfig;

  constructor(
    private configService: ConfigService,
    private langChainService: LangChainService,
    private langSmithService: LangSmithService
  ) {
    this.config = createAiConfig(configService);
    this.logger.log("LangGraph Simple service initialized successfully");
  }

  /**
   * Execute a simple financial analysis workflow
   */
  async executeFinancialAnalysisWorkflow(
    config: SimpleWorkflowConfig,
    data: Record<string, any>
  ): Promise<SimpleWorkflowResult> {
    const startTime = Date.now();
    const steps: string[] = [];

    try {
      let state: SimpleWorkflowState = {
        context: { ...config.initialContext, ...data },
        step: "start",
        userId: config.userId,
        sessionId: config.sessionId,
      };

      // Step 1: Data Collection and Validation
      steps.push("data_collection");
      state = await this.dataCollectionStep(state);

      // Step 2: Risk Assessment
      steps.push("risk_assessment");
      state = await this.riskAssessmentStep(state);

      // Step 3: Portfolio Analysis
      steps.push("portfolio_analysis");
      state = await this.portfolioAnalysisStep(state);

      // Step 4: Recommendation Generation
      steps.push("recommendation_generation");
      state = await this.recommendationGenerationStep(state);

      // Step 5: Final Report Compilation
      steps.push("report_compilation");
      state = await this.reportCompilationStep(state);

      const duration = Date.now() - startTime;

      return {
        finalState: state,
        steps,
        success: true,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        finalState: {
          context: config.initialContext || {},
          step: "error",
          userId: config.userId,
          sessionId: config.sessionId,
        },
        steps,
        success: false,
        error: (error as Error).message,
        duration,
      };
    }
  }

  /**
   * Execute a consultation workflow
   */
  async executeConsultationWorkflow(
    config: SimpleWorkflowConfig,
    data: Record<string, any>
  ): Promise<SimpleWorkflowResult> {
    const startTime = Date.now();
    const steps: string[] = [];

    try {
      let state: SimpleWorkflowState = {
        context: { ...config.initialContext, ...data },
        step: "start",
        userId: config.userId,
        sessionId: config.sessionId,
      };

      // Step 1: Needs Assessment
      steps.push("needs_assessment");
      state = await this.needsAssessmentStep(state);

      // Step 2: Industry Analysis
      steps.push("industry_analysis");
      state = await this.industryAnalysisStep(state);

      // Step 3: Solution Design
      steps.push("solution_design");
      state = await this.solutionDesignStep(state);

      // Step 4: Implementation Planning
      steps.push("implementation_planning");
      state = await this.implementationPlanningStep(state);

      const duration = Date.now() - startTime;

      return {
        finalState: state,
        steps,
        success: true,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        finalState: {
          context: config.initialContext || {},
          step: "error",
          userId: config.userId,
          sessionId: config.sessionId,
        },
        steps,
        success: false,
        error: (error as Error).message,
        duration,
      };
    }
  }

  // Financial Analysis Workflow Steps
  private async dataCollectionStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(`Data collection step for session: ${state.sessionId}`);

    const analysisPrompt = `
    Analyze the following financial data and prepare it for comprehensive analysis:
    
    Data: ${JSON.stringify(state.context)}
    
    Please validate and structure this data for further analysis.
    `;

    const result = await this.langChainService.chat([
      {
        role: "system",
        content:
          "You are a financial data analyst preparing data for analysis.",
      },
      { role: "user", content: analysisPrompt },
    ]);

    return {
      ...state,
      step: "data_collection_complete",
      context: {
        ...state.context,
        dataAnalysis: result,
        validatedData: true,
      },
    };
  }

  private async riskAssessmentStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(`Risk assessment step for session: ${state.sessionId}`);

    const riskPrompt = `
    Based on the validated financial data, perform a comprehensive risk assessment:
    
    Context: ${JSON.stringify(state.context)}
    
    Analyze financial risks, market risks, and provide risk mitigation strategies.
    `;

    const result = await this.langChainService.financialAdvisorChat(
      riskPrompt,
      state.context
    );

    return {
      ...state,
      step: "risk_assessment_complete",
      context: {
        ...state.context,
        riskAssessment: result,
      },
    };
  }

  private async portfolioAnalysisStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(`Portfolio analysis step for session: ${state.sessionId}`);

    const portfolioPrompt = `
    Analyze the portfolio performance and allocation based on:
    
    Context: ${JSON.stringify(state.context)}
    
    Provide detailed portfolio analysis with optimization recommendations.
    `;

    const result = await this.langChainService.analyzeFinancialData(
      state.context,
      "portfolio"
    );

    return {
      ...state,
      step: "portfolio_analysis_complete",
      context: {
        ...state.context,
        portfolioAnalysis: result,
      },
    };
  }

  private async recommendationGenerationStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(
      `Recommendation generation step for session: ${state.sessionId}`
    );

    const recommendationPrompt = `
    Generate specific financial recommendations based on the complete analysis:
    
    Context: ${JSON.stringify(state.context)}
    
    Provide actionable recommendations with timelines and expected outcomes.
    `;

    const result = await this.langChainService.financialAdvisorChat(
      recommendationPrompt,
      state.context
    );

    return {
      ...state,
      step: "recommendation_generation_complete",
      context: {
        ...state.context,
        recommendations: result,
      },
    };
  }

  private async reportCompilationStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(`Report compilation step for session: ${state.sessionId}`);

    const reportPrompt = `
    Compile a comprehensive financial analysis report based on all the analysis:
    
    Full Context: ${JSON.stringify(state.context)}
    
    Create a structured report with executive summary, detailed findings, and next steps.
    `;

    const result = await this.langChainService.financialAdvisorChat(
      reportPrompt,
      state.context
    );

    return {
      ...state,
      step: "complete",
      result: result,
      context: {
        ...state.context,
        finalReport: result,
      },
    };
  }

  // Consultation Workflow Steps
  private async needsAssessmentStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(`Needs assessment step for session: ${state.sessionId}`);

    const assessmentPrompt = `
    Assess the business needs and requirements:
    
    Context: ${JSON.stringify(state.context)}
    
    Identify key business challenges and opportunities.
    `;

    const result = await this.langChainService.consultantChat(
      assessmentPrompt,
      "general",
      state.context
    );

    return {
      ...state,
      step: "needs_assessment_complete",
      context: {
        ...state.context,
        needsAssessment: result,
      },
    };
  }

  private async industryAnalysisStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(`Industry analysis step for session: ${state.sessionId}`);

    const industryPrompt = `
    Perform industry analysis based on the business context:
    
    Context: ${JSON.stringify(state.context)}
    
    Analyze market trends, competitive landscape, and industry opportunities.
    `;

    const result = await this.langChainService.consultantChat(
      industryPrompt,
      "industry",
      state.context
    );

    return {
      ...state,
      step: "industry_analysis_complete",
      context: {
        ...state.context,
        industryAnalysis: result,
      },
    };
  }

  private async solutionDesignStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(`Solution design step for session: ${state.sessionId}`);

    const solutionPrompt = `
    Design comprehensive solutions based on the analysis:
    
    Context: ${JSON.stringify(state.context)}
    
    Provide detailed solution architecture and implementation approach.
    `;

    const result = await this.langChainService.consultantChat(
      solutionPrompt,
      "strategy",
      state.context
    );

    return {
      ...state,
      step: "solution_design_complete",
      context: {
        ...state.context,
        solutionDesign: result,
      },
    };
  }

  private async implementationPlanningStep(
    state: SimpleWorkflowState
  ): Promise<SimpleWorkflowState> {
    this.logger.log(
      `Implementation planning step for session: ${state.sessionId}`
    );

    const planningPrompt = `
    Create detailed implementation plan based on the solution design:
    
    Context: ${JSON.stringify(state.context)}
    
    Provide step-by-step implementation roadmap with timelines and milestones.
    `;

    const result = await this.langChainService.consultantChat(
      planningPrompt,
      "implementation",
      state.context
    );

    return {
      ...state,
      step: "complete",
      result: result,
      context: {
        ...state.context,
        implementationPlan: result,
      },
    };
  }

  /**
   * Get service configuration
   */
  getConfig(): AiConfig {
    return this.config;
  }
}
