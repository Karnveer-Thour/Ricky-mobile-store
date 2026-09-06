import React from "react";
import { FileSpreadsheet, Sparkles, Download } from "lucide-react";
import { downloadStyledExcelTemplate } from "../../utils/excelFunctions";
import { downloadSampleProductCsv } from "../../utils/fileFunctions";

export default function ExcelTemplateCallout() {
  return (
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
              Features built-in dropdown lists for <strong>Category</strong> &{" "}
              <strong>Warranty</strong> to prevent typos!
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
  );
}
