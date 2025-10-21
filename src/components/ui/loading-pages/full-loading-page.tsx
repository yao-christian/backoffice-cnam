"use client";

import { Circles } from "react-loader-spinner";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />

      <p className="mt-10 font-semibold text-lg italic text-gray-900">
        Chargement de la page en cours...
      </p>
    </div>
  );
}
