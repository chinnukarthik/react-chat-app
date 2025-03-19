function EmptyChatContainer() {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex duration-1000 transition-all flex-col justify-center items-center hidden">
      <div
        className="text-opacity-80 text-white flex flex-col gap-10  items-center mt-10 lg:text-4xl text-3xl
       transition-all duration-300 text-center"
      >
        <span className="text-[100px]">👋</span>
        <h3>
          Hi! <span className="">Welcome to </span>
          <span className="text-green-300">Chat App</span>
        </h3>
      </div>
    </div>
  );
}

export default EmptyChatContainer;
