import pic1 from "../assets/user-pic-1.png";
import pic2 from "../assets/user-pic-2.png";
import pic3 from "../assets/user-pic-3.png";
import pic4 from "../assets/user-pic-4.png";

// Hash Player string to integer
// This ensures that player will always have the same random picture
const stringToHashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; 
  }
  return Math.abs(hash);
};

// Get a random profile picture
const randomPic = (player) => {
  const index = stringToHashCode(player) % 4;
  switch (index) {
    case 0:
      return pic1;
    case 1:
      return pic2;
    case 2:
      return pic3;
    case 3:
      return pic4;
    default:
      return pic1;
  }
};

export default randomPic;