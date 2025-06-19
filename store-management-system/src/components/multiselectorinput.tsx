import React, { useState } from "react";
import { Ban } from "lucide-react";

const SelectedItems = ({
  name,
  i,
  handler,
}: {
  name: string;
  i: number;
  handler: (name: string) => void;
}) => {
  if (!name) return null;

  return (
    <span
      key={i}
      className="text-gray-700 mr-2 mb-1 flex items-center gap-2 font-bold border-2 bg-gray-300 rounded-md px-2 py-1"
    >
      <span>{name}</span>
      <button
        className="hover:cursor-pointer focus:text-red-500"
        onClick={() => handler(name)}
      >
        <Ban size={16} />
      </button>
    </span>
  );
};

const MultiSelectorInput = ({ values }: { values: Array<{ name: string }> }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ name: string }>>([]);
  const [selected, setSelected] = useState<Array<{ name: string }>>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSuggestions = (search: string) => {
    const filtered = values.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        !selected.some((sel) => sel.name === item.name)
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
      className={`w-full px-3 py-2 rounded-md mt-1.5 text-gray-600 transition border-2 border-white flex flex-wrap ${
        isFocused ? "ring-2 ring-inset ring-blue-500" : ""
      }`}
    >
      {selected.map((item, i) => (
        <SelectedItems key={i} name={item.name} i={i} handler={handleDelete} />
      ))}
      <input
        type="text"
        className="outline-none w-full text-white font-bold bg-transparent"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleSuggestions(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Let click event trigger first
        placeholder="Search Product here"
      />
      {input && suggestions.length > 0 && (
        <ul className="bg-white text-black ps-3 rounded-md ms-[-0.6%] mt-10 absolute z-50 w-[57%] max-h-60 overflow-y-auto">
          {suggestions.map((item, i) => (
            <li
              key={i}
              className="cursor-pointer hover:bg-gray-200 px-2 py-1"
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