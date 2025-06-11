import Button from '@/components/Button'
import React from 'react'

function CsvDownload({cancelDownload, downloadCsv}: {cancelDownload: () => void, downloadCsv: () => void}) {
  return (
    <div className='fixed left-0 bottom-0 w-[100vw] h-[100vh] flex justify-center items-center backdrop-blur-sm z-1'>
        <div className='flex flex-col justify-evenly items-center gap-4 w-[40%] h-[20%] bg-white rounded-xl shadow-lg p-4'>
            <p className='text-lg'>Really want to download the CSV?</p>
            <div className='flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4'>
                <Button name={"Cancel"} handler={cancelDownload} />
              <Button name={"Download CSV"} handler={downloadCsv} /> 
            </div>
        </div>
    </div>
  )
}

export default CsvDownload
