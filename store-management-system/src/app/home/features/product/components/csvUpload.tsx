"use client";
import React, { useRef, useState } from "react";
import Button from "@/components/Button";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Loader2,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import {
  downloadStyledExcelTemplate,
  parseAndImportExcelOrCsv,
} from "../utils/excelFunctions";
import { downloadSampleProductCsv } from "../utils/fileFunctions";

type CsvUploadProps = {
  cancelUpload: () => void;
  onImportSuccess?: () => void;
  isDark?: boolean;
};

function CsvUpload({
  cancelUpload,
  onImportSuccess,
  isDark = false,
}: CsvUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (fileObj: File) => {
    const name = fileObj.name.toLowerCase();
    return (
      name.endsWith(".xlsx") ||
      name.endsWith(".xls") ||
      name.endsWith(".csv") ||
      fileObj.type.includes("spreadsheet") ||
      fileObj.type.includes("excel") ||
      fileObj.type.includes("csv")
    );
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && isValidFile(dropped)) {
      setFile(dropped);
      setImportResult(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && isValidFile(selected)) {
      setFile(selected);
      setImportResult(null);
    }
  };

  const handleStartImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    const result = await parseAndImportExcelOrCsv(file, (p) => {
      setProgress(p);
    });

    setIsProcessing(false);
    setImportResult(result);

    if (result.successCount > 0 && onImportSuccess) {
      onImportSuccess();
    }
  };

  const handleReset = () => {
    setFile(null);
    setImportResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <BlurredPopupLayout
      title="Import Products via Excel / CSV"
      subtitle="Bulk upload new products, categories, pricing, and color variants"
      icon={<UploadCloud size={20} />}
      isDark={isDark}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Styled Excel Template Callout with in-cell Category Dropdowns */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/30 text-xs space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 text-cyan-300">
              <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-400 shrink-0">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-white text-sm">
                    Designed Excel Template (.xlsx)
                  </p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                    <Sparkles size={10} /> In-Cell Dropdowns
                  </span>
                </div>
                <p className="text-cyan-200/80 text-xs mt-0.5">
                  Features built-in dropdown lists for <strong>Category</strong>{" "}
                  & <strong>Warranty</strong> to prevent typos!
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                type="button"
                onClick={downloadStyledExcelTemplate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition shadow-md shadow-cyan-500/20 cursor-pointer text-xs"
              >
                <Download size={14} />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={downloadSampleProductCsv}
                className="text-[10px] text-cyan-400/80 hover:text-cyan-300 text-right underline cursor-pointer"
              >
                or download .csv
              </button>
            </div>
          </div>
        </div>

        {/* AI Auto-Enrichment Notice */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
          <Sparkles size={16} className="text-cyan-400 shrink-0" />
          <span>
            <strong>✨ Smart AI Auto-Enrichment Active:</strong> If your
            spreadsheet is missing image links, descriptions, or warranties, our
            AI automatically generates and saves them to the database.
          </span>
        </div>

        {/* Dropzone or Result View */}
        {!importResult ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
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
              onChange={handleFileSelect}
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
                    handleReset();
                  }}
                  className="text-xs text-rose-400 hover:underline pt-1"
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
                    Supports Microsoft Excel .xlsx workbooks & .csv files up to
                    25MB
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Import Results Card */
          <div className="space-y-3">
            <div
              className={`p-4 rounded-2xl border ${
                importResult.errorCount === 0
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : importResult.successCount > 0
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-rose-500/10 border-rose-500/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {importResult.errorCount === 0 ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={20} className="text-amber-400" />
                )}
                <h4 className="text-sm font-bold text-white">
                  Import Results Summary
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-2 my-2 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-xs text-slate-400">Total Rows</p>
                  <p className="text-base font-bold text-white">
                    {importResult.totalRows}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 font-semibold">
                    Imported
                  </p>
                  <p className="text-base font-bold text-emerald-300">
                    {importResult.successCount}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs text-rose-400 font-semibold">Errors</p>
                  <p className="text-base font-bold text-rose-300">
                    {importResult.errorCount}
                  </p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 max-h-32 overflow-y-auto space-y-1">
                  <p className="text-[11px] font-bold text-rose-400">
                    Details & Warnings:
                  </p>
                  {importResult.errors.map((err, idx) => (
                    <p
                      key={idx}
                      className="text-[11px] text-slate-300 font-mono"
                    >
                      &bull; {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin" /> Processing
                spreadsheet records...
              </span>
              <span className="text-white font-mono">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <Button
            type="button"
            name={importResult ? "Done" : "Cancel"}
            variant="ghost"
            handler={cancelUpload}
          />
          {importResult ? (
            <Button
              type="button"
              name="Upload Another"
              variant="secondary"
              icon={<RotateCcw size={14} />}
              handler={handleReset}
            />
          ) : (
            <Button
              type="button"
              name="Start Import"
              variant="primary"
              disabled={!file || isProcessing}
              loading={isProcessing}
              icon={<UploadCloud size={16} />}
              handler={handleStartImport}
            />
          )}
        </div>
      </div>
    </BlurredPopupLayout>
  );
}

export default CsvUpload;
