'use client';

import React , {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AddCreditPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [image,setImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!name || !description || !linkedinUrl || !image){
            setError('Please fill in all fields');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name' , name);
            formData.append('description' , description);
            formData.append('linkedinUrl' , linkedinUrl);
            formData.append('image' , image);

            const response = await fetch('/api/credits/new' , {
                method: 'POST',
                body: formData,
            })

            if(!response.ok) {
                throw new Error('failed to add Contributor');
            }

            router.push('/Credits');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center bg-gray-900 min-h-screen">
          {/* Page heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mt-14 mb-6">
            Add a New Contributor
          </h1>
    
          {/* Form */}
          <form
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] sm:w-[60%] lg:w-[40%]"
            onSubmit={handleSubmit}
          >
            {/* Name */}
            <div className="mb-4">
              <label className="block text-slate-100 mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
    
            {/* Description */}
            <div className="mb-4">
              <label className="block text-slate-100 mb-2">Description</label>
              <textarea
                className="w-full p-2 rounded bg-gray-700 text-white"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
    
            {/* LinkedIn URL */}
            <div className="mb-4">
              <label className="block text-slate-100 mb-2">LinkedIn URL</label>
              <input
                type="url"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
    
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-slate-100 mb-2">Image</label>
              <input
                type="file"
                className="w-full p-2 bg-gray-700 text-white"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
    
            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full p-3 rounded ${
                isSubmitting ? "bg-gray-500" : "bg-blue-600"
              } text-white shadow-lg`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Add Contributor"}
            </button>
          </form>
    
          {/* Error message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      );
}