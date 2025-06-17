"use client";
import Button from "@/components/Button";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import React from "react";

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
    <BlurredPopupLayout isDark={isDark}>
      <p className="text-lg font-bold">Really want to download the Sale?</p>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name={"Cancel"} handler={cancelDownload} />
        <Button name={"Download Sale"} handler={downloadCsv} />
      </div>
    </BlurredPopupLayout>
  );
}

export default CsvDownload;
