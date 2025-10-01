import Link from 'next/link'
import React from 'react'

const products = () => {
  return (
    <div className='products continer min-h-full h-fit  bg-white   " dir="rtl"'>
          <div className="row  bg-slate-50   text-md">
          <div className=" p-2 shadow-card my-1 block">
          <div className="flex   gap-3  text-md">
            <Link href={"/"} className="hover:text-black text-blue-400">
              خانه
            </Link>
            <div className="">--</div>
            <Link href={"/qhab"} className="hover:text-black text-blue-400">
              قاب ها
            </Link>
          </div>
          </div>
      </div>
    </div>
  )
}

export default products
