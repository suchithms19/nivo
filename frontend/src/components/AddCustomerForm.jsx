import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import BACKEND_URL from '../config';



const AddCustomerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    age: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}/api/v1/queue/patient`, formData,{
        headers: {
          Authorization: `Bearer ${token}`
        }});
      console.log('Patient added successfully:');
      navigate('/waitlist');
    } catch (err) {
      console.error('Error adding patient:', err);
      setError('Failed to add patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate('/waitlist');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Customer</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
          {/* <InputField label="Patient Id" name="patientId" value={formData.patientId} onChange={handleChange} /> */}
          <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel"  />
          <InputField 
            label="Age (optional)" 
            name="age" 
            value={formData.age} 
            onChange={handleChange} 
            type="number" 
          />
          {/* <SelectField
            label="Doctor Type"
            name="doctorType"
            value={formData.doctorType}
            onChange={handleChange}
            options={['ANCHOR', 'LOCUM', 'FLOATING']}
          />
          <SelectField
            label="Financial Class"
            name="financialClass"
            value={formData.financialClass}
            onChange={handleChange}
            options={['HMO', 'INSURANCE', 'MEDICARE', 'CORPORATE', 'PRIVATE']}
          /> */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md transition-all duration-200 
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-cuspurple hover:scale-105'}
              text-white`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Submitting...
              </span>
            ) : (
              'Add Customer'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export {AddCustomerForm,InputField,SelectField };



const InputField = ({ label, name, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md "
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);