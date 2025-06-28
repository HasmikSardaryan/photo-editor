import React, { useState, useEffect } from "react";
import './Collection.css'

function Collection() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
      const fetchPhotos = async () => {
        try {
          const response = await fetch('http://localhost:3000/collection', {
            method: 'GET',
            credentials: 'include',
          });
          const data = await response.json();
          if (response.ok) {
            setPhotos(data.photos);
          } else {
            alert(data.error || "Failed to load photos");
          }
        } catch (err) {
          alert("Error fetching photos");
        }
      };

      fetchPhotos();
    }, []);

    const handleAdding = async (file) => {
        const reader = new FileReader();
      
        reader.onloadend = async () => {
          const result = reader.result;
      
          if (typeof result !== "string") {
            alert("Failed to read file.");
            return;
          }
      
          const base64 = result.split(',')[1];
          if (!base64) {
            alert("Invalid file format.");
            return;
          }
      
          try {
            const response = await fetch('http://localhost:3000/collection', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ photo: base64 }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              alert('Photo added to collection');
              setPhotos(prev => [...prev, { base64, contentType: 'image/jpeg' }]); // add to UI
            } else {
              alert(data.error || 'Failed to add photo');
            }
          } catch (err) {
            alert('Error connecting to server');
          }
        };
      
        reader.onerror = () => {
          alert("Error reading file.");
        };
      
        reader.readAsDataURL(file);
    };
      
    return (
        <>
          <div>add collection</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleAdding(e.target.files[0])}
          />
      
          <div className="collection-container">
            <div className="collection-grid">
              {photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={`data:${photo.contentType};base64,${photo.base64}`}
                  alt={`Uploaded ${idx}`}
                  className="collection-image"
                />
              ))}
            </div>
          </div>
        </>
    );
}

export default Collection;
