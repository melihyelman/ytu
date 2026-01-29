import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Cengavers</h3>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Kulüpleri keşfet, yönet ve sosyalleş.
          </p>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Cengavers. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
}
