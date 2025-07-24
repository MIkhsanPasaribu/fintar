import { Injectable, Logger } from "@nestjs/common";
import { LangChainService } from "../services/langchain.service";
import { LangSmithService } from "../services/langsmith.service";
import {
  LangGraphSimpleService,
  SimpleWorkflowConfig,
} from "../services/langgraph-simple.service";

export interface ConsultationRequest {
  userId: string;
  sessionId: string;
  industryType: string;
  consultationType:
    | "strategy"
    | "operations"
    | "financial"
    | "technology"
    | "marketing"
    | "general";
  businessData: Record<string, any>;
  specificQuestions?: string[];
  objectives?: string[];
}

export interface ConsultationResponse {
  consultationId: string;
  analysis: string;
  recommendations: ConsultationRecommendation[];
  implementationPlan: ImplementationStep[];
  riskAssessment: string;
  expectedOutcomes: string[];
  confidence: number;
  generatedAt: Date;
  metadata: Record<string, any>;
}

export interface ConsultationRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  timeline: string;
  dependencies: string[];
}

export interface ImplementationStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  duration: string;
  resources: string[];
  milestones: string[];
  successMetrics: string[];
}

export interface IndustryInsight {
  industryType: string;
  marketTrends: string[];
  challenges: string[];
  opportunities: string[];
  benchmarks: Record<string, number>;
  recommendations: string[];
  generatedAt: Date;
}

@Injectable()
export class ConsultantAgentService {
  private readonly logger = new Logger(ConsultantAgentService.name);

  constructor(
    private langChainService: LangChainService,
    private langSmithService: LangSmithService,
    private langGraphService: LangGraphSimpleService
  ) {}

  /**
   * Provide comprehensive business consultation using workflow
   */
  async provideConsultation(
    request: ConsultationRequest
  ): Promise<ConsultationResponse> {
    const consultationId = `cons_${request.sessionId}_${Date.now()}`;

    try {
      this.logger.log(`Starting consultation: ${consultationId}`);

      // Prepare workflow configuration
      const workflowConfig: SimpleWorkflowConfig = {
        userId: request.userId,
        sessionId: request.sessionId,
        workflowType: "consultation",
        initialContext: {
          industryType: request.industryType,
          consultationType: request.consultationType,
          businessData: request.businessData,
          specificQuestions: request.specificQuestions,
          objectives: request.objectives,
          consultationId,
        },
      };

      // Execute consultation workflow
      const workflowResult =
        await this.langGraphService.executeConsultationWorkflow(
          workflowConfig,
          request.businessData
        );

      if (!workflowResult.success) {
        throw new Error(
          `Consultation workflow failed: ${workflowResult.error}`
        );
      }

      // Extract results from workflow
      const finalState = workflowResult.finalState;
      const context = finalState.context;

      // Generate structured consultation response
      const analysis = context.industryAnalysis || "Analysis completed";
      const recommendations = await this.generateRecommendations(
        context,
        request.consultationType,
        request.objectives
      );
      const implementationPlan =
        await this.generateImplementationPlan(recommendations);
      const riskAssessment = await this.generateRiskAssessment(
        context,
        request.industryType
      );
      const expectedOutcomes =
        await this.generateExpectedOutcomes(recommendations);
      const confidence = this.calculateConsultationConfidence(context);

      const response: ConsultationResponse = {
        consultationId,
        analysis,
        recommendations,
        implementationPlan,
        riskAssessment,
        expectedOutcomes,
        confidence,
        generatedAt: new Date(),
        metadata: {
          industryType: request.industryType,
          consultationType: request.consultationType,
          steps: workflowResult.steps,
          duration: workflowResult.duration,
          workflowSuccess: workflowResult.success,
        },
      };

      this.logger.log(`Consultation completed: ${consultationId}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Consultation failed: ${error instanceof Error ? error.message : String(error)}`
      );

      // Return a fallback response
      return {
        consultationId,
        analysis: "Consultation could not be completed due to an error.",
        recommendations: [],
        implementationPlan: [],
        riskAssessment: "Risk assessment unavailable.",
        expectedOutcomes: [],
        confidence: 0,
        generatedAt: new Date(),
        metadata: {
          error: error instanceof Error ? error.message : String(error),
          industryType: request.industryType,
          consultationType: request.consultationType,
        },
      };
    }
  }

