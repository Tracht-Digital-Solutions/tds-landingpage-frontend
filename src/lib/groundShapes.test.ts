import { describe, expect, it } from "vitest";
import { GROUND_KINDS, generateGround } from "./groundShapes";

describe("the page ground's generated shapes", () => {
  it("are the same on every render, so the cached page never differs", () => {
    expect(generateGround()).toEqual(generateGround());
    expect(generateGround(1)).not.toEqual(generateGround(2));
  });

  it("draw three planes, slower the farther they lie", () => {
    const planes = generateGround();
    expect(planes.map((plane) => plane.id)).toEqual(["far", "mid", "near"]);
    const speeds = planes.map((plane) => plane.speed);
    expect([...speeds].sort((a, b) => a - b)).toEqual(speeds);
  });

  it("use only the shared constructed shapes and brand colours", () => {
    for (const shape of generateGround().flatMap((plane) => plane.shapes)) {
      expect(GROUND_KINDS).toContain(shape.kind);
      expect(["navy", "bordeaux", "coral", "gold"]).toContain(shape.colour);
    }
  });

  it("start inside their tile and keep out of the middle of the page", () => {
    for (const seed of [1, 2, 3, 42, 2005]) {
      for (const plane of generateGround(seed)) {
        for (const shape of plane.shapes) {
          expect(shape.y).toBeGreaterThanOrEqual(0);
          expect(shape.y).toBeLessThan(100);
          expect(shape.x).toBeGreaterThan(-16);
          expect(shape.x).toBeLessThan(100);
          expect(shape.x < 20 || shape.x > 70).toBe(true);
        }
      }
    }
  });

  it("stay few and large, so each reads as a 3D body", () => {
    const planes = generateGround();
    expect(planes.flatMap((plane) => plane.shapes).length).toBeLessThanOrEqual(6);
    for (const shape of planes.find((plane) => plane.id === "near")?.shapes ?? []) {
      expect(shape.width).toBeGreaterThanOrEqual(16);
    }
  });

  it("never stack two bodies of one plane on each other", () => {
    for (const plane of generateGround()) {
      plane.shapes.forEach((shape, index) => {
        for (const other of plane.shapes.slice(index + 1)) {
          expect(Math.hypot(shape.x - other.x, shape.y - other.y)).toBeGreaterThan(10);
        }
      });
    }
  });
});
