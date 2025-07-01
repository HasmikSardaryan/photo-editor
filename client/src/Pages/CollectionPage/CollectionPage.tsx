import React, { useState, useEffect } from "react";
import './Collection.css';

function Collection() {

  const BASE_URL = process.env.REACT_APP_API_URL;

  const [photos, setPhotos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [applyBW, setApplyBW] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/collection`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        const sortedPhotos = data.photos.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setPhotos(sortedPhotos);
      } else {
        alert(data.error || "Failed to load photos");
      }
    } catch (err) {
      alert("Error fetching photos");
    }
  };

  const handleAdding = (file) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const result = reader.result;
      if (typeof result !== "string") {
        alert("Could not read image file.");
        return;
      }

      const base64 = result.split(',')[1];
      if (!base64) {
        alert("Image format is invalid.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/photo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ photo: base64 }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Photo added to collection');
          await fetchPhotos();
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

  const openEditor = (idx) => {
    setEditingIndex(idx);
    setApplyBW(false);
  };

  const handleSave = async () => {
    if (editingIndex === null) return;

    const original = photos[editingIndex];

    if (!applyBW) {
      setEditingIndex(null);
      return;
    }

    const newBase64 = await convertToGrayscale(original.base64);

    try {
      const response = await fetch(`${BASE_URL}/${original._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ photo: newBase64 }),
      });

      if (!response.ok) throw new Error("Failed to save edit");

      const updatedPhotos = [...photos];
      updatedPhotos[editingIndex] = {
        ...original,
        base64: newBase64,
        bw: true,
      };
      setPhotos(updatedPhotos);
      setEditingIndex(null);
    } catch (err) {
      alert("Failed to save edited image");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const convertToGrayscale = (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          alert("Canvas 2D context not supported");
          resolve(base64);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }

        ctx.putImageData(imageData, 0, 0);
        const base64Edited = canvas.toDataURL("image/jpeg").split(',')[1];
        resolve(base64Edited);
      };

      img.onerror = () => {
        alert("Failed to load image for editing.");
        resolve(base64);
      };

      img.src = `data:image/jpeg;base64,${base64}`;
    });
  };

  return (
    <>
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files.length > 0) {
            handleAdding(e.target.files[0]);
          }
        }}
      />
      <label htmlFor="file-upload" className="add-collection-btn">+</label>

      <div className="collection-container">
        <div className="collection-grid">
          {photos.map((photo, idx) => (
            photo.base64 && (
              <img
                key={photo._id || idx}
                src={`data:${photo.contentType};base64,${photo.base64}`}
                alt={`Uploaded ${idx}`}
                className="collection-image"
                onClick={() => openEditor(idx)}
                style={{
                  filter: photo.bw ? "grayscale(100%)" : "none",
                  cursor: "pointer"
                }}
              />
            )
          ))}
        </div>
      </div>

      {editingIndex !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Photo</h3>
            <img
              src={`data:${photos[editingIndex].contentType};base64,${photos[editingIndex].base64}`}
              alt="Editing"
              style={{ maxHeight: 300, filter: applyBW ? "grayscale(100%)" : "none" }}
            />
            <div style={{ marginTop: 10 }}>
              <label>
                <input
                  type="checkbox"
                  checked={applyBW}
                  onChange={() => setApplyBW(!applyBW)}
                /> Apply Black & White
              </label>
            </div>
            <div style={{ marginTop: 15 }}>
              <button onClick={handleSave} style={{ marginRight: 10 }}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Collection;
