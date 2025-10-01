import React from "react";
import styles from "@/styles/NftCard.module.css";
import Image from "next/image";

interface NftCardProps {
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  creatorName: string;
  creatorAvatar: string;
}

const NftCard: React.FC<NftCardProps> = ({
  imageUrl,
  title,
  description,
  price,
  duration,
  creatorName,
  creatorAvatar,
}) => (
  <div className={styles.card}>
    <div className={styles.main}>
      <Image
        src={imageUrl}
        alt="NFT"
        fill
        className="absolute object-fill rounded-md p-1  overflow-hidden  "
        quality={100}
      />
      <h2>{title}</h2>
      <p className={styles.description}>{description}</p>
      <div className={styles.tokenInfo}>
        <div className={styles.price}>
          <ins>◘</ins>
          <p>{price}</p>
        </div>
        <div className={styles.duration}>
          <ins>◷</ins>
          <p>{duration}</p>
        </div>
      </div>
      <hr />
      <div className={styles.creator}>
        <div className={styles.wrapper}>
          <Image
            src={creatorAvatar}
            alt={creatorName}
            fill
            className="absolute object-fill rounded-md p-1  overflow-hidden  "
            quality={100}
          />
        </div>
        <p>
          <ins>Creation of</ins> {creatorName}
        </p>
      </div>
    </div>
  </div>
);

export default NftCard;
