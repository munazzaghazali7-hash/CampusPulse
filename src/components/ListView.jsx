import NoticeCard from './NoticeCard';

/** Vertical list of NoticeCards. */
export default function ListView({ notices, onRemove, onCopy }) {
  return (
    <div className="list-view" role="list" aria-label="Notice list">
      {notices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          onRemove={onRemove}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}
