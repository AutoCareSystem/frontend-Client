import React from 'react';
import { Check, X } from 'lucide-react';

interface FormData {
  name: string;
  //price: string;
  description: string;
  endDate?: string;
}

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingId?: number | null;
  formTitle: { add: string; edit: string };
  primaryColor?: string;
  dark?: boolean;
}

const ProjectForm: React.FC<Props> = ({ formData, onChange, onSubmit, onCancel, editingId, formTitle, primaryColor = 'red', dark = false }) => {
  const labelColor = dark ? 'text-gray-300' : 'text-gray-700';
  const inputBg = dark ? 'bg-[#1a1a1a]' : 'bg-white';
  const inputText = dark ? 'text-gray-200' : 'text-gray-800';

  return (
    <div className={`p-6 mb-8 ${dark ? 'bg-[#2a2a2a]' : 'bg-white'} rounded-lg shadow-md`}>
      <h2 className={`mb-4 text-xl font-bold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{editingId ? formTitle.edit : formTitle.add}</h2>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <div>
          <label className={`${labelColor} block mb-2 font-medium`}>Service Name <span className="text-red-500">*</span></label>
          <input name="name" value={formData.name} onChange={onChange} placeholder="e.g., Custom Paint Job" className={`w-full px-4 py-2 ${inputText} ${inputBg} border border-gray-600 rounded-lg focus:outline-none`} />
        </div>
        {/*<div>
          <label className={`${labelColor} block mb-2 font-medium`}>Price <span className="text-red-500">*</span></label>
          <input name="price" value={formData.price} onChange={onChange} placeholder="e.g., 499.99" className={`w-full px-4 py-2 ${inputText} ${inputBg} border border-gray-600 rounded-lg focus:outline-none`} />
        </div>*/}
        <div>
          <label className={`${labelColor} block mb-2 font-medium`}>Description</label>
          <input name="description" value={formData.description} onChange={onChange} placeholder="Brief description" className={`w-full px-4 py-2 ${inputText} ${inputBg} border border-gray-600 rounded-lg focus:outline-none`} />
        </div>
        <div>
          <label className={`${labelColor} block mb-2 font-medium`}>Desired completion date</label>
          <input name="endDate" type="date" value={formData.endDate || ''} onChange={onChange} className={`w-full px-4 py-2 ${inputText} ${inputBg} border border-gray-600 rounded-lg focus:outline-none`} />
        </div>
      </div>

      <div className="flex space-x-3">
        <button onClick={onSubmit} className={`bg-${primaryColor}-600 text-gray-200 px-6 py-2 rounded-lg font-semibold hover:bg-${primaryColor}-700 transition duration-200 flex items-center space-x-2`}>
          <Check className="w-5 h-5" />
          <span>{editingId ? 'Update' : 'Add'} Service</span>
        </button>
        <button onClick={onCancel} className={`flex items-center px-6 py-2 space-x-2 font-semibold ${dark ? 'text-gray-200 bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-200 hover:bg-gray-300'} rounded-lg transition duration-200`}>
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
