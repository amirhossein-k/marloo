"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { revalidateProductPage } from "@/app/actions/product/productRefresh";
import { useSession } from "next-auth/react";

interface PropsReview {
  id: string;
}

interface Review {
  id: string;
  reviewText: string;
  name: string;
  email: string;
  createdAt: string;
  rating: number;
}

// تابع دریافت لیست نظرات
const fetchReviews = async (productId: string): Promise<Review[]> => {
  const res = await fetch(`/api/products/review?productId=${productId}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("خطا در دریافت نظرات");
  }
  return res.json();
};

// تابع ارسال نظر
const addReview = async (reviewData: {
  productId: string;
  name: string;
  email: string;
  reviewText: string;
  rating: number;
}): Promise<Review> => {
  const res = await fetch("/api/products/review/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("خطا در ارسال نظر");
  }
  return res.json();
};

// تابع حذف نظر
const deleteReview = async (reviewId: string): Promise<void> => {
  const res = await fetch(`/api/products/review/${reviewId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("خطا در حذف نظر");
  }
};

const Reviews = ({ id }: PropsReview) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const queryClient = useQueryClient();
  const [text, setText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  const user = session?.user;

  // دریافت لیست نظرات
  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
    staleTime: 60 * 1000,
  });

  // ارسال نظر
  const addMutation = useMutation({
    mutationFn: addReview,
    onMutate: async (newReview) => {
      await queryClient.cancelQueries({ queryKey: ["reviews", id] });
      const previousReviews = queryClient.getQueryData(["reviews", id]);
      queryClient.setQueryData(["reviews", id], (old: Review[] | undefined) => [
        ...(old || []),
        {
          ...newReview,
          id: "temp-id",
          createdAt: new Date().toISOString(),
        },
      ]);
      return { previousReviews };
    },
    onSuccess: async () => {
      toast.success("نظر شما با موفقیت ثبت شد");
      setText("");
      setRating(0);
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      const result = await revalidateProductPage(id);
      if (result && !result.success) {
        toast.error(result.error || "خطا در به‌روزرسانی صفحه");
      }
    },
    onError: (err, _, context) => {
      setError(err.message || "خطا در ارسال نظر");
      queryClient.setQueryData(["reviews", id], context?.previousReviews);
      toast.error("خطا در ارسال نظر");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
    },
  });

  // حذف نظر
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: ["reviews", id] });
      const previousReviews = queryClient.getQueryData(["reviews", id]);
      queryClient.setQueryData(["reviews", id], (old: Review[] | undefined) =>
        old ? old.filter((review) => review.id !== reviewId) : []
      );
      return { previousReviews };
    },
    onSuccess: async () => {
      toast.success("نظر با موفقیت حذف شد");
      const result = await revalidateProductPage(id);
      if (result && !result.success) {
        toast.error(result.error || "خطا در به‌روزرسانی صفحه");
      }
    },
    onError: (err, _, context) => {
      setError(err.message || "خطا در حذف نظر");
      queryClient.setQueryData(["reviews", id], context?.previousReviews);
      toast.error("خطا در حذف نظر");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید.");
      return;
    }
    if (!text.trim()) {
      setError("لطفاً متن نظر را وارد کنید.");
      return;
    }
    if (rating === 0) {
      setError("لطفاً امتیاز خود را انتخاب کنید.");
      return;
    }

    setError(null);
    addMutation.mutate({
      productId: id,
      name: user.name || "",
      email: user.email || "",
      reviewText: text,
      rating,
    });
  };

  const handleDelete = (reviewId: string) => {
    if (confirm("آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟")) {
      deleteMutation.mutate(reviewId);
    }
  };

  if (isReviewsLoading) {
    return (
      <div className="flex justify-center">
        {/* <Spinner classNames={{ label: 'text-foreground mt-4' }} label="لطفا صبر کنید" variant="simple" /> */}
      </div>
    );
  }

  return (
    <div className="be-comment-block mb-12 border border-[#edeff2] rounded-sm py-12 px-16">
      <h1 className="comments-title text-base text-[#262626] mb-4">
        نظرات ({reviews?.length || 0})
      </h1>

      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="be-comment mb-3 relative">
            <div className="be-img-comment w-[60px] h-[60px] float-right mb-4 relative">
              <a href="#" className="text-[#383b43]">
                <Image
                  fill
                  src="https://uploade.storage.iran.liara.space/my.png"
                  alt="User avatar"
                  className="w-[60px] h-[60px] rounded-[50%]"
                />
              </a>
            </div>
            <div className="be-comment-content ml-[0px] md:ml-[80px]">
              <span className="be-comment-name inline-block w-[49%] mb-4 text-sm mr-3">
                <a href="#" className="text-[#383b43]">
                  {review.name}
                </a>
              </span>
              <span className="be-comment-time text-xs text-[#b4b7c1] text-right inline-block w-[49%] mb-4 mr-3">
                <i className="fa fa-clock-o"></i>
                {new Date(review.createdAt).toLocaleString("fa-IR")}
              </span>
              <div className="mb-2">
                <Rating
                  style={{ maxWidth: 100 }}
                  value={review.rating}
                  readOnly
                  itemStyles={{
                    itemStrokeWidth: 2,
                    activeFillColor: "#f1a545",
                    activeStrokeColor: "#d3d3d3",
                    itemShapes: ThinStar,
                  }}
                />
              </div>
              <p className="be-comment-text text-xs flex md:w-[70%] lg:w-[80%] justify-center text-[#7a8192] bg-[#f6f6f7] border border-[#edeff2] pt-[15px] pr-[20px] pb-[20px] pl-[20px]">
                {review.reviewText}
              </p>
            </div>
            {user?.admin && (
              <button
                onClick={() => handleDelete(review.id)}
                className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-sm"
                disabled={deleteMutation.isPending}
              >
                <i className="bi bi-trash-fill text-red-500 hover:text-red-700"></i>
                حذف
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">هنوز نظری ثبت نشده است.</p>
      )}

      {user ? (
        <form className="form-block mt-6" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <div className="form-group fl_icon my-2">
                <div className="icon">
                  <i className="fa fa-user"></i>
                </div>
                <input
                  type="text"
                  value={user.name || ""}
                  placeholder="نام خود را وارد کنید"
                  className="w-full p-2 border rounded"
                  disabled
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 fl_icon">
              <div className="form-group fl_icon my-2">
                <input
                  type="text"
                  value={user.email || ""}
                  placeholder="ایمیل خود را وارد کنید"
                  className="w-full p-2 border rounded"
                  disabled
                />
              </div>
            </div>
            <div className="col-xs-12 my-2">
              <div className="form-group">
                <label className="block mb-2">امتیاز شما:</label>
                <Rating
                  style={{ maxWidth: 150 }}
                  value={rating}
                  onChange={setRating}
                  itemStyles={{
                    itemShapes: ThinStar,
                    itemStrokeWidth: 2,
                    activeFillColor: "#f1a545",
                    activeStrokeColor: "#d3d3d3",
                  }}
                />
              </div>
            </div>
            <div className="col-xs-12 my-2">
              <div className="form-group">
                <textarea
                  className="form-input h-[150px] text-sm font-normal text-[#b4b7c1] w-full pl-5 pt-2 pr-5 border border-[#edeff2] rounded"
                  placeholder="نظر خود را بنویسید"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? "در حال ارسال..." : "افزودن نظر"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-red-500 text-center mt-6">
          برای ثبت نظر، لطفاً ابتدا{" "}
          <Link href={"/login"} className="mx-1 font-medium text-black">
            وارد حساب کاربری
          </Link>{" "}
          خود شوید.
        </p>
      )}
    </div>
  );
};

export default Reviews;
