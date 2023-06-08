function Header() {
  return (
    <div className="flex flex-col w-full sm:flex-row items-center justify-center p-3 bg-gray-100 gap-2">
      <h1 className="font-bold text-lg lg:text-xl font-sans pt-3 sm:pt-0 text-gray-500 mr-auto">
        Steganography project demo.
      </h1>

      <div className="ml-auto flex items-end p-2">
        <a
          href="https://github.com/dhirajmourya332/steganography"
          target="_blank"
          className="px-3 py-1 border border-gray-500 rounded-md hover:bg-gray-500 hover:text-white"
        >
          {"Source code"}
        </a>
      </div>
    </div>
  );
}

export default Header;
