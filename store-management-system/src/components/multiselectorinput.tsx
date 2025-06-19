import React, { useState } from "react";

const MultiSelectorInput = ({ values }: { values: Array<object> }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([{ name: "" }]);
  const [selected, setSelected] = useState([{ name: "" }]);
  const [isFocused, setIsFocused] = useState(false); // Track focus

  const handleSuggestions = () => {
    setSuggestions(values as any);
  };

  const handleSelected=(e:any)=>{
    setSelected(prev=>[...prev,{name:e.target.value}])
  }

  return (
    <div
      className={`w-full px-3 py-2 rounded-md mt-1.5 text-gray-600 transition border-2 border-white flex flex-wrap ${
        isFocused ? "ring-2 ring-inset ring-blue-500" : ""
      }`}
    >
      <input
        type="text"
        className="outline-none w-full text-white font-bold bg-transparent"
        value={input}
        onChange={(e) => {
          setInput(e.target.value), handleSuggestions();
        }}
        onFocus={() => setIsFocused(true)} // Focus state true
        onBlur={() => setIsFocused(false)} // Remove focus on blur
        placeholder="Search Product here"
      />
      {selected.map((item, i) => (
        <span key={i} className="text-white mr-2">
          {item.name}
        </span>
      ))}
      {input && (
        <ul className="bg-white text-black ps-3 rounded-md ms-[-0.6%] mt-10 absolute z-50 w-[57%]">
          {suggestions.map((values, i) => <li key={i} className="ms-0" onClick={handleSelected}>{values.name}</li>)}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectorInput;
