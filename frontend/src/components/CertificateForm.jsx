import React, { useState } from 'react';
import { Button } from "./ui/button";
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const CertificateForm = ({ onSubmitSuccess, editData = null }) => {
  const [formData, setFormData] = useState({
    type: editData?.type || '',
    issuer: editData?.issuer || '',
    at_location: editData?.at_location || '',
    on_date: editData?.on_date ? new Date(editData.on_date).toISOString().split('T')[0] : '',
    last_annual: editData?.last_annual ? new Date(editData.last_annual).toISOString().split('T')[0] : '',
    expiry_date: editData?.expiry_date ? new Date(editData.expiry_date).toISOString().split('T')[0] : '',
    certificate_no: editData?.certificate_no || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        console.log('Updating certificate:', editData.id, formData);
        await axios.put(`${API_URL}/certificates/public/${editData.id}`, formData);
        console.log('Certificate updated successfully');
      }
      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to update certificate. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Certificate Type - Read Only */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Certificate Type</label>
          <input
            type="text"
            value={formData.type}
            className="mt-1 w-full p-2 bg-gray-100 border rounded-md"
            disabled
          />
        </div>

        {/* Issuer */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Issuer</label>
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter issuer"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="at_location"
            value={formData.at_location}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter location"
          />
        </div>

        {/* Issue Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Issue Date</label>
          <input
            type="date"
            name="on_date"
            value={formData.on_date}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Last Annual */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Annual</label>
          <input
            type="date"
            name="last_annual"
            value={formData.last_annual}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Certificate No */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Certificate No</label>
          <input
            type="text"
            name="certificate_no"
            value={formData.certificate_no}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter certificate number"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onSubmitSuccess}
          className="px-4 py-2"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default CertificateForm;