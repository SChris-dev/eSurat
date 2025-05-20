import { useState, useEffect, useMemo } from "react";
import Api from "../Api";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileAlt,
} from "react-icons/fa";

interface Letter {
  id: number;
  title: string;
  description: string;
  category_id: number;
  file_path: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  };
}


const Letters = () => {
  const role = localStorage.getItem("esurat_login_role");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editLetter, setEditLetter] = useState<Letter | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getFileIcon = (filepath: string) => {
    const ext = filepath.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "pdf":
        return { Icon: FaFilePdf, color: "text-red-500" };
      case "doc":
      case "docx":
        return { Icon: FaFileWord, color: "text-blue-500" };
      case "xls":
      case "xlsx":
        return { Icon: FaFileExcel, color: "text-green-600" };
      case "ppt":
      case "pptx":
        return { Icon: FaFilePowerpoint, color: "text-orange-500" };
      case "zip":
      case "rar":
      case "7z":
        return { Icon: FaFileArchive, color: "text-yellow-500" };
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return { Icon: FaFileImage, color: "text-pink-500" };
      case "mp4":
      case "avi":
      case "mov":
        return { Icon: FaFileVideo, color: "text-purple-500" };
      case "mp3":
      case "wav":
        return { Icon: FaFileAudio, color: "text-indigo-500" };
      default:
        return { Icon: FaFileAlt, color: "text-gray-500" };
    }
  };

  const fetchLetters = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await Api.get("/v1/letters");
      setLetters(res.data.data);
    } catch (err) {
      setError("Failed to fetch letters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this letter?")) {
      try {
        await Api.delete(`/v1/letters/${id}`);
        setLetters((prev) => prev.filter((l: any) => l.id !== id));
      } catch {
        alert("Failed to delete the letter.");
      }
    }
  };

  const handleEdit = (letter: Letter) => {
    setEditLetter(letter);
    setSelectedFile(null);
  };


  const saveChanges = async () => {
    try {
        if (!editLetter) return;

        const formData = new FormData();
        formData.append("title", editLetter.title);
        formData.append("uploaded_at", editLetter.created_at);


        if (selectedFile) {
        formData.append("file", selectedFile);
        }

        await Api.post(`/v1/letters/${editLetter.id}?_method=PUT`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

        fetchLetters();
        setEditLetter(null);
        setSelectedFile(null);
    } catch {
        alert("Failed to update the letter.");
    }
  };


  const cancelEdit = () => setEditLetter(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditLetter((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDownloadClick = (letter: Letter) => {
    setSelectedLetter(letter);
    setShowDownloadModal(true);
  };

  const handleConfirmDownload = (filePath: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = `http://127.0.0.1:8000/download/${filePath.split("/").pop()}`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowDownloadModal(false);
    setSelectedLetter(null);
  };

  const filteredLetters = useMemo(() => {
    return letters.filter((letter: any) =>
      letter.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, letters]);

  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLetters.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newLetter, setNewLetter] = useState({
    title: "",
    description: "",
    uploadedAt: "",
    category_id: 0,
    file: null as File | null,
  });


  const handleUploadLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLetter.file) return;

    const formData = new FormData();
    formData.append("title", newLetter.title);
    formData.append("description", newLetter.description);
    formData.append("uploadedAt", newLetter.uploadedAt);
    formData.append("category_id", newLetter.category_id.toString());
    formData.append("file", newLetter.file);

    try {
      await Api.post("/v1/letters", formData, {
        headers: { "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${localStorage.getItem('esurat_login_token')}`,
         },
      });

      alert("Upload successful!");
      setShowUploadModal(false);
      setNewLetter({ title: "", description: "", uploadedAt: "", category_id: 0, file: null });

      fetchLetters();
    } catch (error) {
      alert("Upload failed.");
      console.error(error);
    }
  };


  if (loading) return <p>Loading letters...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-teal-600">Letters</h1>
        <span className="text-sm text-gray-500">
          Showing {filteredLetters.length} letter
          {filteredLetters.length !== 1 && "s"}
        </span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
        />
      </div>

      {role === "admin" && (
        <div className="mb-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-200"
          >
            Upload New Letter
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-teal-100 text-teal-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Uploaded At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((letter: any) => {
                const { Icon, color } = getFileIcon(letter.file_path);

                return (
                  <tr key={letter.id} className="border-t border-gray-200 hover:bg-teal-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Icon className={`text-xl ${color}`} />
                      {letter.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(letter.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-200"
                            onClick={() => handleDownloadClick(letter)}
                            >
                            Download
                      </button>


                      {role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(letter)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(letter.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 py-6">
                  No letters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm rounded-md border bg-white hover:bg-teal-100 text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    currentPage === i + 1
                      ? "bg-teal-600 text-white"
                      : "bg-white text-teal-600 hover:bg-teal-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm rounded-md border bg-white hover:bg-teal-100 text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {editLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Letter</h2>
            <label className="block mb-2 font-medium">Title:</label>
            <input
              type="text"
              name="title"
              value={editLetter.title}
              onChange={handleChange}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
            />
            <label className="block mb-2 font-medium">Replace File:</label>
            <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full mb-6"
            />
            <label className="block mb-2 font-medium">Uploaded At:</label>
            <input
              type="date"
              name="created_at"
              value={editLetter.created_at.split("T")[0]}
              onChange={handleChange}
              className="w-full mb-6 px-3 py-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDownloadModal && selectedLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Download Letter</h2>

            <p className="text-sm text-gray-700 mb-2">
                <strong>Title:</strong> {selectedLetter.title}
            </p>
            <p className="text-sm text-gray-700 mb-4">
                <strong>Description:</strong>{" "}
                {selectedLetter.description || "No description provided."}
            </p>

            <div className="flex justify-end gap-2 mt-6">
                <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                onClick={() => setShowDownloadModal(false)}
                >
                Cancel
                </button>
                <button
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-200"
                onClick={() => handleConfirmDownload(selectedLetter.file_path, selectedLetter.title)}
                >
                Download
                </button>
            </div>
            </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload New Letter</h2>

            <form onSubmit={handleUploadLetter} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={newLetter.title}
                onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
                required
              />

              <textarea
                placeholder="Description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={newLetter.description}
                onChange={(e) => setNewLetter({ ...newLetter, description: e.target.value })}
              />

              <select
                value={newLetter.category_id}
                onChange={(e) => setNewLetter({ ...newLetter, category_id: Number(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="0" disabled>
                  Select Category
                </option>
                <option value={1}>General</option>
                <option value={2}>Internal</option>
                <option value={3}>External</option>
              </select>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx,.zip,.rar,.7z,.jpg,.jpeg,.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setNewLetter({ ...newLetter, file: e.target.files?.[0] || null })}
                required
              />

              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={newLetter.uploadedAt}
                onChange={(e) => setNewLetter({ ...newLetter, uploadedAt: e.target.value })}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-200"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div>
  );
};

export default Letters;
