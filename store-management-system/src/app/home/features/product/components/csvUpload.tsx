"use client";
import React, { useRef, useState } from "react";
import Button from "@/components/Button";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { UploadCloud, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { parseAndImportExcelOrCsv } from "../utils/excelFunctions";
import ExcelTemplateCallout from "./csv/ExcelTemplateCallout";
import FileDropzone from "./csv/FileDropzone";
import ImportResultsSummary, { ImportResult } from "./csv/ImportResultsSummary";

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
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

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
      onClose={cancelUpload}
    >
      <div className="space-y-4">
        <ExcelTemplateCallout />

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
          <Sparkles size={16} className="text-cyan-400 shrink-0" />
          <span>
            <strong>✨ Smart AI Auto-Enrichment Active:</strong> If your
            spreadsheet is missing image links, descriptions, or warranties, our
            AI automatically generates and saves them to the database.
          </span>
        </div>

        {!importResult ? (
          <FileDropzone
            file={file}
            fileInputRef={fileInputRef}
            isDragging={isDragging}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onFileSelect={handleFileSelect}
            onReset={handleReset}
          />
        ) : (
          <ImportResultsSummary importResult={importResult} />
        )}

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
