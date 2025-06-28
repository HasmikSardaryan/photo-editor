import React from "react";

function Post({ base64, contentType }) {
  return (
    <div className="post">
      <img
        src={`data:${contentType};base64,${base64}`}
        alt="User upload"
        style={{ maxWidth: "300px", marginBottom: "10px" }}
      />
    </div>
  );
}

export default Post;
