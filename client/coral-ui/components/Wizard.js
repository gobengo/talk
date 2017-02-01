import React, {PropTypes} from 'react';

const Wizard = (props) => {
  const {children, currentStep, nextStep, previousStep, goToStep, className = ''} = props;
  return (
    <div>
      {React.Children.toArray(children)
        .filter((child, i) => i === currentStep)
        .map((child, i) =>
            React.cloneElement(child, {
              i,
              currentStep,
              nextStep,
              previousStep,
              goToStep
            })
      )}
    </div>
  );
};

Wizard.propTypes = {
  currentStep: PropTypes.number.isRequired,
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  goToStep: PropTypes.func.isRequired
}

export default Wizard;