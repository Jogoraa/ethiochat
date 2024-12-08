const upload = async (file) => {
  try {
    // Upload the file to Supabase Storage with automatic naming
    const { data, error } = await supabase.storage
      .from("images") // Replace 'images' with your bucket name
      .upload(file);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`); // More specific message
    }

    // Create a signed URL for the uploaded file
    const { signedURL, error: signedUrlError } = await supabase.storage
      .from("images")
      .createSignedUrl(data.id, 3600); // Use data.id for the uploaded file

    if (signedUrlError) {
      throw new Error(`Error creating signed URL: ${signedUrlError.message}`); // More specific message
    }

    return signedURL; // Return the signed URL
  } catch (err) {
    console.error("Upload error:", err.message);
    throw err; // Re-throw the error for handling in the calling function
  }
};

export default upload;