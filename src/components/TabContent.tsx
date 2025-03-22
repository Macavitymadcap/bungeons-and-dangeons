import { Armour } from '../model/armour';
import { WeaponTableRow } from '../model/weapon';
import { ArmourTable } from './ArmourTable';
import { WeaponTable } from './WeaponTable';

interface TabContentProps {
  tab: string;
  armourData?: Armour[];
  weaponData?: WeaponTableRow[];
  className?: string;
}

export const TabContent = ({
  tab,
  armourData,
  weaponData,
  className = '',
}: TabContentProps) => {
  switch (tab.toLowerCase()) {
    case 'armour':
      return armourData ? (
        <div class={`tab-panel ${className}`}>
          <h2>Armour</h2>
          <ArmourTable rows={armourData} />
        </div>
      ) : (
        <div>Loading armour data...</div>
      );
    case 'weapons':
      return weaponData ? (
        <div class={`tab-panel ${className}`}>
          <h2>Weapons</h2>
          <WeaponTable weapons={weaponData} />
        </div>
      ) : (
        <div>Loading weapon data...</div>
      );
    default:
      return (
        <div class={`tab-panel ${className}`}>Select a tab to view data</div>
      );
  }
};
