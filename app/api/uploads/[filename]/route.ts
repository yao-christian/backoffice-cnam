import fs from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

// Will not be needed anymore in Next 15
// but in Next 14 this prevents the GET endpoint
// from being statically rendered
export const dynamic = "force-dynamic";

/**
 * You can add some advanced authorization logic here!
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const filename = (await params).filename;

  if (!filename || filename.includes("..")) {
    return new Response(null, { status: 404 });
  }

  // Photo from Josh Sorenson: https://www.pexels.com/fr-fr/photo/moniteur-d-ordinateur-a-ecran-plat-noir-1714208/
  // This is a hacky way to have an image file in a known folder,
  // your real file should NOT be in the "public" folder
  const filePath = path.join(process.env.UPLOAD_DIR!, filename!);
  const stats = await fs.stat(filePath);
  const fileHandle = await fs.open(filePath);
  const stream = fileHandle.readableWebStream({ type: "bytes" });
  // At the time of writing (07/2024) there is a tiny issue with typings
  // @ts-ignore see https://github.com/nodejs/node/issues/54041#issuecomment-2260420439
  return new Response(stream, {
    status: 200,
    headers: new Headers({
      // we could get the mimetype automatically
      "content-type": getContentType(filename),
      "content-length": stats.size + "",
      // this is just so the image is not cached during practice
      // remove this header in production
      "cache-control": "no-store",
    }),
  });
  // Next 15 introduces "next/after" to properly close the file
  //  @see https://nextjs.org/blog/next-15-rc#executing-code-after-a-response-with-nextafter-experimental
  // This Stackblitz demo currently uses v14 so this code do not work yet (09/2024)
  // after(() => { fileHandle.close() })
}

function getContentType(fileName: string): string {
  if (fileName.endsWith(".png")) {
    return "image/png";
  } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
    return "image/jpeg";
  } else if (fileName.endsWith(".gif")) {
    return "image/gif";
  } else if (fileName.endsWith(".webp")) {
    return "image/webp";
  } else if (fileName.endsWith(".pdf")) {
    return "application/pdf";
  } else {
    return "application/octet-stream";
  }
}
