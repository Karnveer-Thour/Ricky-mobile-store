import React, { useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import cn from "classnames";

const SelectedItems = ({
  name,
  i,
  handler,
  isDark = false,
}: {
  name: string;
  i: number;
  handler: (name: string) => void;
  isDark?: boolean;
}) => {
  if (!name) return null;

  return (
    <span
      key={i}
      className={cn(
        "mr-2 mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors",
        isDark
          ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
          : "bg-cyan-50 text-cyan-800 border-cyan-200 shadow-2xs",
      )}
    >
      <span>{name}</span>
      <button
        type="button"
        className="hover:cursor-pointer hover:opacity-75 focus:outline-none"
        onClick={() => handler(name)}
      >
        <X size={13} />
      </button>
    </span>
  );
};

const MultiSelectorInput = ({
  values,
  isDark: isDarkProp,
}: {
  values: Array<{ name: string }>;
  isDark?: boolean;
}) => {
  const reduxDark = useSelector((state: storeType) => state.DarkMode?.isDarkMode);
  const isDark = isDarkProp !== undefined ? isDarkProp : reduxDark ?? false;

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ name: string }>>([]);
  const [selected, setSelected] = useState<Array<{ name: string }>>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSuggestions = (search: string) => {
    const filtered = values.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        !selected.some((sel) => sel.name === item.name),
    );
    setSuggestions(filtered);
  };

  const handleSelected = (name: string) => {
    if (!name.trim()) return;
    setSelected((prev) => [...prev, { name }]);
    setInput("");
    setSuggestions([]);
  };

  const handleDelete = (name: string) => {
    const filtered = selected.filter((item) => item.name !== name);
    setSelected(filtered);
  };

  return (
    <div
      className={cn(
        "relative w-full px-3 py-2 rounded-xl border transition-all duration-150 flex flex-wrap items-center",
        isDark
          ? "bg-slate-900 border-slate-700/60 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-xs",
        isFocused && (isDark ? "border-[#00cfff] ring-1 ring-[#00cfff]/30" : "border-[#00cfff] ring-1 ring-[#00cfff]/30"),
      )}
    >
      {selected.map((item, i) => (
        <SelectedItems
          key={i}
          name={item.name}
          i={i}
          handler={handleDelete}
          isDark={isDark}
        />
      ))}
      <input
        type="text"
        className={cn(
          "outline-none flex-1 min-w-[120px] text-sm font-medium bg-transparent py-1",
          isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400",
        )}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleSuggestions(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder="Search and select..."
      />
      {input && suggestions.length > 0 && (
        <ul
          className={cn(
            "absolute left-0 top-full mt-1.5 z-50 w-full max-h-60 overflow-y-auto rounded-xl border shadow-xl p-1.5 transition-all duration-150 backdrop-blur-xl",
            isDark
              ? "bg-slate-900/95 border-slate-700 text-white shadow-black/60"
              : "bg-white border-slate-200 text-slate-800 shadow-slate-300/60",
          )}
        >
          {suggestions.map((item, i) => (
            <li
              key={i}
              className={cn(
                "cursor-pointer px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                isDark ? "hover:bg-slate-800 text-slate-200" : "hover:bg-slate-100 text-slate-800",
              )}
              onClick={() => handleSelected(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectorInput;
