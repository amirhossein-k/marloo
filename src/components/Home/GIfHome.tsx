import Image from "next/image";
import React from "react";

const GIfHome = () => {
  const Gift = {
    layout: "gifhome",
    id: "QHTH4d4R2J9",
    item: [
      {
        id: "1",
        link: "/qhab",
        pic: "https://c961427.parspack.net/c961427/uploads/frr.gif",
        title: "قاب ها",
      },
      {
        id: "2",
        link: "/kif",
        pic: "https://c961427.parspack.net/c961427/uploads/gif2.gif",
        title: "کیف ها",
      },
    ],
  };
  return (
    <div className={" col-span-full   row-span-1   w-full    p-2 "}>
      <div className="grid  w-full grid-cols-1 cursor-default lg:grid-rows-1  place-items-center  auto-rows-fr  md:grid-cols-2 lg:grid-cols-2 gap-2">
        {Gift.item.map((item) => (
          <div className="relative rounded overflow-hidden  " key={item.id}>
            <Image
              // key={item.id}
              // className="w-full h-full"
              alt=""
              src={item.pic}
              //   fill
              width={600}
              height={600}
              quality={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GIfHome;
