import express from "express";
import { describe, expect, it } from "vitest";
import { serveStatic } from "./_core/vite";

describe("production static fallback", () => {
  it("registers without wildcard route parsing errors", () => {
    expect(() => serveStatic(express())).not.toThrow();
  });
});
