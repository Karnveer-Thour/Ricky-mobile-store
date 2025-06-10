function Loader({ size = 150, color = "#2563eb", lineSize = 10 }) {
  return (
    <div className="flex items-center justify-center h-[90vh]">
      <div
        className="animate-spin rounded-full border-t-transparent mb-22"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${lineSize}px`,
          borderStyle: "solid",
          borderColor: `${color}`,
          borderTopColor: "transparent",
        }}
      ></div>
    </div>
  );
}

export default Loader;
