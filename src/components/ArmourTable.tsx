import { Armour } from '../model/armour';
import { FormattingService } from '../services/formatting-service';

interface ArmourTableProps {
  rows: Armour[];
}

const renderArmourCell = (key: string, value: string) => {
  if (key === 'name') {
    return (
      <td key={key}>
        <button
          className="info-popover"
          hx-get={`/data/armour-description/${FormattingService.convertToUriSafeString(value)}`}
          key={key}
          hx-target="#info-popover"
          hx-swap="innerHTML"
          popovertarget="info-popover"
          popovertargetaction="show"
        >
          {FormattingService.toTitleCase(value)}
        </button>
      </td>
    );
  }

  return <td key={key}>{value ? String(value) : ''}</td>;
};

export const ArmourTable = ({ rows }: ArmourTableProps) => {
  const headings = [
    'Name',
    'Type',
    'Cost',
    'Armour Class',
    'Stealth',
    'Strength',
    'Weight',
  ];

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
        {rows.map(row => (
          <tr>
            {Object.entries(row).map(([key, value]) =>
              renderArmourCell(key, value),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
