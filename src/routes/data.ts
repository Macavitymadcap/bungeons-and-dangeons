import { type Context, Hono } from 'hono';
import { WeaponTable } from '../components/WeaponTable';
import { armourRepository, weaponRepository } from '../database';
import { Armour } from '../model/armour';
import { convertWeaponToWeaponTableRow, WeaponTableRow } from '../model/weapon';
import { InfoPopoverContent } from '../components/InfoPopoverContent';
import { ArmourTable } from '../components/ArmourTable';
import { Tabs } from '../components/Tabs';
import { FormattingService } from '../services/formatting-service';
import { TabContent } from '../components/TabContent';

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

data.get('/tabs', (context: Context) => {
  const tabHeadings = ['Armour', 'Weapons'];
  const selectedTabHeading = 'Armour'; // Default selected tab
  
  // Get the data for the initial tab view
  const armour = armourRepository
    .readAll()
    .map(({ id, description, ...rest }) => ({ ...rest })) as Armour[];
  
  const tabContent = TabContent({ 
    tab: selectedTabHeading, 
    armourData: armour
  });
  
  return context.html(
    Tabs({
      baseRoute: '/data/tabs/',
      tabHeadings,
      selectedTabHeading,
      tabContent
    })
  );
});

data.get('/tabs/:tab', (context: Context) => {
  const tab = context.req.param('tab');
  const tabName = FormattingService.toTitleCase(tab.replace(/\s+/g, ' '));
  
  // Get data based on selected tab
  if (tab.toLowerCase() === 'armour') {
    const armour = armourRepository
      .readAll()
      .map(({ id, description, ...rest }) => ({ ...rest })) as Armour[];
    
    return context.html(
      Tabs({
        baseRoute: '/data/tabs/',
        tabHeadings: ['Armour', 'Weapons'],
        selectedTabHeading: tabName,
        tabContent: TabContent({ tab: tabName, armourData: armour })
      })
    );
  } else if (tab.toLowerCase() === 'weapons') {
    const weapons = weaponRepository
      .readAll()
      .map(({ id, ...rest }) =>
        convertWeaponToWeaponTableRow({ ...rest }),
      ) as WeaponTableRow[];
    
    return context.html(
      Tabs({
        baseRoute: '/data/tabs/',
        tabHeadings: ['Armour', 'Weapons'],
        selectedTabHeading: tabName,
        tabContent: TabContent({ tab: tabName, weaponData: weapons })
      })
    );
  }
  
  // Fallback for unknown tabs
  return context.html(
    Tabs({
      baseRoute: '/data/tabs/',
      tabHeadings: ['Armour', 'Weapons'],
      selectedTabHeading: tabName,
      tabContent: TabContent({ tab: tabName })
    })
  );
});
