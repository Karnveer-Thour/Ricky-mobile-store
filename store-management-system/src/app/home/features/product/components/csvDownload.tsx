"use client";
import Button from "@/components/Button";
import React from "react";
import FeatureLayout from "../layout/featureLayout";

type CsvDownloadProps = {
  cancelDownload: () => void;
  downloadCsv: () => void;
  isDark?: boolean;
};

function CsvDownload({
  cancelDownload,
  downloadCsv,
  isDark = false,
}: CsvDownloadProps) {
  return (
    <FeatureLayout isDark={isDark}>
      <p className="text-lg font-bold">Really want to download the CSV?</p>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={cancelDownload} />
        <Button name={"Download CSV"} handler={downloadCsv} />
      </div>
    </FeatureLayout>
  );
}

export default CsvDownload;
