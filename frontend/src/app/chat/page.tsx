import Layout from "@/components/layout/layout";
import { Card } from "@/components/ui/card";
import AIChatInterface from "@/components/chat/ai-chat";

export default function ChatPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-font-light">
              AI Financial Assistant
            </h1>
            <p className="text-font-secondary text-lg">
              Dapatkan saran keuangan personal 24/7 dari AI yang memahami
              kondisi finansial Anda
            </p>
          </div>

          <Card className="glass-effect border-secondary-400/20">
            <AIChatInterface />
          </Card>
        </div>
      </div>
    </Layout>
  );
}
