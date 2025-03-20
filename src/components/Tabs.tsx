import { FormattingService } from "../services/formatting-service";

interface TabsProps {
  baseRoute: string
  tabHeadings: string[];
  selectedTabHeading: string;
  tabContent: any
}

const renderTabListButtons = (tabHeading: string, baseRoute: string, selected: boolean) => {
  return (
    <button
      hx-get={`${baseRoute}${FormattingService.convertToUriSafeString(tabHeading)}`}
      class={selected ? "selected" : ""}
      role="tab"
      aria-selected={selected ? "true" : "false"}
      aria-controls="tab-content"
    >
      {tabHeading}
    </button>
  );
}

export const Tabs = ({tabHeadings, baseRoute, selectedTabHeading, tabContent}: TabsProps) => {
  return (
    <>
      <div class="tab-list" role="tablist">
        {tabHeadings.map(tabHeading => renderTabListButtons(tabHeading, baseRoute, selectedTabHeading === tabHeading))}
      </div>

      <div id="tab-content" role="tabpanel" class="tab-content">
        {tabContent}
      </div>
    </>
  );
};
