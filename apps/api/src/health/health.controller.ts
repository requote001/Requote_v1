import { Controller, Get, Version } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get("live")
  @Version("1")
  live() {
    return { status: "ok", service: "requote-api", check: "liveness" };
  }

  @Get("ready")
  @Version("1")
  ready() {
    return {
      status: "ok",
      service: "requote-api",
      check: "readiness",
      dependencies: { database: "not-configured", redis: "not-configured" },
    };
  }
}
