import React from "react";
const Avatar = React.memo(({ name }) => {
    const letter = name.charAt(0).toUpperCase();
    return (
      <div className="min-w-10 h-10 flex items-center justify-center rounded-full bg-[#E54065] text-white font-bold">
        {letter}
      </div>
    );
  });
  export default Avatar;