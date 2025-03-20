import { CombinedWeaponProperty, WeaponTableRow } from '../model/weapon';
import { FormattingService } from '../services/formatting-service';

interface WeaponTableProps {
  weapons: WeaponTableRow[];
}

const renderWeaponCell = (key: string, value: CombinedWeaponProperty) => {
  if (key === 'properties' && Array.isArray(value)) {
    return (
      <td key={key}>
        {value.map((prop, index) => (
          <>
            <button
              className="info-popover"
              hx-get={`/data/weapon-property/${FormattingService.convertToUriSafeString(prop)}`}
              key={prop}
              hx-target="#info-popover"
              hx-swap="innerHTML"
              popovertarget="info-popover"
              popovertargetaction="show"
            >
              {index === 0 ? FormattingService.toTitleCase(prop) : prop}
            </button>
            {index < value.length - 1 ? ', ' : ''}
          </>
        ))}
      </td>
    );
  }

  return <td key={key}>{value ? String(value) : ''}</td>;
};

export const WeaponTable = ({ weapons }: WeaponTableProps) => {
  const headings = ['Name', 'Type', 'Cost', 'Weight', 'Damage', 'Properties'];

  return (
    <table>
      <thead>
        <tr>
          {headings.map(heading => (
            <th>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weapons.map((weapon, weaponIndex) => (
          <tr key={weaponIndex}>
            {Object.entries(weapon).map(([key, value]) =>
              renderWeaponCell(key, value),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
