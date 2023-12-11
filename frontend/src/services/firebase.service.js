// import functions from "firebase-functions";
// import admin from "firebase-admin";
// import { getFileLink } from "./telegram.service";
// import { filePathToTelegramFileId } from "./storage.service";
import { getAllFreeAssets } from "./firestore.service";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { faker } from "@faker-js/faker";

import { firestore, storage } from "../configs/firebase.config";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

export const uploadFile = async (file, collectionName) => {
  const storageRef = `${collectionName}/${faker.string.uuid()}`;
  const fileRef = ref(storage, storageRef);
  const uploaded = await uploadBytes(fileRef, file, {
    contentType: file.type,
  });
  const url = await getDownloadURL(uploaded.ref);
  return url;
};

export const create = async (data) => {
  try {
    const {
      avatar,
      record,
      name,
      title,
      text,
      background,
      audio,
      backgroundId,
      audioId,
      customBackground,
      customAudio,
      isPremium,
    } = data;
    const { backgrounds, musics } = await getAllFreeAssets();
    if (!isPremium) {
      if (!backgrounds.some((item) => item.id === backgroundId))
        throw new Error("Bad request: Invalid background");
      if (!musics.some((item) => item.id === audioId))
        throw new Error("Bad request: Invalid audio");
    }
    const newVoiceGift = {
      name,
      title,
      text,
      background,
      audio,
    };
    if (isPremium) {
      if (!customBackground) {
        if (!backgrounds.some((item) => item.id === backgroundId))
          throw new Error("Bad request: Invalid background");
      }
      if (!customAudio) {
        if (!musics.some((item) => item.id === audioId))
          throw new Error("Bad request: Invalid audio");
      }
      if (customBackground) {
        newVoiceGift.background = await uploadFile(
          customBackground,
          "backgrounds"
        );
      }
      if (customAudio) {
        newVoiceGift.audio = await uploadFile(customAudio, "musics");
      }
    }
    if (avatar) newVoiceGift.avatar = avatar;
    if (record) newVoiceGift.record = record;

    const newVoiceGiftRef = await addDoc(
      collection(firestore, "voice-gifts"),
      newVoiceGift
    );

    return newVoiceGiftRef.id;
  } catch (err) {
    throw new Error(`Error in getting voicegift: `, err.message);
  }
};

export const get = async ({ id }) => {
  try {
    const snapshot = await getDoc(doc(firestore, "voice-gifts", id));
    if (!snapshot.exists) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (err) {
    throw new Error(`Error in getting voicegift: `, err.message);
  }
};
