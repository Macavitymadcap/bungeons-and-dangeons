import { FormattingService } from '../services/formatting-service';

interface HeadingAndText {
  heading: string;
  text: string;
}

interface InfoPopoverContentProps {
  content: HeadingAndText[];
}

export const InfoPopoverContent = ({ content }: InfoPopoverContentProps) => {
  return (
    <>
      <button
        className="destructive"
        popovertarget="info-popover"
        popovertargetaction="hide"
      >
        &#10006;
      </button>
      {content.map((item, itemIndex) => (
        <div key={itemIndex}>
          <h2>{FormattingService.toTitleCase(item.heading)}</h2>
          {item.text.split('\n').map((line, lineIndex) => (
            <p key={`${itemIndex}-${lineIndex}`}>{line}</p>
          ))}
        </div>
      ))}
    </>
  );
};
