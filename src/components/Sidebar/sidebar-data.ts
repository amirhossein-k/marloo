// app/components/sidebar/sidebar-data.ts

import {
    Shirt,
    Footprints,
    Glasses,
    ShoppingBag,
    Redo,
    Microwave,
    Cookie,
    Beef,
    Sandwich,
    Codesandbox,
    UserRound,
} from "lucide-react";
import FigorIcon from "../Icons/FigorIcon";
import { BoyICone, DollICone, FeIcon, GiftICone, GirlICone, LoveICone } from "../Icons/FeIcon";

export type SubCategory = {
    name: string;
    href: string;
    icon?: React.ElementType;

};

export type Category = {
    id: string;
    name: string;
    href: string;
    icon: React.ElementType;
    subCategories?: SubCategory[];
};

export type CategoryGroup = {
    title: string;
    categories: Category[];
};

export const sidebarData: CategoryGroup[] = [
    {
        title: "محصولات خاص",
        categories: [
            {
                id: "gift",
                name: "کادویی",
                href: "/list/?category=gift",
                icon: GiftICone,
                subCategories: [
                    { name: "عروسک", icon: DollICone, href: "/shop/clothes/t-shirts" },
                    { name: "ولنتاین", icon: LoveICone, href: "/shop/clothes/jeans" },
                ],
            },
            {
                id: "figor",
                name: "فیگور",
                href: "/shop/shoes",
                icon: FigorIcon,
            },
            {
                id: "",
                name: "دکوری",
                href: "/shop/glasses",
                icon: FeIcon,
            },
            {
                id: "bags",
                name: "ماژول های خاص",
                href: "/shop/bags",
                icon:
                    Codesandbox,
                // subCategories: [
                //     { name: "Backpacks", href: "/shop/bags/backpacks" },
                //     { name: "Handbags", href: "/shop/bags/handbags" },
                // ],
            },
        ],
    },
    {
        title: "",
        categories: [
            {
                id: "Sexaul",
                name: "جنسیت",
                href: "/shop/cake",
                icon: UserRound,
                subCategories: [
                    { name: "دخرانه", icon: GirlICone, href: "/shop/cake/cup-cake" },
                    { name: "پسرانه", icon: BoyICone, href: "/shop/cake/pastry" },
                ],
            },
            // {
            //     id: "bread",
            //     name: "Bread",
            //     href: "/shop/bread",
            //     icon: Sandwich,
            // },
        ],
    },
];