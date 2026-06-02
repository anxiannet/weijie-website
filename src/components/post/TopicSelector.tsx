"use client";

const recommendedTopics = ["#学生租房", "#短租", "#西浦硕士", "#硕士留学", "#找室友"];

export function TopicSelector({ selected, onChange }: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  function toggle(topic: string) {
    onChange(selected.includes(topic) ? selected.filter((item) => item !== topic) : [...selected, topic]);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {recommendedTopics.map((topic) => {
        const active = selected.includes(topic);
        return (
          <button
            key={topic}
            type="button"
            onClick={() => toggle(topic)}
            className={active ? "shrink-0 rounded-full bg-brand px-3 py-2 text-sm font-semibold text-white" : "shrink-0 rounded-full bg-mist px-3 py-2 text-sm font-medium text-brand"}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}
