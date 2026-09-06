import React, { RefObject } from "react";
import { UploadCloud, FileText } from "lucide-react";

interface FileDropzoneProps {
  file: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export default function FileDropzone({
  file,
  fileInputRef,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onReset,
}: FileDropzoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !file && fileInputRef.current?.click()}
      className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
        isDragging
          ? "border-cyan-400 bg-cyan-500/10"
          : file
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
      }`}
    >
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        ref={fileInputRef}
        onChange={onFileSelect}
        className="hidden"
      />

      {file ? (
        <div className="space-y-3 w-full flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{file.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {(file.size / 1024).toFixed(1)} KB &bull;{" "}
              {file.name.endsWith(".xlsx")
                ? "Microsoft Excel Workbook"
                : "Spreadsheet Document"}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className="text-xs text-rose-400 hover:underline pt-1 cursor-pointer"
          >
            Choose a different file
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center mx-auto">
            <UploadCloud size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">
              Click to browse or drag & drop Excel (.xlsx) or CSV here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports Microsoft Excel .xlsx workbooks & .csv files up to 25MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
