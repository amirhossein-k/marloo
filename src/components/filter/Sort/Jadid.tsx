"use client";
import ItemBox from "@/components/itembox/ItemBox";
import { product } from "../../../../types";
import { Suspense } from "react";

const Jadid = ({
  soldOut,
  products,
  value1,
  CheckBoxFilterList,
}: {
  soldOut: boolean;
  products: product[];
  value1: number[];
  CheckBoxFilterList: string[];
}) => {
  console.log(soldOut);
  const er: any = products
    ?.filter(function (x: any) {
      return Number(x.price) >= value1[0] && Number(x.price) <= value1[1];
    })
    ?.filter(function (x: any) {
      return x.status === soldOut;
    })
    .reverse()
    ?.filter((item: any) => {
      var u: any = item;
      for (var i = 0; i < item.category_product.length; i++) {
        for (var t = 0; t <= CheckBoxFilterList.length; t++) {
          u = item.category_product[i].title.includes(CheckBoxFilterList[t]);

          if (u) {
            return u;
          }
        }

        if (u) {
          return u;
        }
      }
      return u;
    });
  return (
    <Suspense fallback={<>loading....</>}>
      {er?.map((item: product) => {
        return <ItemBox item={item} key={item.title} />;
      })}
    </Suspense>
  );
};

export default Jadid;
