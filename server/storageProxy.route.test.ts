import express from "express";
import { describe, expect, it } from "vitest";
import { registerStorageProxy } from "./_core/storageProxy";

describe("storage proxy route", () => {
  it("registers the named wildcard route required by Express 5", () => {
    expect(() => registerStorageProxy(express())).not.toThrow();
  });
});
