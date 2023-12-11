import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../configs/firebase.config";

export const getAllFreeAssets = async () => {
  const backgroundSnapshot = await getDocs(
    collection(firestore, "free-backgrounds")
  );
  const musicSnapshot = await getDocs(collection(firestore, "free-musics"));
  const backgrounds = backgroundSnapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
  const musics = musicSnapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
  return { backgrounds, musics };
};
