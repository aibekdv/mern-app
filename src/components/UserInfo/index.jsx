import React from "react";
import styles from "./UserInfo.module.scss";

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  const createdAt = new Date(additionalText);
  const dateStamp = `${
    createdAt.getDate() < 10 ? "0" + createdAt.getDate() : createdAt.getDate()
  }.${
    createdAt.getMonth() < 10
      ? "0" + createdAt.getMonth()
      : createdAt.getMonth()
  }.${createdAt.getFullYear()}`;

  const timeStamp = `${
    createdAt.getHours() < 10
      ? "0" + createdAt.getHours()
      : createdAt.getHours()
  }:${
    createdAt.getMinutes() < 10
      ? "0" + createdAt.getMinutes()
      : createdAt.getMinutes()
  }`;

  return (
    <div className={styles.root}>
      <img
        className={styles.avatar}
        src={avatarUrl || "/noavatar.png"}
        alt={fullName}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>
          {dateStamp} &nbsp; {timeStamp}
        </span>
      </div>
    </div>
  );
};
