import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { type PluginWizardForm } from "./schemas";

type PluginWizardState = Partial<PluginWizardForm> & {
  setData: (data: Partial<PluginWizardForm>) => void;
  reset: () => void;
};

const defaultPluginWizardState: Partial<PluginWizardForm> = {
  name: "",
  description: "",
  imageURL: "",
  tag: "",

  envVars: [],
};

export const usePluginWizardStore = create<PluginWizardState>()(
  persist(
    (set) => ({
      setData: (data) => set(data),
      reset: () => {
        set(defaultPluginWizardState);
        localStorage.removeItem("plugin-wizard-storage");
      },
      ...defaultPluginWizardState,
    }),
    {
      name: "plugin-wizard-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
