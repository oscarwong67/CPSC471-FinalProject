const validateInput = (inputString) => inputString && inputString.length > 0;

const validateInputs = (inputs) => {
    for (let i = 0; i < inputs.length; i++) {
        if (! validateInput(inputs[i])) {
            return false;
        }
    }
    return true;
}

module.exports = { validateInput, validateInputs };