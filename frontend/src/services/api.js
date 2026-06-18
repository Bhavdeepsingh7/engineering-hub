import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

// Simulate AI response
export const sendMessage = async (chatId, message, onChunk) => {
  const responses = [
    `## Answer\n\nBased on your documentation, here's what I found:\n\nThe system uses a **microservices architecture** with event-driven communication via Kafka. Each service owns its data and communicates asynchronously.\n\n\`\`\`typescript\n// Service registration\nconst service = new ServiceRegistry({\n  name: 'auth-service',\n  version: '2.1.0',\n  health: '/health'\n});\n\`\`\`\n\n**Key patterns used:**\n- CQRS for read/write separation\n- Saga pattern for distributed transactions\n- Circuit breaker via Resilience4j`,
    `## Summary\n\nYour documentation mentions this pattern extensively in the architecture section.\n\nThe deployment uses **blue-green strategy** to ensure zero downtime:\n\n1. Deploy new version to green environment\n2. Run smoke tests automatically\n3. Switch load balancer to green\n4. Keep blue running for quick rollback\n\n\`\`\`bash\n# Switch traffic\nkubectl patch service api-svc -p '{"spec":{"selector":{"slot":"green"}}}'\n\`\`\``,
    `Based on **auth.md**, the authentication middleware validates tokens using RS256 asymmetric signing. The public key is fetched from \`/.well-known/jwks.json\` and cached for 5 minutes.\n\nThis approach allows **stateless verification** — any service can validate tokens without calling the auth service.`,
  ];

  return new Promise((resolve) => {
    const response = responses[Math.floor(Math.random() * responses.length)];
    const sources = ["auth.md", "deployment_guide.pdf", "architecture_overview.md"].slice(0, Math.ceil(Math.random() * 3));
    setTimeout(() => resolve({ content: response, sources }), 1200 + Math.random() * 800);
  });
};

export default api;
