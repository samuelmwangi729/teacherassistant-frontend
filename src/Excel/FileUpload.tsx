import React, { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosResponse } from "axios";

// Types
interface FormulaData {
  formula: string;
  address: string;
}

interface SheetData {
  title: string;
  formulas: FormulaData[];
}

const FileUploadE: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [sheets, setSheets] = useState<SheetData[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response: AxiosResponse<any> = await axios.post(
        "https://teacher.up.railway.app/api/excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { data } = response.data;
      const sheets = data.sheets;

      setSheets(sheets);
      setMessage("File uploaded successfully!");
    } catch (error) {
      setMessage("File upload failed.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📄 Upload Excel File</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100 border rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-900 text-white font-semibold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center text-sm text-gray-600">
          {message}
        </div>
      )}

      <div className="mt-10 space-y-8">
        {sheets.length > 0 ? (
          sheets.map((sheet, sheetIndex) => (
            <div key={sheetIndex}>
              <h3 className="text-2xl font-semibold mb-3 text-violet-600 border-b pb-1">
                 {sheet.title}
              </h3>

              {sheet.formulas.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-2 border-b border-gray-300">Address</th>
                        <th className="text-left px-4 py-2 border-b border-gray-300">Formula</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.formulas.map((formula, formulaIndex) => (
                        <tr key={formulaIndex} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b border-gray-200 font-mono text-sm text-gray-700 bg-green-100">
                            {formula.address}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 font-mono text-sm text-gray-900">
                            {formula.formula}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No formulas in this sheet.</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">No data to display.</p>
        )}
      </div>
    </div>
  );
};

export default FileUploadE;
