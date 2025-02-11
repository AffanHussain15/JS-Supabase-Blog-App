const supabaseUrl = "https://dpsnymvjqugamqrfrrys.supabase.co";
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwc255bXZqcXVnYW1xcmZycnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODA5MzQsImV4cCI6MjA1Mjg1NjkzNH0.7g1hU78xsVqiVf7c-i2QBteTloi_N-vRvomr6Tgxjtg`;
const supaBase = supabase.createClient(supabaseUrl, supabaseKey);

const create = document.getElementById("upload");
create.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const imageFile = document.getElementById("image").files[0];
  try {
    if (!title || !description || !imageFile) {
      alert("Please fill all field.");
      return;
    }
    const imagePath = `blog-images/${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supaBase.storage
      .from("upload_images")
      .upload(imagePath, imageFile);

    if (uploadError) throw uploadError;

    console.log("UploadData", uploadData);
    console.log("UploadError", uploadError);

    const { data: publicUrlData } = supaBase.storage
      .from("upload_images")
      .getPublicUrl(uploadData.path);
    const imageUrl = publicUrlData.publicUrl;

    console.log("Image uploaded:", imageUrl);

    const { data: dbData, error: dbError } = await supaBase
      .from("Blog_App")
      .insert([
        {
          title: title,
          description: description,
          image_url: imageUrl,
        },
      ]);
    console.log(dbData);
    console.log(dbError);
    if (dbError) throw dbError;
  } catch (error) {
    console.error("Error", error.message);
    alert("Failed to upload blog!");
  }
});
