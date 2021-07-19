const core = jest.createMockFromModule('@actions/core');

inputs = {}
core.setInputs = (manualInputs) => {
  Object.assign(inputs, manualInputs)
}

core.clearInputs = () => {
  inputs = {}
}

core.getInput = (val) => {
  return inputs[val];
}

module.exports = core;
