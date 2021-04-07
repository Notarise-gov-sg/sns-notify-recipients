import { trace } from "./logger";

/**
 * A health check to ensure module is exported correctly.
 * @returns {String} Returns "Healthy".
 */
const healthCheck = (): string => {
  trace("Healthy");
  return "Healthy";
};

export { healthCheck };
