export type Switch = {
  id: string;
  name: string;
  area: string;
  power: number;
  iconName: string;
  color: string;
  state: boolean;
};

const initialSwitches: Switch[] = [
  {
    id: "switch-1",
    name: "Switch 1",
    area: "Main Control",
    power: 150,
    iconName: "Lightbulb",
    color: "#fbbf24",
    state: false,
  }
];

const globalForSwitches = globalThis as unknown as {
  switches: Switch[];
};

if (!globalForSwitches.switches) {
  globalForSwitches.switches = [...initialSwitches];
}

export const getSwitches = () => globalForSwitches.switches;

export const getSwitch = (id: string) => globalForSwitches.switches.find(s => s.id === id);

export const updateSwitch = (id: string, state: boolean) => {
  globalForSwitches.switches = globalForSwitches.switches.map((s) => (s.id === id ? { ...s, state } : s));
  return globalForSwitches.switches;
};

export const setAllSwitches = (state: boolean) => {
  globalForSwitches.switches = globalForSwitches.switches.map((s) => ({ ...s, state }));
  return globalForSwitches.switches;
};
