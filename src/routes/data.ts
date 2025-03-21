import { type Context, Hono } from 'hono';
import { WeaponTable } from '../components/WeaponTable';
import { InfoPopoverContent } from '../components/InfoPopoverContent';
import { ArmourTable } from '../components/ArmourTable';
import { Tabs } from '../components/Tabs';
import { TabContent } from '../components/TabContent';
import { FormattingService } from '../services/formatting.service';

// Import services instead of direct repository access
import { armourService, weaponService, sharedDataService } from '../data';

export const data = new Hono();

data.get('/armour-table', (context: Context) => {
  // Use the service instead of the repository
  const armour = armourService.getAllArmour();
  return context.html(ArmourTable({ rows: armour }));
});

data.get('/armour-description/:name', (context: Context) => {
  const name = context.req.param('name').replace('-', ' ');
  
  // Use the service method
  const description = armourService.getArmourDescription(name);
  
  if (!description) {
    return context.html('<p>No description found</p>');
  }

  return context.html(
    InfoPopoverContent({
      content: [{ heading: name, text: description }],
    }),
  );
});

data.get('/weapon-table', (context: Context) => {
  // Use the service method that already returns table-formatted data
  const weapons = weaponService.getAllWeaponsForTable();
  return context.html(WeaponTable({ weapons }));
});

data.get('/weapon-property/:property', (context: Context) => {
  const property = context.req.param('property');
  const rangedPropertyMatch = property.match(/(ammunition|thrown)/i);

  if (rangedPropertyMatch) {
    const ammunitionOrThrown = weaponService.getWeaponPropertyByName(
      rangedPropertyMatch[1]
    );
    const range = weaponService.getWeaponPropertyByName('range');
    
    if (!ammunitionOrThrown || !range) {
      return context.html('<p>Property not found</p>');
    }
    
    const content = [
      {
        heading: ammunitionOrThrown.name,
        text: ammunitionOrThrown.description,
      },
      { heading: range.name, text: range.description },
    ];

    return context.html(InfoPopoverContent({ content }));
  }

  const propertyEntity = weaponService.getWeaponPropertyByName(property);
  
  if (!propertyEntity) {
    return context.html('<p>Property not found</p>');
  }

  const headingAndText = {
    heading: propertyEntity.name,
    text: propertyEntity.description,
  };

  return context.html(
    InfoPopoverContent({
      content: [headingAndText],
    }),
  );
});

// Tabs route handler
data.get('/tabs', (context: Context) => {
  const tabHeadings = ['Armour', 'Weapons'];
  const selectedTabHeading = 'Armour'; // Default selected tab
  
  // Get the data for the initial tab view
  const { armourData } = sharedDataService.getTabData(selectedTabHeading);
  
  const tabContent = TabContent({ 
    tab: selectedTabHeading, 
    armourData
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

// Tab content route handler
data.get('/tabs/:tab', (context: Context) => {
  const tab = context.req.param('tab');
  const tabName = FormattingService.toTitleCase(tab.replace('-', ' '));
  
  // Get data based on selected tab using the shared service
  const { armourData, weaponData } = sharedDataService.getTabData(tab);
  
  return context.html(
    Tabs({
      baseRoute: '/data/tabs/',
      tabHeadings: ['Armour', 'Weapons'],
      selectedTabHeading: tabName,
      tabContent: TabContent({ 
        tab: tabName, 
        armourData, 
        weaponData 
      })
    })
  );
});
