import { type Context, Hono } from 'hono';
import { WeaponTable } from '../components/WeaponTable';
import { armourRepository, weaponRepository } from '../database';
import { Armour } from '../model/armour';
import { convertWeaponToWeaponTableRow, WeaponTableRow } from '../model/weapon';
import { InfoPopoverContent } from '../components/InfoPopoverContent';
import { ArmourTable } from '../components/ArmourTable';
import { Tabs } from '../components/Tabs';

export const data = new Hono();

data.get('/armour-table', (context: Context) => {
  const armour = armourRepository
    .readAll()
    .map(({ id, description, ...rest }) => ({ ...rest })) as Armour[];

  return context.html(ArmourTable({ rows: armour }));
});

data.get('/armour-description/:name', (context: Context) => {
  const name = context.req.param('name').replace('-', ' ');

  const description = armourRepository.readDescriptionByArmourName(name)!;

  return context.html(
    InfoPopoverContent({
      content: [{ heading: name, text: description.description }],
    }),
  );
});

data.get('/weapon-table', (context: Context) => {
  const weapons = weaponRepository
    .readAll()
    .map(({ id, ...rest }) =>
      convertWeaponToWeaponTableRow({ ...rest }),
    ) as WeaponTableRow[];

  return context.html(WeaponTable({ weapons }));
});

data.get('/weapon-property/:property', (context: Context) => {
  const property = context.req.param('property');
  const rangedPropertyMatch = property.match(/(ammunition|thrown)/i);

  if (rangedPropertyMatch) {
    const ammunitionOrThrown = weaponRepository.readWeaponPropertyByName(
      rangedPropertyMatch[1],
    );
    const range = weaponRepository.readWeaponPropertyByName('range');
    const content = [
      {
        heading: ammunitionOrThrown[0].name,
        text: ammunitionOrThrown[0].description,
      },
      { heading: range[0].name, text: range[0].description },
    ];

    return context.html(InfoPopoverContent({ content }));
  }

  const propertyEntities = weaponRepository.readWeaponPropertyByName(property);

  const headingAndText = {
    heading: propertyEntities[0].name,
    text: propertyEntities[0].description,
  };

  return context.html(
    InfoPopoverContent({
      content: [headingAndText],
    }),
  );
});

data.get('table-tabs/:tab', (context: Context) => {
  // TODO: create tab content component
  // TODO: fetch requested content from db and return it in tab component 
  const tab = context.req.param('tab');

  return context.html(`<p>Tab</p>`);


});
