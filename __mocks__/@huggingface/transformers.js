module.exports = {
  pipeline: jest.fn().mockResolvedValue(jest.fn().mockResolvedValue([{ generated_text: 'Test response' }])),
  env: { allowLocalModels: false }
};