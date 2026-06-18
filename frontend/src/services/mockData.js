export const mockDocuments = [
  { id: "1", name: "auth.md", type: "md", size: "12 KB", uploadedAt: "2025-06-10", status: "indexed" },
  { id: "2", name: "deployment_guide.pdf", type: "pdf", size: "245 KB", uploadedAt: "2025-06-09", status: "indexed" },
  { id: "3", name: "api_reference.txt", type: "txt", size: "38 KB", uploadedAt: "2025-06-08", status: "indexed" },
  { id: "4", name: "architecture_overview.md", type: "md", size: "56 KB", uploadedAt: "2025-06-07", status: "indexed" },
  { id: "5", name: "database_schema.pdf", type: "pdf", size: "189 KB", uploadedAt: "2025-06-05", status: "processing" },
];

export const mockChats = [
  { id: "1", title: "JWT authentication flow", preview: "How does token refresh work?", updatedAt: "2h ago" },
  { id: "2", title: "Kubernetes deployment setup", preview: "What's the recommended pod config?", updatedAt: "Yesterday" },
  { id: "3", title: "API rate limiting strategy", preview: "Explain the throttling middleware", updatedAt: "2 days ago" },
  { id: "4", title: "Database indexing best practices", preview: "Which columns should be indexed?", updatedAt: "3 days ago" },
];

export const mockMessages = {
  "1": [
    {
      id: "m1", role: "user",
      content: "How does JWT token refresh work in our system?",
      timestamp: "10:24 AM"
    },
    {
      id: "m2", role: "assistant",
      content: `## JWT Token Refresh Flow

Our system uses a **sliding window** refresh strategy with two token types:

1. **Access Token** — short-lived (15 min), used for API calls
2. **Refresh Token** — long-lived (7 days), stored in httpOnly cookie

### Refresh Process

\`\`\`typescript
// Token refresh endpoint
POST /auth/refresh
Cookie: refreshToken=<token>

// Response
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 900
}
\`\`\`

When the client receives a **401**, the auth interceptor automatically calls \`/auth/refresh\`. If the refresh token is also expired, the user is redirected to login.

The refresh token is **rotated** on each use to prevent token reuse attacks.`,
      sources: ["auth.md", "deployment_guide.pdf"],
      timestamp: "10:24 AM"
    },
  ],
  "2": [
    {
      id: "m3", role: "user",
      content: "What's the recommended Kubernetes pod configuration for our API service?",
      timestamp: "Yesterday"
    },
    {
      id: "m4", role: "assistant",
      content: `## Recommended Pod Configuration

Based on the deployment guide, here's the production-ready config:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: registry/api:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
\`\`\`

**Key settings:**
- Min 3 replicas for HA across zones
- Resource limits prevent noisy neighbour issues
- Health probes ensure traffic only hits healthy pods`,
      sources: ["deployment_guide.pdf"],
      timestamp: "Yesterday"
    },
  ],
};

export const mockStats = {
  documents: 5,
  chats: 12,
  queries: 84,
  tokensUsed: "1.2M",
};
