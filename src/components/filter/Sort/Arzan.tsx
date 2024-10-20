"use client";
import ItemBox from "@/components/itembox/ItemBox";
import { product } from "../../../../types";

const Arzan = ({
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
  const er: any = products
    ?.filter(function (x) {
      return Number(x.price) >= value1[0] && Number(x.price) <= value1[1];
    })
    ?.filter(function (x) {
      return x.status === soldOut;
    })
    ?.sort((p1, p2): any =>
      Number(p1.price) < Number(p2.price)
        ? -1
        : Number(p1.price) > Number(p2.price)
        ? 1
        : 0
    )
    ?.filter((item): any => {
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
    <>
      {er?.map((item: product) => {
        return <ItemBox item={item} key={item.title} />;
      })}
    </>
  );
};

export default Arzan;
