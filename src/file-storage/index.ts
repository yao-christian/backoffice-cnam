import { v4 as uuidv4 } from "uuid";
import { FileStorageProxy } from "./file-storage-proxy";

let fileStorageInstance: FileStorageProxy | null = null;

export function getFileStorage(): FileStorageProxy {
  if (!fileStorageInstance) {
    fileStorageInstance = new FileStorageProxy();
  }
  return fileStorageInstance;
}

export function getFileExtension(filename: string) {
  // Vérifie si le nom du fichier est valide
  if (typeof filename !== "string") {
    return "";
  }

  // Divise le nom du fichier par le point (.) et récupère la dernière partie
  const parts = filename.split(".");

  // Vérifie si le fichier contient une extension
  if (parts && parts.length > 1) {
    return parts.pop()?.toLowerCase(); // Retourne l'extension en minuscule
  }

  return ""; // Retourne une chaîne vide si aucune extension n'est trouvée
}

// Fonction pour générer un nom de fichier
export const generateFileName = (
  name: string,
  fileExtension: string,
): string => {
  // Nettoyage du prénom pour éviter les caractères spéciaux dans le nom du fichier
  const sanitizedName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");

  // Génération d'un UUID
  const uniqueId = uuidv4();

  // Construction du nom de fichier
  return `${sanitizedName}-${uniqueId}.${fileExtension}`;
};