  /**
   * Get industry-specific insights
   */
  async getIndustryInsights(
    userId: string,
    sessionId: string,
    industryType: string
  ): Promise<IndustryInsight> {
    try {
      this.logger.log(`Generating industry insights for: ${industryType}`);

      // Start tracing
      const traceId = await this.langSmithService.startTrace(
        sessionId,
        userId,
        "industry_insights",
        { industryType }
      );

      // Generate comprehensive industry analysis
      const analysisPrompt = `Provide comprehensive insights for the ${industryType} industry including:
      1. Current market trends and developments
      2. Key challenges facing the industry
      3. Emerging opportunities
      4. Industry benchmarks and KPIs
      5. Strategic recommendations for businesses in this industry`;

      const analysis = await this.langChainService.consultantChat(
        analysisPrompt,
        industryType,
        { analysisType: "industry_insights" }
      );

      // Parse the analysis into structured data
      const insights = this.parseIndustryAnalysis(analysis, industryType);

      // End tracing
      await this.langSmithService.endTrace(traceId, insights, true);

      this.logger.log(`Industry insights generated for: ${industryType}`);
      return insights;
    } catch (error) {
      this.logger.error(
        `Industry insights failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Provide strategic advice for specific business challenges
   */
  async provideStrategicAdvice(
    userId: string,
    sessionId: string,
    industryType: string,
    challenge: string,
    businessContext: Record<string, any>
  ): Promise<string> {
    try {
      this.logger.log(`Providing strategic advice for: ${challenge}`);

      const advice = await this.langChainService.consultantChat(
        `Provide strategic advice for this business challenge: ${challenge}`,
        industryType,
        { ...businessContext, challengeType: "strategic" }
      );

      return advice;
    } catch (error) {
      this.logger.error(
        `Strategic advice failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Analyze operational efficiency
   */
  async analyzeOperationalEfficiency(
    userId: string,
    sessionId: string,
    industryType: string,
    operationalData: Record<string, any>
  ): Promise<string> {
    try {
      this.logger.log(`Analyzing operational efficiency`);

      const analysis = await this.langChainService.consultantChat(
        "Analyze operational efficiency and provide improvement recommendations",
        industryType,
        { ...operationalData, analysisType: "operational_efficiency" }
      );

      return analysis;
    } catch (error) {
      this.logger.error(
        `Operational analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Generate market analysis
   */
  async generateMarketAnalysis(
    userId: string,
    sessionId: string,
    industryType: string,
    marketScope: "local" | "national" | "global",
    specificMarkets?: string[]
  ): Promise<string> {
    try {
      this.logger.log(`Generating market analysis for: ${industryType}`);

      const context = {
        industryType,
        marketScope,
        specificMarkets,
        analysisType: "market_analysis",
      };

      const analysis = await this.langChainService.consultantChat(
        `Provide comprehensive market analysis for ${marketScope} ${industryType} market`,
        industryType,
        context
      );

      return analysis;
    } catch (error) {
      this.logger.error(
        `Market analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  // Private helper methods

  private async generateRecommendations(
    context: Record<string, any>,
    consultationType: string,
    objectives?: string[]
  ): Promise<ConsultationRecommendation[]> {
    const recommendations: ConsultationRecommendation[] = [];

    // Generate recommendations based on consultation type
    const baseRecommendations = this.getBaseRecommendations(consultationType);

    baseRecommendations.forEach((rec, index) => {
      recommendations.push({
        id: `rec_${index + 1}`,
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        impact: rec.impact,
        effort: rec.effort,
        timeline: rec.timeline,
        dependencies: rec.dependencies || [],
      });
    });

    return recommendations;
  }

  private async generateImplementationPlan(
    recommendations: ConsultationRecommendation[]
  ): Promise<ImplementationStep[]> {
    const implementationSteps: ImplementationStep[] = [];

    // Group recommendations by priority and create phases
    const highPriority = recommendations.filter((r) => r.priority === "high");
    const mediumPriority = recommendations.filter(
      (r) => r.priority === "medium"
    );
    const lowPriority = recommendations.filter((r) => r.priority === "low");

    // Phase 1: High priority items
    if (highPriority.length > 0) {
      implementationSteps.push({
        id: "phase_1",
        phase: "Phase 1 - Quick Wins",
        title: "Immediate Actions",
        description:
          "Implement high-priority recommendations with immediate impact",
        duration: "1-3 months",
        resources: ["Management team", "Key stakeholders"],
        milestones: highPriority.map((r) => r.title),
        successMetrics: ["Quick ROI realization", "Process improvements"],
      });
    }

    // Phase 2: Medium priority items
    if (mediumPriority.length > 0) {
      implementationSteps.push({
        id: "phase_2",
        phase: "Phase 2 - Strategic Initiatives",
        title: "Strategic Implementation",
        description: "Execute medium-priority strategic initiatives",
        duration: "3-6 months",
        resources: ["Project teams", "External consultants"],
        milestones: mediumPriority.map((r) => r.title),
        successMetrics: [
          "Strategic goal achievement",
          "Operational efficiency",
        ],
      });
    }

    // Phase 3: Low priority items
    if (lowPriority.length > 0) {
      implementationSteps.push({
        id: "phase_3",
        phase: "Phase 3 - Long-term Optimization",
        title: "Continuous Improvement",
        description: "Implement long-term optimization initiatives",
        duration: "6-12 months",
        resources: ["Dedicated teams", "Technology resources"],
        milestones: lowPriority.map((r) => r.title),
        successMetrics: ["Long-term sustainability", "Competitive advantage"],
      });
    }

    return implementationSteps;
  }

  private async generateRiskAssessment(
    context: Record<string, any>,
    industryType: string
  ): Promise<string> {
    const risks = [
      "Implementation challenges",
      "Resource constraints",
      "Market conditions",
      "Competitive response",
      "Technology risks",
      "Regulatory changes",
    ];

    return `Risk assessment for ${industryType} implementation:
    
    Key risks identified: ${risks.join(", ")}
    
    Mitigation strategies should focus on careful planning, stakeholder engagement, 
    and phased implementation to minimize disruption and maximize success probability.`;
  }

  private async generateExpectedOutcomes(
    recommendations: ConsultationRecommendation[]
  ): Promise<string[]> {
    const outcomes: string[] = [];

    if (recommendations.some((r) => r.priority === "high")) {
      outcomes.push("Immediate operational improvements within 1-3 months");
    }

    if (recommendations.some((r) => r.impact === "high")) {
      outcomes.push("Significant business impact and ROI realization");
    }

    outcomes.push("Enhanced competitive positioning");
    outcomes.push("Improved operational efficiency");
    outcomes.push("Better strategic alignment");

    return outcomes;
  }

  private calculateConsultationConfidence(
    context: Record<string, any>
  ): number {
    let confidence = 0.8; // Base confidence

    // Increase confidence based on available data
    if (context.industryAnalysis) confidence += 0.1;
    if (context.solutionDesign) confidence += 0.05;
    if (context.needsAssessed) confidence += 0.05;

    return Math.min(confidence, 1.0);
  }

  private parseIndustryAnalysis(
    analysis: string,
    industryType: string
  ): IndustryInsight {
    // Simple parsing - in production, this could be more sophisticated
    return {
      industryType,
      marketTrends: [
        "Digital transformation",
        "Sustainability focus",
        "Customer-centric approaches",
      ],
      challenges: [
        "Market competition",
        "Regulatory compliance",
        "Technology adoption",
      ],
      opportunities: [
        "Market expansion",
        "Innovation",
        "Strategic partnerships",
      ],
      benchmarks: {
        "Growth Rate": 5.5,
        "Market Share": 15.0,
        "Customer Satisfaction": 85.0,
      },
      recommendations: [
        "Focus on digital transformation",
        "Enhance customer experience",
        "Invest in innovation",
      ],
      generatedAt: new Date(),
    };
  }

  private getBaseRecommendations(consultationType: string) {
    const recommendationTemplates = {
      strategy: [
        {
          title: "Strategic Vision Alignment",
          description:
            "Align organizational strategy with market opportunities",
          priority: "high" as const,
          impact: "high" as const,
          effort: "medium" as const,
          timeline: "2-3 months",
        },
        {
          title: "Competitive Positioning",
          description: "Strengthen competitive advantage and market position",
          priority: "high" as const,
          impact: "high" as const,
          effort: "high" as const,
          timeline: "3-6 months",
        },
      ],
      operations: [
        {
          title: "Process Optimization",
          description: "Streamline operational processes for efficiency",
          priority: "high" as const,
          impact: "medium" as const,
          effort: "medium" as const,
          timeline: "1-2 months",
        },
        {
          title: "Technology Integration",
          description:
            "Implement technology solutions for operational excellence",
          priority: "medium" as const,
          impact: "high" as const,
          effort: "high" as const,
          timeline: "3-4 months",
        },
      ],
      financial: [
        {
          title: "Financial Performance Review",
          description: "Analyze and optimize financial performance metrics",
          priority: "high" as const,
          impact: "high" as const,
          effort: "low" as const,
          timeline: "1 month",
        },
      ],
      technology: [
        {
          title: "Digital Transformation Strategy",
          description: "Develop comprehensive digital transformation roadmap",
          priority: "high" as const,
          impact: "high" as const,
          effort: "high" as const,
          timeline: "4-6 months",
        },
      ],
      marketing: [
        {
          title: "Market Positioning Strategy",
          description: "Enhance brand positioning and market presence",
          priority: "high" as const,
          impact: "medium" as const,
          effort: "medium" as const,
          timeline: "2-3 months",
        },
      ],
      general: [
        {
          title: "Business Assessment",
          description:
            "Comprehensive business health and opportunity assessment",
          priority: "high" as const,
          impact: "medium" as const,
          effort: "low" as const,
          timeline: "1-2 months",
        },
      ],
    };

    return (
      recommendationTemplates[consultationType] ||
      recommendationTemplates.general
    );
  }
}
