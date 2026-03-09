import { handleModelCommand, listAvailableModels } from "./ai";
import { getAvailableModels, getCurrentModel, switchModel } from "../../services/ai";

jest.mock("../../services/ai", () => ({
  getAvailableModels: jest.fn(),
  getCurrentModel: jest.fn(),
  switchModel: jest.fn(),
}));

describe("ai.ts handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAvailableModels as jest.Mock).mockReturnValue([
      { name: "model-1", displayName: "Model 1", description: "First model" },
      { name: "model-2", displayName: "Model 2", description: "Second model" },
    ]);
    (getCurrentModel as jest.Mock).mockReturnValue({
      name: "model-1",
      displayName: "Model 1",
      description: "First model",
    });
  });

  describe("handleModelCommand", () => {
    it("should show current model when no arguments are provided", async () => {
      const parsed = { command: "model", args: [], original: "/model", originalInput: "/model" };
      const response = await handleModelCommand(parsed);
      expect(response).toContain("Current AI model: Model 1");
      expect(response).toContain("First model");
    });

    it("should return error for invalid model number", async () => {
      const parsed = { command: "model", args: ["invalid-model"], original: "/model invalid-model", originalInput: "/model invalid-model" };
      const response = await handleModelCommand(parsed);
      expect(response).toContain("Invalid model number");
      expect(response).toContain("Please use a number");
    });

    it("should return error for out of bounds model number", async () => {
      const parsed = { command: "model", args: ["5"], original: "/model 5", originalInput: "/model 5" };
      const response = await handleModelCommand(parsed);
      expect(response).toContain("Invalid model number. Please choose a number between 0 and 1.");

      const parsedNegative = { command: "model", args: ["-1"], original: "/model -1", originalInput: "/model -1" };
      const responseNegative = await handleModelCommand(parsedNegative);
      expect(responseNegative).toContain("Invalid model number");
    });

    it("should switch to model and return success message", async () => {
      (switchModel as jest.Mock).mockReturnValue(true);
      (getCurrentModel as jest.Mock).mockReturnValue({
        name: "model-2",
        displayName: "Model 2",
        description: "Second model",
      });

      const parsed = { command: "model", args: ["1"], original: "/model 1", originalInput: "/model 1" };
      const response = await handleModelCommand(parsed);
      expect(switchModel).toHaveBeenCalledWith(1);
      expect(response).toContain("Switched to model: Model 2");
      expect(response).toContain("Second model");
    });

    it("should return error if model switch fails", async () => {
      (switchModel as jest.Mock).mockReturnValue(false);

      const parsed = { command: "model", args: ["1"], original: "/model 1", originalInput: "/model 1" };
      const response = await handleModelCommand(parsed);
      expect(switchModel).toHaveBeenCalledWith(1);
      expect(response).toContain("Failed to switch models. Please try again.");
    });
  });

  describe("listAvailableModels", () => {
    it("should list available models and mark current one", async () => {
      const response = await listAvailableModels();
      expect(response).toContain("Available AI Models:");
      expect(response).toContain("0: Model 1 (current)");
      expect(response).toContain("First model");
      expect(response).toContain("1: Model 2");
      expect(response).toContain("Second model");
      expect(response).toContain("To switch models, type /model <number>");
    });
  });
});
