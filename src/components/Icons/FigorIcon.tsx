import React from "react";
import Image from "next/image";

const FigorIcon = () => {
  return (
    <div style={{ filter: "brightness(0) invert(1)" }}>
      <Image src="/re.svg" alt="FE Icon" width={29} height={29} />
    </div>
  );
};

export default FigorIcon;
