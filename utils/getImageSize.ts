export default async function getImageSize(url) {
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } catch (error) {
      console.log(error)
    }
  };