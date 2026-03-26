import { useCallback, useState } from "react";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import BasicInfoForm from "./components/basic-info-form";
import EnvironmentVariablesForm from "./components/env-vars-form";
import VolumesForm from "./components/volumes-form";
import { usePluginWizardStore } from "./store";

interface FormStep {
  name: string;
  component: React.ComponentType<FormStepProps> | null;
}

export interface FormStepProps {
  onNext?: () => void;
  onBack?: () => void;
  onCancel: () => void;
}

const formSteps: FormStep[] = [
  { name: "Basic Info", component: BasicInfoForm },
  { name: "Environment Variables", component: EnvironmentVariablesForm },
  { name: "Volumes", component: VolumesForm },
  { name: "Review & Create", component: null },
];

function PluginWizard() {
  const [activeStep, setActiveStep] = useState(0);

  const hasHydrated = usePluginWizardStore.persist.hasHydrated;

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleCancel = useCallback(() => {
    // show a dialog box to confirm cancel. If yes, go to plugin page
    const confirmCancel = window.confirm("Are you sure you want to cancel?");
    if (confirmCancel) {
      usePluginWizardStore.getState().reset();
      // Navigate to home page
    }
  }, []);

  const ActiveComponent = formSteps[activeStep].component;
  if (!hasHydrated) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {formSteps.map(({ name }) => {
          return (
            <Step key={name}>
              <StepLabel>{name}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box sx={{ mt: 4, mb: 1 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {formSteps[activeStep].name}
        </Typography>
        {ActiveComponent ? (
          <ActiveComponent
            onNext={activeStep < formSteps.length - 1 ? handleNext : undefined}
            onBack={activeStep > 0 ? handleBack : undefined}
            onCancel={handleCancel}
          />
        ) : (
          <Typography variant="body1">
            Review your plugin configuration and create your plugin.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default PluginWizard;
