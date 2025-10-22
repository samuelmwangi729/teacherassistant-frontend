import React, { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosResponse } from "axios";

// Type for the response data from the Django backend
interface Run {
  text: string;
  bold: boolean | null;
  italic: boolean;
  underline: boolean | null;
  font: {
    name: string;
    size: number;
  };
}

interface FileUploadResponse {
  text: string;
  style: string;
  runs: Run[];
}

interface StyleType {
  text: string;
  style: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [styles, setStyles] = useState<StyleType[]>([]);

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
        "https://teacher.up.railway.app/api/word", // Replace with your backend URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const sheets = response.data.data.sheets;
      setStyles(sheets);
      setMessage("File uploaded successfully!");
    } catch (error) {
      setMessage("File upload failed.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl space-y-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800">Upload .docx File</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
        <div>
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-700 file:bg-blue-50 file:border-2 file:border-blue-400 file:text-blue-700 file:rounded-lg file:px-4 file:py-2 hover:file:bg-blue-100 transition-all duration-200"
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
        >
          Upload
        </button>
      </form>

      {/* Message display */}
      {message && (
        <div className="text-center text-gray-600">
          <p>{message}</p>
        </div>
      )}

      {/* Styles Table Section */}
      <div>
        {styles.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-300">#</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-300">Sheet Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-300">Style</th>
                </tr>
              </thead>
              <tbody>
                {styles.map((style, index) => (
                  <tr key={index} className="bg-white hover:bg-blue-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border-b border-gray-200">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 border-b border-gray-200">{style.text}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-200">{style.style}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-sm">No styles to display.</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
