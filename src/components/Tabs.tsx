import { FormattingService } from '../services/formatting.service';

interface TabsProps {
  baseRoute: string;
  tabHeadings: string[];
  selectedTabHeading: string;
  tabContent: any;
}

const renderTabListButtons = (
  tabHeading: string,
  baseRoute: string,
  selected: boolean,
) => {
  const safeTabName = FormattingService.convertToUriSafeString(tabHeading);

  return (
    <button
      hx-get={`${baseRoute}${safeTabName}`}
      hx-target="#tab-container"
      hx-swap="outerHTML"
      class={`text ${selected ? 'selected' : ''}`}
      role="tab"
      aria-selected={selected ? 'true' : 'false'}
      aria-controls="tab-content"
    >
      {tabHeading}
    </button>
  );
};

export const Tabs = ({
  tabHeadings,
  baseRoute,
  selectedTabHeading,
  tabContent,
}: TabsProps) => {
  return (
    <div id="tab-container">
      <div class="tab-list" role="tablist">
        {tabHeadings.map(tabHeading =>
          renderTabListButtons(
            tabHeading,
            baseRoute,
            selectedTabHeading === tabHeading,
          ),
        )}
      </div>

      <div id="tab-content" role="tabpanel" class="tab-content">
        {tabContent}
      </div>
    </div>
  );
};
