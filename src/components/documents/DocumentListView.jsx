import React, { useState, useMemo } from 'react';
import { usePMSStore } from '../../store/usePMSStore';
import Modal from '../common/Modal';
import ConfirmModal from '../common/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen,
  faUpload,
  faMagnifyingGlass,
  faFilePdf,
  faDownload,
  faTrashCan,
  faEye,
  faFileLines,
  faBuilding,
  faUser,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

export default function DocumentListView() {
  const { documents, properties, customers, leases, uploadDocument, deleteDocument } = usePMSStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deletingDocId, setDeletingDocId] = useState(null);

  // Upload state
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'Lease Agreement',
    entityType: 'Property',
    entityId: '',
    fileSize: '2.5 MB'
  });

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.entityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'All' || d.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [documents, searchQuery, typeFilter]);

  const docTypes = [
    'All',
    'Lease Agreement',
    'NIC/Passport',
    'Property Deed',
    'Inspection Report',
    'Payment Receipt',
    'Maintenance Document'
  ];

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newDoc.name.trim()) return;

    let entityName = 'General Record';
    if (newDoc.entityType === 'Property') {
      const p = properties.find((prop) => prop.id === newDoc.entityId);
      entityName = p ? p.name : 'Property';
    } else if (newDoc.entityType === 'Customer') {
      const c = customers.find((cust) => cust.id === newDoc.entityId);
      entityName = c ? c.fullName : 'Tenant';
    }

    uploadDocument({
      ...newDoc,
      entityName
    });

    setIsUploadOpen(false);
    setNewDoc({
      name: '',
      type: 'Lease Agreement',
      entityType: 'Property',
      entityId: '',
      fileSize: '2.5 MB'
    });
  };

  const handleDownloadSimulation = (doc) => {
    const element = document.createElement('a');
    const file = new Blob([`Corporate Document Archive\nDocument ID: ${doc.id}\nName: ${doc.name}\nType: ${doc.type}\nRelated: ${doc.entityName}\nUploaded By: ${doc.uploadedBy}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900">
            Corporate Document Archive
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Classified legal contracts, title deeds, government identity verifications, and compliance records.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shadow-emerald-700/20 active:scale-98"
        >
          <FontAwesomeIcon icon={faUpload} />
          Upload & Archive Document
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="relative max-w-md">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document name, type, related entity, or uploader..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-400 mr-1">Classification:</span>
          {docTypes.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                typeFilter === t
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {t}
              {t === 'All' && ` (${documents.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Document Name</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Related To</th>
                <th className="py-3.5 px-4">Uploaded By</th>
                <th className="py-3.5 px-4">Upload Date</th>
                <th className="py-3.5 px-4">File Size</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No documents found</p>
                    <p className="text-[11px] mt-1">Try adjusting the search query or classification filter.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                          <FontAwesomeIcon icon={faFilePdf} className="text-base" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {doc.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {doc.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[11px]">
                        {doc.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{doc.entityName}</span>
                      <span className="text-[10px] text-slate-400">{doc.entityType}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {doc.uploadedBy}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{doc.uploadDate}</td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">{doc.fileSize}</td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="Preview Document"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleDownloadSimulation(doc)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Download Document"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <button
                          onClick={() => setDeletingDocId(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Document"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredDocs.length} of {documents.length} archived files</span>
          <span>Encrypted with Corporate TLS 1.3 at rest</span>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Corporate Document"
        subtitle="Archive title deeds, agreements, and tenant identification"
        maxWidth="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUploadSubmit}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Upload & File Record
            </button>
          </>
        }
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-left text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Document File Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newDoc.name}
              onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
              placeholder="e.g. Sunrise_Residences_Fire_Safety_Certificate_2024.pdf"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Document Classification</label>
              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Lease Agreement">Lease Agreement</option>
                <option value="NIC/Passport">NIC/Passport Identification</option>
                <option value="Property Deed">Property Deed / Title</option>
                <option value="Inspection Report">Inspection Report</option>
                <option value="Payment Receipt">Payment Receipt</option>
                <option value="Maintenance Document">Maintenance Sign-off</option>
                <option value="Legal Document">Legal / Court Record</option>
                <option value="Other">Other Operational File</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Related Entity Type</label>
              <select
                value={newDoc.entityType}
                onChange={(e) => setNewDoc({ ...newDoc, entityType: e.target.value, entityId: '' })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Property">Property</option>
                <option value="Customer">Tenant / Resident</option>
                <option value="Lease">Lease Agreement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Associate With Specific Entity</label>
            <select
              value={newDoc.entityId}
              onChange={(e) => setNewDoc({ ...newDoc, entityId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            >
              <option value="">-- Choose Related Record --</option>
              {newDoc.entityType === 'Property' &&
                properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              {newDoc.entityType === 'Customer' &&
                customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName}
                  </option>
                ))}
              {newDoc.entityType === 'Lease' &&
                leases.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.leaseNumber} ({l.customerName})
                  </option>
                ))}
            </select>
          </div>

          {/* Drag and Drop Mock Zone */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50 cursor-pointer">
            <FontAwesomeIcon icon={faUpload} className="text-2xl text-slate-400 mb-2" />
            <p className="font-semibold text-slate-700">Drop PDF or scanned documents here</p>
            <p className="text-[11px] text-slate-400 mt-1">Supports PDF, DOCX, JPG, PNG up to 25 MB</p>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.name || 'Document Inspection'}
        subtitle={`Classification: ${previewDoc?.type} • File Size: ${previewDoc?.fileSize}`}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-slate-400">Archived on {previewDoc?.uploadDate}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
              >
                Close Preview
              </button>
              <button
                onClick={() => previewDoc && handleDownloadSimulation(previewDoc)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faDownload} /> Download File
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-left text-xs">
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faFilePdf} className="text-3xl text-rose-400" />
              <div>
                <h4 className="font-bold text-sm text-white">{previewDoc?.name}</h4>
                <p className="text-slate-400 text-xs">
                  {previewDoc?.fileType} Document • {previewDoc?.fileSize} • Uploaded by {previewDoc?.uploadedBy}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
              VERIFIED
            </span>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 space-y-3 font-mono text-[11px] leading-relaxed">
            <div className="border-b border-slate-200 pb-2">
              <p className="font-bold text-slate-900 text-xs uppercase">Corporate Archive Metadata Record</p>
              <p className="text-slate-500 text-[10px]">Reference Code: {previewDoc?.id}</p>
            </div>
            <p><strong>Entity Associated:</strong> {previewDoc?.entityName} ({previewDoc?.entityType})</p>
            <p><strong>Filing Officer:</strong> {previewDoc?.uploadedBy}</p>
            <p><strong>Filing Date:</strong> {previewDoc?.uploadDate}</p>
            <p><strong>Archive Storage Hash:</strong> SHA-256: 8f4b23c89a0e12d45bf8912d091e...</p>
            <p className="text-slate-500 italic pt-2">
              [Simulated Document Preview]: The legal document content is verified and bound to the operational database.
            </p>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingDocId)}
        onClose={() => setDeletingDocId(null)}
        onConfirm={() => {
          if (deletingDocId) deleteDocument(deletingDocId);
        }}
        title="Delete Document"
        message="Are you sure you want to permanently remove this document from the corporate archive? This action cannot be reversed."
        confirmText="Yes, Delete File"
        isDanger={true}
      />
    </div>
  );
}
