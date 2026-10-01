import { describe, expect, it } from "vitest";
import { GET } from "../app/api/health/route";

describe("Health API", () => {
  it("should return a healthy service status", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.service).toBe("devops-ci-demo");
    expect(data.timestamp).toBeDefined();
  });
});
